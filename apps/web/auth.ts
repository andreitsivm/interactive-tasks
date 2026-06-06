import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { users, accounts, verificationTokens } from "@/database/schema/auth";
import { getRolePermissions } from "@/lib/permissions";
import { verifyPreVerifiedToken } from "@/lib/pre-verified-token";
import { sendWelcomeEmail } from "@workspace/mail";
import { getServerSession } from "next-auth/next";
import type { AuthOptions, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { UserRole } from "@workspace/types";

/** Type guard: the user returned from our Credentials authorize callback carries `roles`. */
function hasRoles(
  user: User | AdapterUser,
): user is (User | AdapterUser) & { roles: string[] } {
  return (
    "roles" in user && Array.isArray((user as Record<string, unknown>).roles)
  );
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { token, mode } = credentials as {
          token: string;
          mode: "signin" | "signup";
        };

        let email: string;
        try {
          email = await verifyPreVerifiedToken(token);
        } catch {
          return null;
        }

        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (mode === "signin") {
          return existingUser ?? null;
        }

        // mode === 'signup'
        if (existingUser) return existingUser;

        const [newUser] = await db
          .insert(users)
          .values({
            email,
            name: email.split("@")[0],
            roles: ["member"],
          })
          .returning();

        if (newUser) {
          sendWelcomeEmail(email, newUser.name ?? email).catch(
            (err: unknown) => {
              console.error("[auth] Failed to send welcome email:", err);
            },
          );
        }

        return newUser ?? null;
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.roles = (hasRoles(user) ? user.roles : ["member"]) as UserRole[];
        token.permissions = getRolePermissions(token.roles);
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.permissions = token.permissions;
      session.accessToken = token.sub ?? "";
      return session;
    },
  },
};

/**
 * Server-side session helper — call from Server Components and Route Handlers.
 */
export const auth = () => getServerSession(authOptions);

export const handlers = NextAuth(authOptions);

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { users, accounts, verificationTokens } from "@/database/schema/auth";
import { getRolePermissions } from "@/lib/permissions";
import { verifyPreVerifiedToken } from "@/lib/pre-verified-token";
import { sendWelcomeEmail } from "@workspace/mail";
import { getServerSession } from "next-auth/next";
import type { AuthOptions, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { UserRole, IJwtPayload, SubscriptionPlan } from "@workspace/types";

function hasRoles(
  user: User | AdapterUser,
): user is (User | AdapterUser) & { roles: string[] } {
  return (
    "roles" in user && Array.isArray((user as Record<string, unknown>).roles)
  );
}

function hasSubscriptionPlan(
  user: User | AdapterUser,
): user is (User | AdapterUser) & { subscriptionPlan: SubscriptionPlan } {
  const plan = (user as unknown as Record<string, unknown>).subscriptionPlan;
  return plan === "trial" || plan === "pro" || plan === "expired";
}

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

async function signApiToken(payload: IJwtPayload): Promise<string> {
  const { sub, email, roles, permissions, subscriptionPlan } = payload;
  return new SignJWT({ sub, email, roles, permissions, subscriptionPlan })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecret());
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
        const { token } = credentials as { token: string };

        let email: string;
        let mode: "signin" | "signup";
        try {
          ({ email, mode } = await verifyPreVerifiedToken(token));
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
          const appUrl = process.env.NEXTAUTH_URL ?? "";
          if (appUrl) {
            sendWelcomeEmail(email, newUser.name ?? email, appUrl).catch(
              (err: unknown) => {
                console.error("[auth] Failed to send welcome email:", err);
              },
            );
          }
        }

        return newUser ?? null;
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.roles = (hasRoles(user) ? user.roles : ["member"]) as UserRole[];
        token.permissions = getRolePermissions(token.roles);
        token.subscriptionPlan = hasSubscriptionPlan(user)
          ? user.subscriptionPlan
          : null;
      }
      // Always keep accessToken fresh — NestJS passport-jwt verifies this
      const apiPayload: IJwtPayload = {
        sub: token.id,
        email: token.email ?? "",
        roles: token.roles,
        permissions: token.permissions,
        subscriptionPlan: token.subscriptionPlan,
      };
      token.accessToken = await signApiToken(apiPayload);
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.permissions = token.permissions;
      session.user.subscriptionPlan = token.subscriptionPlan ?? null;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);

export const handlers = NextAuth(authOptions);

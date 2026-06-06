import Link from "next/link";
import { oauthProviders } from "@/config/auth";
import { sendOtp } from "@/actions/auth/send-otp";

async function sendOtpAction(formData: FormData) {
  "use server";
  await sendOtp(null, formData);
}

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email to receive a sign-in code.
        </p>
      </div>

      <form action={sendOtpAction} className="space-y-4">
        <input type="hidden" name="mode" value="signin" />
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Continue with email
        </button>
      </form>

      {oauthProviders.google && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-2">or</span>
            </div>
          </div>
          <Link
            href="/api/auth/signin/google?callbackUrl=/dashboard"
            className="flex w-full items-center justify-center rounded-md border border-border bg-background py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Continue with Google
          </Link>
        </>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

import { VerifyForm } from "./_components/VerifyForm";

interface Props {
  searchParams: Promise<{ email?: string; mode?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { email = "", mode = "signin" } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground mt-1">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <VerifyForm email={email} mode={mode} />

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <a
          href={`/${mode === "signup" ? "sign-up" : "sign-in"}`}
          className="underline underline-offset-4 hover:text-primary"
        >
          Go back and resend
        </a>
      </p>
    </div>
  );
}

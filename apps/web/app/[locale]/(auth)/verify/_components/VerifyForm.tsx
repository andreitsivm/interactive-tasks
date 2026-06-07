"use client";

import { useRef, useEffect, useActionState } from "react";
import { signIn } from "next-auth/react";
import { verifyOtp } from "@/actions/auth/verify-otp";
import type { VerifyOtpResult } from "@/actions/auth/verify-otp";

interface VerifyFormProps {
  email: string;
  mode: string;
}

export function VerifyForm({ email, mode }: VerifyFormProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hiddenRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState<
    VerifyOtpResult | null,
    FormData
  >(verifyOtp, null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!state) return;
    if ("preVerifiedToken" in state) {
      void signIn("credentials", {
        token: state.preVerifiedToken,
        callbackUrl: mode === "signup" ? "/checkout" : "/dashboard",
        redirect: true,
      });
    }
  }, [state, mode]);

  function updateHidden() {
    const value = inputRefs.current.map((el) => el?.value ?? "").join("");
    if (hiddenRef.current) hiddenRef.current.value = value;
  }

  function handleInput(index: number) {
    updateHidden();
    if (inputRefs.current[index]?.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      e.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    digits.split("").forEach((digit, i) => {
      const el = inputRefs.current[i];
      if (el) el.value = digit;
    });
    updateHidden();
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  const errorMessage = state && "error" in state ? state.error : null;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="mode" value={mode} />
      <input ref={hiddenRef} type="hidden" name="code" />

      <div className="flex gap-2 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            pattern="\d"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            disabled={isPending}
            className="w-11 h-12 rounded-md border border-input bg-background text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            onInput={() => handleInput(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive text-center">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}

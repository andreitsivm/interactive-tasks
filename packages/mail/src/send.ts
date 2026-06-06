import { resend } from "./client.js";
import { renderOtpEmail } from "./render/otp.js";
import { renderWelcomeEmail } from "./render/welcome.js";

const FROM = process.env.MAIL_FROM ?? "noreply@example.com";

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const html = await renderOtpEmail(code);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your sign-in code",
    html,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<void> {
  const html = await renderWelcomeEmail(name);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to InteractiveTasks",
    html,
  });
}

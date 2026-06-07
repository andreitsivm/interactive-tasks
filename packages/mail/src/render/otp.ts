import { render } from "@react-email/render";
import { createElement } from "react";
import { OtpEmail } from "../templates/otp";

export async function renderOtpEmail(code: string): Promise<string> {
  return render(createElement(OtpEmail, { code }));
}

import { render } from "@react-email/render";
import { createElement } from "react";
import { WelcomeEmail } from "../templates/welcome";

export async function renderWelcomeEmail(name: string): Promise<string> {
  return render(createElement(WelcomeEmail, { name }));
}

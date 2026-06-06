export interface IOtpRequest {
  email: string;
  mode: "signin" | "signup";
}

export interface IOtpVerifyRequest {
  email: string;
  code: string;
  mode: "signin" | "signup";
}

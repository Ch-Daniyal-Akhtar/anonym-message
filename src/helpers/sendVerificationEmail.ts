import { resend } from "@/lib/resend";

import VerficationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Anonym Message <noreply@daniyaldev.me>",
      to: email,
      subject: "Anonym Message | Verification Code",
      react: VerficationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verification email send Successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}

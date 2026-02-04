import type { APIRoute } from "astro";
import crypto from "crypto";
import User from "@/model/User";
import PasswordResetOtp from "@/model/PasswordResetOtp";
import connect from "@/lib/connection";
import nodemailer from "nodemailer";

const generateOtp = () => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
};

const OTP_TTL_MS = 2 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    await connect();
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(JSON.stringify({ message: "Database connection failed" }), {
      status: 500,
      headers,
    });
  }

  try {
    if (!request.body) {
      return new Response(JSON.stringify({ message: "Request body is required" }), {
        status: 400,
        headers,
      });
    }

    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
        headers,
      });
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
        headers,
      });
    }

    const emailHost = import.meta.env.EMAIL_HOST || "smtp.gmail.com"; // Gmail's SMTP server (email service provider)
    const emailPort = Number(import.meta.env.EMAIL_PORT || 587); // SMTP port
    const emailSecure = String(import.meta.env.EMAIL_SECURE || "false") === "true"; // TLS is used instead
    const emailUser = import.meta.env.EMAIL_USER; // Sender email (hosting email)
    const emailPass = import.meta.env.EMAIL_PASSWORD; // 16-char app password for sender email
    const emailFrom =
      import.meta.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>'; // "From" address users see
    const allowSendInDev =
      String(import.meta.env.EMAIL_SEND_IN_DEV || "false") === "true";

    if (!emailUser || !emailPass) {
      console.error("EMAIL_USER or EMAIL_PASSWORD not configured");
    }

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: emailUser && emailPass ? { user: emailUser, pass: emailPass } : undefined,
    });

    const user = await User.findOne({ email });

    if (user) {
      const latestOtp = await PasswordResetOtp.findOne({ userId: user._id }).sort({
        createdAt: -1,
      });

      if (
        latestOtp?.createdAt &&
        Date.now() - latestOtp.createdAt.getTime() < RESEND_COOLDOWN_MS
      ) {
        return new Response(
          JSON.stringify({
            message: "Please wait before requesting another OTP.",
          }),
          { status: 429, headers }
        );
      }

      const otp = generateOtp();
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
      const expiresAt = new Date(Date.now() + OTP_TTL_MS);

      await PasswordResetOtp.deleteMany({ userId: user._id });
      await PasswordResetOtp.create({
        userId: user._id,
        otpHash,
        expiresAt,
      });

      const shouldSendEmail =
        (!import.meta.env.DEV || allowSendInDev) && emailUser && emailPass;

      if (shouldSendEmail) {
        await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Password Reset OTP",
          text: `Your password reset OTP is: ${otp}. Valid for 2 minutes.`,
          html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>Valid for 2 minutes.</p>`,
        });
      } else {
        console.log(`Password reset OTP for ${email}: ${otp}`);
      }

      if (import.meta.env.DEV) {
        return new Response(
          JSON.stringify({ message: "If the email exists, we sent an OTP.", otp }),
          { status: 200, headers }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "If the email exists, we sent an OTP." }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

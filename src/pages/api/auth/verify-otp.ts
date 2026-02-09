import type { APIRoute } from "astro";
import crypto from "crypto";
import User from "@/model/User";
import PasswordResetOtp from "@/model/PasswordResetOtp";
import connect from "@/lib/connection";

const RESET_WINDOW_MS = 10 * 60 * 1000;

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

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ message: "Email and OTP are required" }), {
        status: 400,
        headers,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid OTP or expired" }), {
        status: 400,
        headers,
      });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    const otpRecord = await PasswordResetOtp.findOne({
      userId: user._id,
      otpHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return new Response(JSON.stringify({ message: "Invalid OTP or expired" }), {
        status: 400,
        headers,
      });
    }

    const now = new Date();
    otpRecord.usedAt = now;
    otpRecord.expiresAt = new Date(now.getTime() + RESET_WINDOW_MS);
    await otpRecord.save();

    await PasswordResetOtp.deleteMany({ userId: user._id, _id: { $ne: otpRecord._id } });

    return new Response(JSON.stringify({ message: "OTP verified" }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
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

    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), {
        status: 400,
        headers,
      });
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 6 characters" }),
        { status: 400, headers }
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "OTP verification required" }), {
        status: 400,
        headers,
      });
    }

    const validOtp = await PasswordResetOtp.findOne({
      userId: user._id,
      usedAt: { $ne: null, $gte: new Date(Date.now() - RESET_WINDOW_MS) },
    });

    if (!validOtp) {
      return new Response(
        JSON.stringify({ message: "OTP verification required or expired" }),
        { status: 400, headers }
      );
    }

    user.password = password;
    await user.save();

    await PasswordResetOtp.deleteMany({ userId: user._id });

    return new Response(JSON.stringify({ message: "Password reset successful" }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

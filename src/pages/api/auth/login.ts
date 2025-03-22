import type { APIRoute } from "astro";
import { User } from "@/models/User";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {
    await connect();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide email and password",
        }),
        { status: 400 }
      );
    }

    // Find user and include password for verification
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid credentials",
        }),
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid credentials",
        }),
        { status: 401 }
      );
    }

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    return new Response(
      JSON.stringify({
        success: true,
        _id: user._id,
        email: user.email,
        name: user.name,
        token,
        refreshToken,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
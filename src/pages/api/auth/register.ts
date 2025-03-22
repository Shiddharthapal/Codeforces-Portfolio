import type { APIRoute } from "astro";
import { User } from "@/models/User";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {
    await connect();

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide all required fields",
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists",
        }),
        { status: 400 }
      );
    }

    // Create new user
    const user = User.build({
      name,
      email,
      password,
    });

    // Save user to database
    await user.save();

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
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error instanceof Error && 'errors' in error) {
      const validationErrors = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
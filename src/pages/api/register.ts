import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";
import User from "@/model/User";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide all required fields",
        }),
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Connect to database
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create new user - simplified (no need to set twice)
    const user = new User({
      email,
      password, // Make sure your User model hashes this!
    });

    // Save user to database
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      import.meta.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({
        token,
        message: "Registration successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Return proper JSON error
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
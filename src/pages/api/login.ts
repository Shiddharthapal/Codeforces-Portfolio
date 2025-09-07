import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";
import User from "@/model/User";
import connect from "@/lib/connection";
import type { Token } from "@/types/token";
import mongoose from "mongoose";

export const POST: APIRoute = async ({ request }) => {
  // Headers for all responses
  const headers = {
    "Content-Type": "application/json",
  };

  // Establish database connection first
  try {
    await connect();
  } catch (error) {
    console.error("Database connection error:", error);

    let errorMessage = "Database connection failed";
    if (error instanceof Error) {
      // Check for specific connection issues
      if (error.message.includes("MONGODB_URI")) {
        errorMessage = "Database configuration error. Please contact support.";
      } else if (error.message.includes("ServerSelectionTimeoutError")) {
        errorMessage =
          "Unable to reach database server. Please try again later.";
      } else {
        errorMessage = "Database connection error. Please try again later.";
      }
    }

    return new Response(
      JSON.stringify({
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      }),
      { status: 500, headers }
    );
  }

  try {
    if (!request.body) {
      return new Response(
        JSON.stringify({ message: "Request body is required" }),
        { status: 400, headers }
      );
    }

    const { email, name, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers }
      );
    }

    // Email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
        headers,
      });
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers,
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers,
      });
    }

    // Ensure JWT_SECRET is set
    const jwtSecret = import.meta.env.JWT_SECRET || "your_jwt_secret";
    if (!jwtSecret) {
      console.error("JWT_SECRET is not set in environment variables");
      return new Response(
        JSON.stringify({
          message: "Authentication configuration error",
          details:
            process.env.NODE_ENV === "development"
              ? "JWT_SECRET environment variable is not set"
              : undefined,
        }),
        { status: 500, headers }
      );
    }

    const payload: Token = {
      userId: user._id.toString(), // Convert ObjectId to string
    };

    // Generate token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

    // Return success response
    return new Response(
      JSON.stringify({
        _id: user?._id,
        token,
        message: "Login successful",
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Login error:", error);

    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ message: "Invalid request format" }),
        { status: 400, headers }
      );
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

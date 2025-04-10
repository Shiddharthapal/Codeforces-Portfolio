import  jwt from 'jsonwebtoken';
import type { APIRoute } from "astro";
import  User  from '@/model/User';
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {

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

    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User with this email already exists",
        }),
        { status: 400,
          headers: {
            "Content-Type": "application/json",
          },
         }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    // Save user to database
    await user.save();

    // Generate tokens
    const token = jwt.sign(
      { id: user._id },
      import.meta.env.JWT_SECRET||'your_jwt_secret',
      { expiresIn: "24h" },
      );

    return new Response(
      JSON.stringify({
        token,
        message: "Registration successful",
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
    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      { status: 500,
        headers: {
          "Content-Type": "application/json",
        },
       }
    );
  }
};
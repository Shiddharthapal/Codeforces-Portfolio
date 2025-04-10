import jwt  from 'jsonwebtoken';
import type { APIRoute } from "astro";
import  User  from "@/model/User";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {
  
    const { email, password } = await request.json();

     await connect();
    // Find user and include password for verification
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        { status: 401 ,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Password is incorrect",
        }),
        { status: 401,
          headers: {
            "Content-Type": "application/json",
          },
         }
      );
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user._id},
      import.meta.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        _id: user._id,
        token,
        message: "Login successful",
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
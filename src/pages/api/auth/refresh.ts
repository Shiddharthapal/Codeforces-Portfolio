import type { APIRoute } from "astro";
import { User } from "@/models/User";
import connect from "@/lib/connection";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    await connect();

    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Refresh token is required",
        }),
        { status: 401 }
      );
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret'
      ) as JwtPayload;

      // Get user
      const user = await User.findById(decoded.id);
      if (!user) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid refresh token",
          }),
          { status: 401 }
        );
      }

      // Generate new access token
      const token = user.generateAuthToken();

      return new Response(
        JSON.stringify({
          success: true,
          token,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid refresh token",
        }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
import { verifyToken } from "./../../utils/token";
import type { APIRoute } from "astro";
import UserDetails from "@/model/UserDetails";
import connect from "@/lib/connection";
import mongoose from "mongoose";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const data = await request.json();
    const { name, email, username, codeforces } = data;

    // Validate required fields
    if (!name || !email || !username || !codeforces) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          details: {
            name: !name ? "Name is required" : null,
            email: !email ? "Email is required" : null,
            username: !username ? "Username is required" : null,
            codeforces: !codeforces ? "Codeforces handle is required" : null,
          },
        }),
        { status: 400, headers }
      );
    }

    const token = request.headers.get("Authorization");
    console.log("🧞‍♂️token --->", token);
    // Verify token
    let verifiedUserId = null;
    try {
      const verifyTokenData = await verifyToken(token || "");
      console.log("🧞‍♂️verifyTokenData --->", verifyTokenData);
      verifiedUserId = verifyTokenData.userId;
      console.log("🧞‍♂️verifiedUserId --->", verifiedUserId);
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: "Invalid authorization token",
          error:
            error instanceof Error
              ? error.message
              : "Token verification failed",
        }),
        { status: 401, headers }
      );
    }
    // Connect to database
    await connect();
    // Find existing user
    let user = await UserDetails.findOne({ userId: verifiedUserId });
    console.log("user ==> ", user);
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      isNewUser = true;
      user = new UserDetails({
        userId: verifiedUserId,
        name,
        email,
        username,
        codeforces,
      });
    }
    console.log("user ==> ", user);
    // Update user details
    user.name = name;
    user.email = email;
    user.username = username;
    user.codeforces = codeforces;
    user.updatedAt = new Date();

    // Save user
    await user.save();
    console.log("user ==> ", user);
    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser
          ? "User details created successfully"
          : "User details updated successfully",
      }),
      { status: isNewUser ? 201 : 200, headers }
    );
  } catch (error) {
    console.error("Error handling user details:", error);

    // Handle specific error types
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        }),
        { status: 400, headers }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return new Response(
        JSON.stringify({
          message: "Invalid data format",
        }),
        { status: 400, headers }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Failed to handle user details",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};


import type { APIRoute } from "astro";
import UserDetails from "@/model/UserDetails";
import User from "@/model/User";
import connect from "@/lib/connection";


export const GET: APIRoute = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Connect to database
    await connect();
    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }), 
        { status: 400, headers }
      );
    }

    // Fetch user details
    const user = await User.findOne({_id: id });
    const userDetails = await UserDetails.findOne({ userId: id });
    if (!userDetails) {
      return new Response(
        JSON.stringify({ message: "User details not found go for create account" }), 
        { status: 404, headers }
      );
    }
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found go for create account" }), 
        { status: 404, headers }
      );
    }

    // Return user details
    return new Response(
      JSON.stringify({ userDetails, user }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("Error fetching user details:", error);
    return new Response(
      JSON.stringify({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined 
      }), 
      { status: 500, headers }
    );
  }
};
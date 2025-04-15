
import type { APIRoute } from "astro";
import User from "@/model/User";
import connect from "@/lib/connection";


export const GET: APIRoute = async () => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Connect to database
    await connect();

    // Fetch user details
    const userDetails = await User.find();
    if (!userDetails) {
      return new Response(
        JSON.stringify({ message: "User details not found go for create account" }), 
        { status: 404, headers }
      );
    }

    //console.log("userdetails=>",userDetails);

    // Return user details
    return new Response(
      JSON.stringify(userDetails),
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
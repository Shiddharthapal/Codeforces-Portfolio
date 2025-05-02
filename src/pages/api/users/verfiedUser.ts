
import { verifyToken } from "@/utils/token";
import type { APIRoute } from "astro";


export const POST: APIRoute = async ({request}) => {
    const headers = {
    "Content-Type": "application/json"
  };
  let token= request.headers.get("Authorization");

  try {
    let verifiedToken=await verifyToken(token||"");
    let verifiedTokenUserId=verifiedToken.userId;
    // Return user response
    return new Response(
      JSON.stringify(verifiedTokenUserId),
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
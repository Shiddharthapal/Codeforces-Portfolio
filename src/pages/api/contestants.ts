import { verifyToken } from './../../utils/token';
import type { APIRoute } from "astro";
import  UserDetails  from "@/model/UserDetails";
import connect from "@/lib/connection";
import mongoose from "mongoose";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {

    const data = await request.json();
    const {
      name,
      department,
      semester,
      vjudge,
      codeforces,
      clist,
      atcoder,
      codechef
    } = data;

    

    // Validate required fields
    if (!name || !department) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          details: {
            
            name: !name ? "Name is required" : null,
            department: !department ? "Department is required" : null
          }
        }),
        { status: 400, headers }
      );
    }

    const token = request.headers.get("Authorization");
    // Verify token
    let verifiedUserId;
    try {
      const verifyTokenData = await verifyToken(token||"");
      verifiedUserId = verifyTokenData.userId;
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: "Invalid authorization token",
          error: error instanceof Error ? error.message : "Token verification failed"
        }),
        { status: 401, headers }
      );
    }

    // Connect to database
    await connect();

    // Find existing user
    let user = await UserDetails.findOne({ userId: verifiedUserId });
    //console.log("user ==> ", user);
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      isNewUser = true;
      user = new UserDetails({
        userId: verifiedUserId,
        name,
        department
      });
    }
    console.log("user ==> ", user);
    // Update user details
    user.name = name;
    user.department = department;
    if (semester !== undefined) user.semester = semester;
    if (vjudge !== undefined) user.vjudge = String(vjudge);
    if (codeforces !== undefined) user.codeforces = codeforces;
    if (clist !== undefined) user.clist = clist;
    if (atcoder !== undefined) user.atcoder = atcoder;
    if (codechef !== undefined) user.codechef = codechef;

    // Save user
    await user.save();
    console.log("user ==> ", user);
    return new Response(
      JSON.stringify({
        message: isNewUser ? "User details created successfully" : "User details updated successfully",
        user: {
          userId: user.userId,
          name: user.name,
          department: user.department,
          semester: user.semester,
          vjudge: user.vjudge,
          codeforces: user.codeforces,
          clist: user.clist,
          atcoder: user.atcoder,
          codechef: user.codechef
        }
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
          errors: Object.values(error.errors).map(err => err.message)
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
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
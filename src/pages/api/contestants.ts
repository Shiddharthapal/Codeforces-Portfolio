import { verifyToken } from './../../utils/token';
import type { APIRoute } from "astro";
import  UserDetails  from "@/model/UserDetails";
import  User  from '@/model/User';
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log("request=>",request);
    const {userId, name, department, semester,vjudge,codeforces,clist,atcoder,codechef } = await request.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({
          message: "Authorization token is missing",
        }),
        { 
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const verifyTokenData = await verifyToken(userId);
    await connect();

    const user = await UserDetails.findById(verifyTokenData?.userId);
    
    if (!user) {
      // Create new user if not exists
      const newUser = new UserDetails({
        userId,
        name,
        department,
        semester,
        vjudge,
        codeforces,
        clist,
        atcoder,
        codechef
      });
      await newUser.save();
      return newUser;
    }
    // Update user details
    if(userId) user.userId = userId;
    if (name) user.name = name;
    if (department) user.department = department;
    if (semester) user.semester = semester;
    if (vjudge) user.vjudge = vjudge;
    if (codeforces) user.codeforces = codeforces;
    if (clist) user.clist = clist;
    if (atcoder) user.atcoder = atcoder;
    if (codechef) user.codechef = codechef;
    // Save the updated user
    await user.save();
    
    return new Response(
      JSON.stringify({
        message: "User details updated successfully",
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          department: user.department,
          semester: user.semester,
          vjudge: user.vjudge,
          codeforces: user.codeforces,
          clist: user.clist,
          atcoder: user.atcoder,
          codechef: user.codechef

        }
      }),
      { 
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating user details:", error);
    
    return new Response(
      JSON.stringify({
        message: "Failed to update user details",
        error: error instanceof Error ? error.message : "Unknown error"
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

import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from '@/model/UserDetails';
import { verifyToken } from '@/utils/token';

export const POST: APIRoute = async ({ request }) => {
  const headers= {
          "Content-Type": "application/json",
        }
  try {
    const data = await request.json();
    await connect();
    let token= request.headers.get("Authorization");
    const verifytoken= await verifyToken(token||"");
    const user= await UserDetails.findOne({ userId: verifytoken.userId });

    user.name = data.name;
    user.department = data.department;
    if (data.semester !== undefined) user.semester = data.semester;
    if (data.vjudge !== undefined) user.vjudge = String(data.vjudge);
    if (data.codeforces !== undefined) user.codeforces = data.codeforces;
    if (data.clist !== undefined) user.clist = data.clist;
    if (data.atcoder !== undefined) user.atcoder = data.atcoder;
    if (data.codechef !== undefined) user.codechef = data.codechef;

    // Save user to database
    await user.save();

    return new Response(
      JSON.stringify({

        message: "Update successful",
      }),
      {
        status: 201,
        headers
      }
    );
  } catch (error) {
    console.error("update error:", error);
    return new Response(
      JSON.stringify({
        message: "Update not successful!",
      }),
      { status: 500,
        headers
       }
    );
  }
};
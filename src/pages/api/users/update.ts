
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
    await connect();
    let token= request.headers.get("Authorization");
    const verifytoken= await verifyToken(token||"");
    const user= await UserDetails.findOne({ userId: verifytoken.userId });

    user.name =name;
    user.department =department;
    if (semester !== undefined) user.semester = semester;
    if (vjudge !== undefined) user.vjudge = String(vjudge);
    if (codeforces !== undefined) user.codeforces = codeforces;
    if (clist !== undefined) user.clist =clist;
    if (atcoder !== undefined) user.atcoder = atcoder;
    if (codechef !== undefined) user.codechef =codechef;

    // Save user to database
    await user.save();

    return new Response(
      JSON.stringify({

        success: true,
        message: "Update successfully",
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
      {
        status: 200,
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
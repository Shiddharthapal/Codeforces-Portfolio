
import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from '@/model/UserDetails';
import User from '@/model/User';

export const POST: APIRoute = async ({ request }) => {
  const headers= {
          "Content-Type": "application/json",
        }
  try {
    const data = await request.json();
    await connect();

    const user =await User.findOne({_id:data.id});
    if(user){
        await User.deleteOne({_id:data.id});
    }
    const userdetails= await UserDetails.findOne({userId:data.id});
    if(userdetails){
        await UserDetails.deleteOne({_id:userdetails._id});
    }
    const allUser= await User.find();
    if (!allUser) {
      return new Response(
        JSON.stringify({ message: "No user found" }),
        { status: 404, headers }
      );
    }

    return new Response(
      JSON.stringify(allUser),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(
      JSON.stringify({
        message: "Delete not successful!",
      }),
      { status: 500,
        headers
       }
    );
  }
};
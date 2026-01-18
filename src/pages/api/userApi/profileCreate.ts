import type { APIRoute } from "astro";
import UserDetails from "@/model/UserDetails";
import User from "@/model/User";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const profileData = await request.json();
    // console.log("profileData ==> ", profileData);

    // Validate required fields
    const { id, newProfile } = profileData;
    const { department, universityName, name, username, codeforces } =
      newProfile;

    if (!department || !universityName || !name) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          required: [
            "department",
            "universityName",
            "name",
            "username",
          ],
        }),
        { status: 400, headers }
      );
    }

    // Connect to database
    await connect();

    // Check if user exists
    const user = await User.findById({ _id: id });
    // console.log("user ==> ", user);
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404, headers }
      );
    }

    // Check if profile already exists
    let profiledetails = await UserDetails.findOne({ userId: id });
    // console.log("profiledetails ==> ", profiledetails);
    if (!profiledetails) {
      profiledetails = new UserDetails({
        userId: id,
        department,
        universityName,
        email: user?.email,
        name,
        username,
        codeforces: codeforces || "",
        createdAt: new Date(),
      });

      const savedProfile = await profiledetails.save();
      // console.log("savedProfile ==> ", savedProfile);
    } else {
      (profiledetails.name = name || profiledetails.name),
        (profiledetails.username = username || profiledetails.username),
        (profiledetails.universityName =
          universityName || profiledetails.universityName),
        (profiledetails.department = department || profiledetails.department),
        (profiledetails.codeforces = codeforces || profiledetails.codeforces),
        await profiledetails.save();
    }

    return new Response(
      JSON.stringify({
        message: "Profile created successfully",
        profile: profiledetails,
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      }),
      { status: 500, headers }
    );
  }
};

import { U as UserDetails } from '../../../chunks/UserDetails_FAlKQu3v.mjs';
import { U as User } from '../../../chunks/user_BoVRk9tZ.mjs';
import { c as connect } from '../../../chunks/connection_DAbYXkXZ.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const profileData = await request.json();
    const { _id, newProfile } = profileData;
    const { department, universityName, name, username, codeforces } = newProfile;
    if (!department || !universityName || !name) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          required: [
            "department",
            "universityName",
            "email",
            "name",
            "username"
          ]
        }),
        { status: 400, headers }
      );
    }
    await connect();
    const user = await User.findById({ _id });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        { status: 404, headers }
      );
    }
    let profiledetails = await UserDetails.findOne({ userId: _id });
    if (!profiledetails) {
      profiledetails = new UserDetails({
        userId: _id,
        department,
        universityName,
        email: user?.email,
        name,
        username,
        codeforces: codeforces || "",
        createdAt: /* @__PURE__ */ new Date()
      });
      const savedProfile = await profiledetails.save();
    } else {
      profiledetails.name = name || profiledetails.name, profiledetails.username = username || profiledetails.username, profiledetails.universityName = universityName || profiledetails.universityName, profiledetails.department = department || profiledetails.department, profiledetails.codeforces = codeforces || profiledetails.codeforces, await profiledetails.save();
    }
    return new Response(
      JSON.stringify({
        message: "Profile created successfully",
        profile: profiledetails
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? String(error) : void 0
      }),
      { status: 500, headers }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import jwt from 'jsonwebtoken';
import { U as UserDetails } from '../../chunks/UserDetails_FAlKQu3v.mjs';
import { c as connect } from '../../chunks/connection_suXsM9xL.mjs';
import mongoose from 'mongoose';
export { renderers } from '../../renderers.mjs';

const verifyToken = async (token) => {
  let verifyToken2 = jwt.verify(
    token,
    "your_jwt_secret_key"
  );
  return verifyToken2;
};

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const data = await request.json();
    const { name, email, username, codeforces } = data;
    if (!name || !email || !username || !codeforces) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          details: {
            name: !name ? "Name is required" : null,
            email: !email ? "Email is required" : null,
            username: !username ? "Username is required" : null,
            codeforces: !codeforces ? "Codeforces handle is required" : null
          }
        }),
        { status: 400, headers }
      );
    }
    const token = request.headers.get("Authorization");
    let verifiedUserId = null;
    try {
      const verifyTokenData = await verifyToken(token || "");
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
    await connect();
    let user = await UserDetails.findOne({ userId: verifiedUserId });
    console.log("user ==> ", user);
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = new UserDetails({
        userId: verifiedUserId,
        email,
        name,
        username,
        codeforces
      });
    }
    console.log("user1 ==> ", user);
    await user.save();
    console.log("user ==> ", user);
    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser ? "User details created successfully" : "User details updated successfully"
      }),
      { status: isNewUser ? 201 : 200, headers }
    );
  } catch (error) {
    console.error("Error handling user details:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message)
        }),
        { status: 400, headers }
      );
    }
    if (error instanceof mongoose.Error.CastError) {
      return new Response(
        JSON.stringify({
          message: "Invalid data format"
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

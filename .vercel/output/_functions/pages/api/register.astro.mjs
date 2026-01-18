import jwt from 'jsonwebtoken';
import { U as User } from '../../chunks/User_tqs9H9uk.mjs';
import { c as connect } from '../../chunks/connection_B9bDQ4iN.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide all required fields"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    await connect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const user = new User({
      email,
      password
      // Make sure your User model hashes this!
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id },
      undefined                           || "your_jwt_secret",
      { expiresIn: "1d" }
    );
    return new Response(
      JSON.stringify({
        token,
        message: "Registration successful"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

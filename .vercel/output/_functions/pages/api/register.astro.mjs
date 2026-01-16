import jwt from 'jsonwebtoken';
import { U as User } from '../../chunks/User_BoVRk9tZ.mjs';
import { c as connect } from '../../chunks/connection_suXsM9xL.mjs';
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
        { status: 400 }
      );
    }
    await connect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
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
    });
    user.email = email;
    user.password = password;
    await user.save();
    const token = jwt.sign(
      { id: user._id },
      undefined                           || "your_jwt_secret",
      { expiresIn: "24h" }
    );
    let _id = user._id;
    return new Response(
      JSON.stringify({
        _id,
        token,
        message: "Registration successful"
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error"
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

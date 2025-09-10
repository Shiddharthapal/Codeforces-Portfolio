import jwt from 'jsonwebtoken';
import { U as User } from '../../chunks/user_BoVRk9tZ.mjs';
import { c as connect } from '../../chunks/connection_DAbYXkXZ.mjs';
import 'mongoose';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
  } catch (error) {
    console.error("Database connection error:", error);
    let errorMessage = "Database connection failed";
    if (error instanceof Error) {
      if (error.message.includes("MONGODB_URI")) {
        errorMessage = "Database configuration error. Please contact support.";
      } else if (error.message.includes("ServerSelectionTimeoutError")) {
        errorMessage = "Unable to reach database server. Please try again later.";
      } else {
        errorMessage = "Database connection error. Please try again later.";
      }
    }
    return new Response(
      JSON.stringify({
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : String(error) : void 0
      }),
      { status: 500, headers }
    );
  }
  try {
    if (!request.body) {
      return new Response(
        JSON.stringify({ message: "Request body is required" }),
        { status: 400, headers }
      );
    }
    const { email, name, password } = await request.json();
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400, headers }
      );
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "Invalid email format" }), {
        status: 400,
        headers
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers
      });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers
      });
    }
    const jwtSecret = "your_jwt_secret_key";
    if (!jwtSecret) ;
    const payload = {
      userId: user._id.toString()
      // Convert ObjectId to string
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
    return new Response(
      JSON.stringify({
        _id: user?._id,
        token,
        message: "Login successful"
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ message: "Invalid request format" }),
        { status: 400, headers }
      );
    }
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers
      });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

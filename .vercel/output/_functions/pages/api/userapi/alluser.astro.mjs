import { U as User } from '../../../chunks/User_BoVRk9tZ.mjs';
import { c as connect } from '../../../chunks/connection_suXsM9xL.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
    const userDetails = await User.find();
    if (!userDetails) {
      return new Response(
        JSON.stringify({ message: "User details not found go for create account" }),
        { status: 404, headers }
      );
    }
    return new Response(
      JSON.stringify(userDetails),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

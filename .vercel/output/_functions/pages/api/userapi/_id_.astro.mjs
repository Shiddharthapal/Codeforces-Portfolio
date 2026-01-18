import { U as UserDetails } from '../../../chunks/UserDetails_FAlKQu3v.mjs';
import { U as User } from '../../../chunks/User_tqs9H9uk.mjs';
import { c as connect } from '../../../chunks/connection_B9bDQ4iN.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
        headers
      });
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found go for create account" }),
        { status: 404, headers }
      );
    }
    const userDetails = await UserDetails.findOne({ userId: id });
    if (!userDetails) {
      return new Response(
        JSON.stringify({
          message: "User details not found go for create account"
        }),
        { status: 404, headers }
      );
    }
    return new Response(JSON.stringify({ userDetails, user }), {
      status: 200,
      headers
    });
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

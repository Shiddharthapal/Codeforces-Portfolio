import crypto from 'crypto';
import { U as User } from '../../../chunks/User_tqs9H9uk.mjs';
import { P as PasswordResetToken } from '../../../chunks/PasswordResetToken_WcpnX0i4.mjs';
import { c as connect } from '../../../chunks/connection_B9bDQ4iN.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({ message: "Database connection failed" }),
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
    const { email } = await request.json();
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
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
    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 1e3 * 60 * 30);
      await PasswordResetToken.deleteMany({ userId: user._id });
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt
      });
      const origin = new URL(request.url).origin;
      const resetLink = `${origin}/reset-password?token=${rawToken}`;
      console.log(`Password reset link for ${email}: ${resetLink}`);
      if (false) ;
    }
    return new Response(
      JSON.stringify({ message: "If the email exists, we sent a reset link." }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
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

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
    const { token, password } = await request.json();
    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Token and password are required" }),
        { status: 400, headers }
      );
    }
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 6 characters" }),
        { status: 400, headers }
      );
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: /* @__PURE__ */ new Date() }
    });
    if (!resetRecord) {
      return new Response(
        JSON.stringify({ message: "Reset token is invalid or expired" }),
        { status: 400, headers }
      );
    }
    const user = await User.findById(resetRecord.userId).select("+password");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Reset token is invalid or expired" }),
        { status: 400, headers }
      );
    }
    user.password = password;
    await user.save();
    resetRecord.usedAt = /* @__PURE__ */ new Date();
    await resetRecord.save();
    await PasswordResetToken.deleteMany({ userId: user._id, _id: { $ne: resetRecord._id } });
    return new Response(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Reset password error:", error);
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

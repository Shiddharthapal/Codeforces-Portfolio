import crypto from 'crypto';
import { U as User } from '../../../chunks/User_tqs9H9uk.mjs';
import { P as PasswordResetOtp } from '../../../chunks/PasswordResetOtp_CiAOaEBO.mjs';
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
    const { email, otp, password } = await request.json();
    if (!email || !otp || !password) {
      return new Response(
        JSON.stringify({ message: "Email, OTP, and password are required" }),
        { status: 400, headers }
      );
    }
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 6 characters" }),
        { status: 400, headers }
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid OTP or expired" }),
        { status: 400, headers }
      );
    }
    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    const otpRecord = await PasswordResetOtp.findOne({
      userId: user._id,
      otpHash,
      usedAt: null,
      expiresAt: { $gt: /* @__PURE__ */ new Date() }
    });
    if (!otpRecord) {
      return new Response(
        JSON.stringify({ message: "Invalid OTP or expired" }),
        { status: 400, headers }
      );
    }
    user.password = password;
    await user.save();
    otpRecord.usedAt = /* @__PURE__ */ new Date();
    await otpRecord.save();
    await PasswordResetOtp.deleteMany({ userId: user._id, _id: { $ne: otpRecord._id } });
    return new Response(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
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

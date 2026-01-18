import crypto from 'crypto';
import { U as User } from '../../../chunks/User_tqs9H9uk.mjs';
import { P as PasswordResetOtp } from '../../../chunks/PasswordResetOtp_CiAOaEBO.mjs';
import { c as connect } from '../../../chunks/connection_B9bDQ4iN.mjs';
import nodemailer from 'nodemailer';
export { renderers } from '../../../renderers.mjs';

const generateOtp = () => {
  const otp = crypto.randomInt(0, 1e6).toString().padStart(6, "0");
  return otp;
};
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
    const emailHost = "smtp.gmail.com";
    const emailPort = Number("587");
    const emailSecure = String("false") === "true";
    const emailUser = "pal35-1069@diu.edu.bd";
    const emailPass = "yzunaqypguoqhwml";
    const emailFrom = "My App <pal35-1069@diu.edu.bd>";
    if (!emailUser || !emailPass) ;
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: emailUser && emailPass ? { user: emailUser, pass: emailPass } : void 0
    });
    const user = await User.findOne({ email });
    if (user) {
      const otp = generateOtp();
      const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
      const expiresAt = new Date(Date.now() + 1e3 * 60 * 2);
      await PasswordResetOtp.deleteMany({ userId: user._id });
      await PasswordResetOtp.create({
        userId: user._id,
        otpHash,
        expiresAt
      });
      if (emailUser && emailPass) {
        await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Password Reset OTP",
          text: `Your password reset OTP is: ${otp}. Valid for 2 minutes.`,
          html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>Valid for 2 minutes.</p>`
        });
      }
      if (false) ;
    }
    return new Response(
      JSON.stringify({ message: "If the email exists, we sent an OTP." }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
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

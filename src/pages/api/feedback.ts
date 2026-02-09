import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

const MAX_MESSAGE_LENGTH = 2000;

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    if (!request.body) {
      return new Response(
        JSON.stringify({ message: "Request body is required" }),
        { status: 400, headers }
      );
    }

    const { message, name, email, userId, page } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ message: "Feedback message is required" }),
        { status: 400, headers }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 2) {
      return new Response(
        JSON.stringify({ message: "Feedback message is too short" }),
        { status: 400, headers }
      );
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ message: `Feedback message is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.` }),
        { status: 400, headers }
      );
    }

    const emailHost =
      import.meta.env.VITE_EMAIL_HOST ||
      "smtp.gmail.com";
    const emailPort = Number(
      import.meta.env.VITE_EMAIL_PORT || 587
    );
    const emailSecure =
      String(
        import.meta.env.VITE_EMAIL_SECURE || "false"
      ) === "true";
    const emailUser =import.meta.env.VITE_EMAIL_USER;
    const emailPass =import.meta.env.VITE_EMAIL_PASSWORD;
    const emailFrom =
      import.meta.env.VITE_EMAIL_FROM ||'"Contest Tracker" <pal35-1069@diu.edu.bd>';
    const emailTo =
      import.meta.env.FEEDBACK_TO ||
      import.meta.env.VITE_FEEDBACK_TO ||
      emailUser;
    const allowSendInDev =
      String(
          import.meta.env.VITE_EMAIL_SEND_IN_DEV ||
          "false"
      ) === "true";

    if (!emailUser || !emailPass || !emailTo) {
      console.error("Email credentials or recipient not configured");
    }

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: emailUser && emailPass ? { user: emailUser, pass: emailPass } : undefined,
    });

    const shouldSendEmail =
      (!import.meta.env.DEV || allowSendInDev) && emailUser && emailPass && emailTo;

    const payload = [
      `Message: ${trimmedMessage}`,
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      userId ? `User ID: ${userId}` : null,
      page ? `Page: ${page}` : null,
      `Sent at: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (shouldSendEmail) {
      await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "New Feedback Submission",
        text: payload,
        html: payload.replace(/\n/g, "<br/>"),
      });
    } else {
      console.log("Feedback received:", payload);
    }

    return new Response(
      JSON.stringify({ message: "Feedback submitted successfully" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

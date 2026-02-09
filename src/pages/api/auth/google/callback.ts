import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "@/model/User";
import connect from "@/lib/connection";

const getAppUrl = (request: Request) =>
  import.meta.env.APP_URL || new URL(request.url).origin;

const buildRedirectUrl = (base: string, params: Record<string, string>) => {
  const url = new URL("/login", base);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return url.toString();
};

const buildAuthCookie = (token: string) => {
  const secure = import.meta.env.PROD ? "; Secure" : "";
  return `authToken=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`;
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    import.meta.env.GOOGLE_REDIRECT_URI ||
    `${url.origin}/api/auth/google/callback`;

  if (error) {
    return Response.redirect(
      buildRedirectUrl(getAppUrl(request), { error: "Google login cancelled" }),
      302
    );
  }

  if (!code || !clientId || !clientSecret) {
    return Response.redirect(
      buildRedirectUrl(getAppUrl(request), {
        error: "Google login is not configured",
      }),
      302
    );
  }

  try {
    await connect();
  } catch (err) {
    console.error("Database connection error:", err);
    return Response.redirect(
      buildRedirectUrl(getAppUrl(request), { error: "Database error" }),
      302
    );
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Google token exchange failed:", errorText);
      return Response.redirect(
        buildRedirectUrl(getAppUrl(request), {
          error: "Google login failed",
        }),
        302
      );
    }

    const tokenPayload = (await tokenResponse.json()) as {
      id_token?: string;
    };

    if (!tokenPayload.id_token) {
      return Response.redirect(
        buildRedirectUrl(getAppUrl(request), {
          error: "Google login failed",
        }),
        302
      );
    }

    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenPayload.id_token}`
    );

    if (!tokenInfoResponse.ok) {
      return Response.redirect(
        buildRedirectUrl(getAppUrl(request), {
          error: "Google login failed",
        }),
        302
      );
    }

    const tokenInfo = (await tokenInfoResponse.json()) as {
      sub?: string;
      email?: string;
      email_verified?: string;
      aud?: string;
    };

    if (
      !tokenInfo.email ||
      tokenInfo.email_verified !== "true" ||
      tokenInfo.aud !== clientId ||
      !tokenInfo.sub
    ) {
      return Response.redirect(
        buildRedirectUrl(getAppUrl(request), {
          error: "Google account not verified",
        }),
        302
      );
    }

    let user = await User.findOne({ email: tokenInfo.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      user = new User({
        email: tokenInfo.email,
        password: randomPassword,
        authProvider: "google",
        googleId: tokenInfo.sub,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = tokenInfo.sub;
      await user.save();
    }

    const jwtSecret = import.meta.env.JWT_SECRET || "your_jwt_secret";
    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const redirectUrl = buildRedirectUrl(getAppUrl(request), {
      token,
      email: user.email,
      id: user._id.toString(),
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
        "Set-Cookie": buildAuthCookie(token),
      },
    });
  } catch (err) {
    console.error("Google callback error:", err);
    return Response.redirect(
      buildRedirectUrl(getAppUrl(request), {
        error: "Google login failed",
      }),
      302
    );
  }
};

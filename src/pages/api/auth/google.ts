import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return new Response(
      JSON.stringify({ message: "Google login is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const origin = new URL(request.url).origin;
  const redirectUri =
    import.meta.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    302
  );
};

import type { APIRoute } from "astro";

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: "Google login is not implemented for this deployment.",
    }),
    {
      status: 501,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

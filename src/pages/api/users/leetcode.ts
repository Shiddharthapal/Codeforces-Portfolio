import type { APIRoute } from 'astro';

// This endpoint is deprecated. Please use /api/users/leetcode/[username] instead.
export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const username = params.username;
  
  // Provide a deprecation notice and redirect information
  return new Response(JSON.stringify({
    error: 'DEPRECATED_ENDPOINT',
    message: 'This endpoint is deprecated. Please use the new endpoint format.',
    newEndpoint: `/api/users/leetcode/${username}`,
    documentation: '/docs/leetcode-api-fix-plan.md'
  }), {
    status: 301,
    headers: {
      'Content-Type': 'application/json',
      'Location': `/api/users/leetcode/${username}`,
      'Deprecation': 'true',
      'Sunset': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString() // 30 days from now
    }
  });
};
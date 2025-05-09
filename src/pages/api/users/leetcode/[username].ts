import type { APIRoute } from 'astro';
import { LeetCodeAPI } from '@/lib/leetcode_api';

// Custom error class for LeetCode API errors
class LeetCodeAPIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'LeetCodeAPIError';
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    // Validate username parameter
    const profileName = params.username;
    console.log("profileName ==> ", profileName);
    const baseUrlOfCF="https://leetcode.com/u/"
    const username= profileName?.replace(baseUrlOfCF, "");
    console.log("username ==> ", username);
    if (!username) {
      throw new LeetCodeAPIError('Username is required', 400);
    }

    // Initialize API and fetch user stats
    const api = new LeetCodeAPI(username);
    const fullStats = await api.getUserStats();

    // Validate response data
    if (!fullStats || typeof fullStats !== 'object') {
      throw new LeetCodeAPIError('Invalid response from LeetCode API', 500);
    }

    // Prepare response with detailed statistics
    const response = {
      username: fullStats.username,
      totalSolveCount: fullStats.totalSolveCount,
      totalParticipation: fullStats.totalParticipation,
      successRate: fullStats.successRate,
      ranking: fullStats.ranking,
      reputation: fullStats.reputation,
      detailedStats: fullStats.detailedStats,
      recentSubmissions: fullStats.recentSubmissions
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error(`Error processing LeetCode request for ${params.username}:`, error);

    let status = 500;
    let message = 'Internal server error';

    if (error instanceof LeetCodeAPIError) {
      status = error.status;
      message = error.message;
    } else if (error instanceof Error) {
      if (error.message.includes('not found')) {
        status = 404;
        message = `User '${params.username}' not found on LeetCode`;
      } else if (error.message.includes('Failed to fetch')) {
        status = 503;
        message = 'LeetCode API is currently unavailable';
      } else {
        message = error.message;
      }
    }

    return new Response(JSON.stringify({
      error: status === 404 ? 'USER_NOT_FOUND' : 'API_ERROR',
      message: message,
      status: status
    }), {
      status: status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
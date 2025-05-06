import type { APIRoute } from 'astro';
import { codeforcesAPI } from '@/lib/codeforces_api';
import type { Submission } from '@/types/codeForces_api_type';

interface CodeforcesProblemResponse {
  success: boolean;
  data?: {
    handle: string;
    totalSolved: number;
    solvedProblems: Array<{
      contestId: number;
      index: string;
      name: string;
    }>;
  };
  error?: string;
}

// Cache solution to avoid hitting rate limits
const cache = new Map<string, { data: CodeforcesProblemResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    console.log("url ==> ", url);
    let processedHandle = url.searchParams.get('handle');
    console.log("handle ==> ", processedHandle);
    const baseUrlOfCF="https://codeforces.com/profile/"
    const profilePath= processedHandle?.replace(baseUrlOfCF, "");
    const handle = profilePath;
    console.log("handle ==> ", handle);

    // Validate handle parameter
    if (!handle) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Handle parameter is required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
     console.log("hi");
    // Check cache first
    const cached = cache.get(handle);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(
        JSON.stringify(cached.data),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    
    // Get all submissions for the user
    const submissions = await codeforcesAPI.userStatus(handle, 1, 10000);
    console.log("submissions ==> ", submissions);
    
    // Process submissions to get unique solved problems
    const solvedProblems = new Map<string, {
      contestId: number;
      index: string;
      name: string;
    }>();

    submissions.forEach((sub: Submission) => {
      if (sub.verdict === 'OK') {
        const key = `${sub.contestId}${sub.problem.index}`;
        if (!solvedProblems.has(key)) {
          solvedProblems.set(key, {
            contestId: sub.contestId,
            index: sub.problem.index,
            name: sub.problem.name
          });
        }
      }
    });

    // Prepare response
    const response: CodeforcesProblemResponse = {
      success: true,
      data: {
        handle,
        totalSolved: solvedProblems.size,
        solvedProblems: Array.from(solvedProblems.values())
      }
    };

    // Update cache
    cache.set(handle, {
      data: response,
      timestamp: Date.now()
    });

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching Codeforces data:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch user submissions')) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'User not found or Codeforces API error'
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later'
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Generic error response
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch user data from Codeforces'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
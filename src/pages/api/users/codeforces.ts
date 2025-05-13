import type { APIRoute } from "astro";
import { codeforcesAPI } from "@/lib/codeforces_api";
import type { Submission, RatingChange } from "@/types/codeForces_api_type";

interface LastMonthStats {
  totalUniqueProblems: number;
  totalSubmissions: number;
  successRate: number;
  problems: Array<{
    contestId: number;
    index: string;
    name: string;
    attempts: number;
    acceptedTime: number;
  }>;
}

interface CodeforcesProblemResponse {
  success: boolean;
  data?: {
    handle: string;
    totalSolved: number;
    totalContest: number;
  };
  rating?: RatingChange[];
  error?: string;
}

// Helper function to check if submission is from last month
function isLastMonthSubmission(submission: Submission): boolean {
  const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;
  return submission.creationTimeSeconds >= thirtyDaysAgo;
}

// Helper function to process last month submissions
function processLastMonthSubmissions(
  submissions: Submission[]
): LastMonthStats {
  const lastMonthSubs = submissions.filter(isLastMonthSubmission);
  const problemStats = new Map<
    string,
    {
      contestId: number;
      index: string;
      name: string;
      attempts: number;
      acceptedTime: number | null;
    }
  >();

  // Process each submission
  lastMonthSubs.forEach((sub) => {
    const key = `${sub.contestId}${sub.problem.index}`;
    const existing = problemStats.get(key);

    if (!existing) {
      problemStats.set(key, {
        contestId: sub.contestId,
        index: sub.problem.index,
        name: sub.problem.name,
        attempts: 1,
        acceptedTime: sub.verdict === "OK" ? sub.creationTimeSeconds : null,
      });
    } else {
      existing.attempts++;
      if (sub.verdict === "OK" && existing.acceptedTime === null) {
        existing.acceptedTime = sub.creationTimeSeconds;
      }
    }
  });

  // Convert to final format
  const problems = Array.from(problemStats.entries())
    .filter(([_, stats]) => stats.acceptedTime !== null)
    .map(([_, stats]) => ({
      contestId: stats.contestId,
      index: stats.index,
      name: stats.name,
      attempts: stats.attempts,
      acceptedTime: stats.acceptedTime!,
    }));

  return {
    totalUniqueProblems: problems.length,
    totalSubmissions: lastMonthSubs.length,
    successRate:
      lastMonthSubs.length > 0
        ? (problems.length / problemStats.size) * 100
        : 0,
    problems: problems,
  };
}

// Cache solution to avoid hitting rate limits
const cache = new Map<
  string,
  { data: CodeforcesProblemResponse; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    // console.log("url ==> ", url);
    let processedHandle = url.searchParams.get("handle");
    // console.log("handle ==> ", processedHandle);
    const baseUrlOfCF = "https://codeforces.com/profile/";
    const profilePath = processedHandle?.replace(baseUrlOfCF, "");
    const handle = profilePath;
    // console.log("handle ==> ", handle);

    // Validate handle parameter
    if (!handle) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Handle parameter is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Check cache first
    const cached = cache.get(handle);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all submissions for the user
    const submissions = await codeforcesAPI.userStatus(handle, 1, 10000);
    // console.log("submissions ==> ", submissions);

    // Process submissions to get unique solved problems
    const solvedProblems = new Map<
      string,
      {
        contestId: number;
        index: string;
        name: string;
      }
    >();

    const allUniqueContest = new Map<
      string,
      {
        contestId: number;
        index: string;
        name: string;
      }
    >();

    let contest = 0;
    const ratingChanges = await codeforcesAPI.getUserRating(handle);

    submissions.forEach((sub: Submission) => {
      const key = `${sub.contestId}${sub.problem.index}`;
      if (sub.verdict === "OK") {
        if (!solvedProblems.has(key)) {
          solvedProblems.set(key, {
            contestId: sub.contestId,
            index: sub.problem.index,
            name: sub.problem.name,
          });
        }
      }
      if (!allUniqueContest.has(key)) {
        contest++;
        allUniqueContest.set(key, {
          contestId: sub.contestId,
          index: sub.problem.index,
          name: sub.problem.name,
        });
      }
    });

    // Prepare response
    const response: CodeforcesProblemResponse = {
      success: true,
      data: {
        handle,
        totalSolved: solvedProblems.size,
        totalContest: contest,
      },
      rating: ratingChanges,
    };

    // Update cache
    cache.set(handle, {
      data: response,
      timestamp: Date.now(),
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch user submissions")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "User not found or Codeforces API error",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (error.message.includes("rate limit")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Rate limit exceeded. Please try again later",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Generic error response
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch user data from Codeforces",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

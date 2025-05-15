import type { APIRoute } from "astro";
import { codeforcesAPI } from "@/lib/codeforces_api";
import type { Submission, RatingChange } from "@/types/codeForces_api_type";

interface Contests {
  data?:
    | {
        contestId: number;
        index: string;
        name: string;
        startTimeSeconds: number;
      }[];
}

export const GET: APIRoute = async () => {
  try {
    // Get all submissions for the user
    const submissions = await codeforcesAPI.getContestList({ gym: true });
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

    let contest = 0;
    const ratingChanges = await codeforcesAPI.getUserRating(handle);

    submissions.forEach(() => {});

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

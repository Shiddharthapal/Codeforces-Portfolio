import type { APIRoute } from "astro";
import { codeforcesAPI } from "@/lib/codeforces_api";

// Helper function to format duration in seconds to human readable format
function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ") || "0m";
}

// Helper function to format timestamp to local date and time with timezone
function formatDateTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const timeString = date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  // Add UTC offset
  const offset = date.getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset > 0 ? "-" : "+";
  const utcOffset = `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return `${timeString} (${utcOffset})`;
}

interface UpcomingContest {
  id: number;
  name: string;
  type: string;
  durationSeconds: number;
  durationFormatted: string;
  startTimeSeconds: number;
  startTimeFormatted: string;
  relativeTimeToStart: number;
  timeToStartFormatted: string;
  phase: string;
  websiteUrl: string | undefined;
}

export const GET: APIRoute = async () => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Get all contests
    const contests = await codeforcesAPI.getContestList(false); // false to exclude gym contests

    // Get current timestamp in seconds
    const currentTimeSeconds = Math.floor(Date.now() / 1000);

    // Filter and process upcoming contests
    const upcomingContests: UpcomingContest[] = contests
      .filter((contest) => {
        return (
          contest.phase === "BEFORE" &&
          contest.startTimeSeconds > currentTimeSeconds
        );
      })
      .map((contest) => {
        const relativeTimeToStart =
          contest.startTimeSeconds - currentTimeSeconds;
        return {
          id: contest.id,
          name: contest.name,
          type: contest.type,
          durationSeconds: contest.durationSeconds,
          durationFormatted: formatDuration(contest.durationSeconds),
          startTimeSeconds: contest.startTimeSeconds,
          startTimeFormatted: formatDateTime(contest.startTimeSeconds),
          relativeTimeToStart,
          timeToStartFormatted: formatDuration(relativeTimeToStart),
          phase: contest.phase,
          websiteUrl: "https://codeforces.com/",
        };
      })
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

    return new Response(
      JSON.stringify({
        success: true,
        contests: upcomingContests,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error fetching upcoming contests:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch contest list")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to fetch contest list from Codeforces",
          }),
          {
            status: 404,
            headers,
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
            headers,
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred while fetching contests",
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};

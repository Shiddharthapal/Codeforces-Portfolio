import { c as codeforcesAPI } from '../../../chunks/codeforces_api_DzFs-jcd.mjs';
export { renderers } from '../../../renderers.mjs';

const cache = /* @__PURE__ */ new Map();
const CACHE_TTL = 5 * 60 * 1e3;
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    let processedHandle = url.searchParams.get("handle");
    const baseUrlOfCF = "https://codeforces.com/profile/";
    const profilePath = processedHandle?.replace(baseUrlOfCF, "");
    const handle = profilePath;
    if (!handle) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Handle parameter is required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const cached = cache.get(handle);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const submissions = await codeforcesAPI.userStatus(handle, 1, 1e4);
    const solvedProblems = /* @__PURE__ */ new Map();
    const allUniqueContest = /* @__PURE__ */ new Map();
    let contest = 0;
    const ratingChanges = await codeforcesAPI.getUserRating(handle);
    submissions.forEach((sub) => {
      const key = `${sub.contestId}${sub.problem.index}`;
      const tempKey = `${sub.contestId}`;
      if (sub.verdict === "OK") {
        if (!solvedProblems.has(key)) {
          solvedProblems.set(key, {
            contestId: sub.contestId,
            index: sub.problem.index,
            name: sub.problem.name
          });
        }
      }
      if (!allUniqueContest.has(tempKey)) {
        contest++;
        allUniqueContest.set(tempKey, {
          contestId: sub.contestId,
          index: sub.problem.index,
          name: sub.problem.name
        });
      }
    });
    const response = {
      success: true,
      data: {
        handle,
        totalSolved: solvedProblems.size,
        totalContest: contest,
        successRate: submissions.length > 0 ? Number(
          (solvedProblems.size / submissions.length * 100).toFixed(1)
        ) : 0
        // avatar: avatar,
      },
      rating: ratingChanges
    };
    cache.set(handle, {
      data: response,
      timestamp: Date.now()
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch user submissions")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "User not found or Codeforces API error"
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      if (error.message.includes("rate limit")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Rate limit exceeded. Please try again later"
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch user data from Codeforces"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

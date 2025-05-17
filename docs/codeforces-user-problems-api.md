# Codeforces User Problems Count API Implementation Plan

## Overview

Create an API endpoint that returns the total number of unique problems solved by a Codeforces user.

## Implementation Details

### Endpoint Specification

- **Path**: `/api/users/codeforces`
- **Method**: GET
- **Query Parameters**:
  - `handle`: string (required) - Codeforces username
- **Response Format**:

```typescript
interface Response {
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
```

### Implementation Steps

1. Create API Route Handler:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { CodeforcesAPI } from "@/lib/codeforces_api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const { handle } = req.query;

  if (!handle || typeof handle !== "string") {
    return res.status(400).json({
      success: false,
      error: "Handle parameter is required",
    });
  }

  try {
    const api = new CodeforcesAPI();
    const submissions = await api.getUserSubmissions(handle, 1, 10000);

    // Get unique solved problems
    const solvedProblems = new Map();

    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        const key = `${sub.contestId}${sub.problem.index}`;
        if (!solvedProblems.has(key)) {
          solvedProblems.set(key, {
            contestId: sub.contestId,
            index: sub.problem.index,
            name: sub.problem.name,
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        handle,
        totalSolved: solvedProblems.size,
        solvedProblems: Array.from(solvedProblems.values()),
      },
    });
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch user data from Codeforces",
    });
  }
}
```

2. Error Handling:

- Invalid request method
- Missing/invalid handle parameter
- Codeforces API errors
- Network errors
- Rate limiting

3. Performance Considerations:

- Cache results for frequent requests
- Implement rate limiting
- Consider pagination for large result sets

## Usage Example

```typescript
// Client-side fetch
const response = await fetch("/api/users/codeforces?handle=tourist");
const data = await response.json();

if (data.success) {
  console.log(`Total solved problems: ${data.data.totalSolved}`);
  console.log("Solved problems:", data.data.solvedProblems);
} else {
  console.error("Error:", data.error);
}
```

## Next Steps

1. Review and approve this plan
2. Switch to Code mode to implement the API endpoint
3. Add error handling and rate limiting
4. Add caching if needed
5. Write tests for the endpoint

Would you like to proceed with the implementation in Code mode?

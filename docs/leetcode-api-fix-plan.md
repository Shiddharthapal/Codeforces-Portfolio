# LeetCode API Route Implementation Plan

## Current Issues

1. Improper route structure for dynamic parameters
2. Missing username parameter validation
3. Basic error handling that could be more specific
4. No response validation

## Implementation Plan

### 1. API Route Structure Update

- Create new file: `/src/pages/api/users/leetcode/[username].ts`
- Follow Astro's file-based routing convention
- Old route will be deprecated and removed

```typescript
// New route structure
export const GET: APIRoute = async ({ params, request }) => {
  const { username } = params;
  // ... implementation
};
```

### 2. Parameter Handling

- Validate username parameter existence and format
- Return appropriate error responses
- Add TypeScript types for request validation

```typescript
interface LeetCodeAPIResponse {
  username: string;
  totalSolveCount: number;
  totalParticipation: number;
  successRate: string;
  detailedStats?: {
    byDifficulty: {
      easy: DifficultyStats;
      medium: DifficultyStats;
      hard: DifficultyStats;
    };
    byLanguage: Record<string, number>;
    byTags: Record<string, TagStats>;
  };
}

interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}
```

### 3. Enhanced Error Handling

- Add specific error types:
  - UserNotFoundError
  - InvalidParameterError
  - APIConnectionError
  - ValidationError
- Improve error messages with more context
- Add request validation layer

```typescript
class LeetCodeAPIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "LeetCodeAPIError";
  }
}
```

### 4. Response Validation

- Validate API response structure
- Ensure consistent response format
- Add type guards for response validation

## Implementation Steps

1. **Phase 1: Route Structure**

   - Create new route file
   - Set up basic route handler
   - Add parameter extraction

2. **Phase 2: Error Handling**

   - Implement error classes
   - Add error handling middleware
   - Set up validation

3. **Phase 3: Response Processing**

   - Add response validation
   - Implement type guards
   - Format response data

4. **Phase 4: Testing**
   - Test with valid username
   - Test with invalid username
   - Test with API errors
   - Test response format

## Example Usage

```typescript
// Valid request
GET /api/users/leetcode/johndoe

// Response
{
  "username": "johndoe",
  "totalSolveCount": 150,
  "totalParticipation": 200,
  "successRate": "75.00%",
  "detailedStats": {
    // ... detailed statistics
  }
}

// Error response
{
  "error": "USER_NOT_FOUND",
  "message": "User 'invaliduser' not found on LeetCode",
  "status": 404
}
```

## Migration Plan

1. Create new route implementation
2. Test thoroughly
3. Update frontend to use new route
4. Remove old route after confirmation

## Notes

- All API responses will use standard HTTP status codes
- Error messages will be user-friendly and actionable
- Response format will be consistent across all status codes
- TypeScript types will be strictly enforced

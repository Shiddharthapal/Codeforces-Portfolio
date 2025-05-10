# Rating Changes Optimization Plan

## Current Implementation Issues
- Making individual API calls for each contest in a loop inside the submissions forEach
- Using inefficient allRatingUniqueId map to track contests
- Not using the available getUserRating method that gets all rating changes at once

## Proposed Changes

1. Remove the following code from the submissions loop:
```typescript
if (!allRatingUniqueId.has(key)) {
  let reponse = await codeforcesAPI.getContestRatingChanges(sub.contestId);
  allrating.push({
    ratingUpdateTimeSeconds: reponse.ratingUpdateTimeSeconds,
    newRating: reponse.newRating,
    oldRating: reponse.oldRating
  });
  allRatingUniqueId.set(key, {
    contestId: sub.contestId
  });
}
```

2. Add a single call to getUserRating before processing submissions:
```typescript
const ratingChanges = await codeforcesAPI.getUserRating(handle);
```

3. Update the response interface to properly type the rating changes:
```typescript
rating?: RatingChange[];
```

## Benefits
- Single API call instead of multiple calls in a loop
- More efficient memory usage
- More complete rating change data including contest names
- Better TypeScript typing
- Reduced load on Codeforces API

## Implementation Steps
1. Remove old rating change tracking code
2. Add getUserRating call early in the route handler
3. Update response type
4. Pass rating changes directly to response

## Risks
- None, as this is an optimization of existing functionality
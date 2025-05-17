# Graph Implementation Plan

## Current Issues
- Timestamps not formatted as month/year on x-axis
- Y-axis needs to show rank (high to low)
- Data fetching not properly handled with async/await
- Scales not configured correctly for the data format

## Proposed Changes

1. Update Data Fetching
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/users/codeforces?handle=${encodeURIComponent(handle)}`);
      const responseData = await response.json();
      if (responseData?.rating) {
        createGraph(responseData.rating);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
}, [handle]);
```

2. Date Processing
```typescript
// Convert timestamp to month/year
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
};
```

3. Scale Updates
```typescript
const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => new Date(d.ratingUpdateTimeSeconds * 1000)))
  .range([0, innerWidth]);

const yScale = d3.scaleLinear()
  .domain([d3.max(data, d => d.rank), 0]) // Reverse domain for rank (high to low)
  .range([innerHeight, 0]);
```

4. Axis Formatting
```typescript
// X-axis with month/year ticks
g.append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(xScale)
    .tickFormat(d => formatDate(d.getTime() / 1000)));

// Y-axis for rank
g.append("g")
  .call(d3.axisLeft(yScale));
```

5. Line and Points Implementation
```typescript
// Line generator
const line = d3.line<RatingChange>()
  .x(d => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
  .y(d => yScale(d.rank))
  .curve(d3.curveMonotoneX);

// Points
g.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("cx", d => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
  .attr("cy", d => yScale(d.rank))
  .attr("r", 5);
```

## Benefits
- Clear visualization of rank progression over time
- Properly formatted dates on x-axis
- Intuitive high-to-low rank display
- Better error handling
- Responsive to data changes

## Implementation Steps
1. Update data fetching and error handling
2. Implement date formatting function
3. Update scales for time and rank
4. Configure axes with proper formatting
5. Update line and point generation with new data format

## Next Steps
Switch to Code mode to implement these changes in the graph component.
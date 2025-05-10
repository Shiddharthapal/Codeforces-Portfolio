import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface RatingChange {
  contestId: number;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export default function Graph({ handle }: { handle: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Format timestamp to month/year
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  // Create graph with data
  const createGraph = (data: RatingChange[]) => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const width = 1200;
    const height = 400; // Increased height for better visibility
    const margin = { top: 20, right: 30, bottom: 50, left: 60 }; // Increased margins for labels
    const innerWidth = width - margin.left - margin.right-10;
    const innerHeight = height - margin.top - margin.bottom-10;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create group for the graph
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.ratingUpdateTimeSeconds * 1000)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.max(data, d => d.rank)! * 1.1, 1]) // Reverse domain for rank, add 10% padding
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line<RatingChange>()
      .x(d => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
      .y(d => yScale(d.rank))
      .curve(d3.curveMonotoneX);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => formatDate((d as Date).getTime() / 1000)))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add Y axis
    g.append("g")
      .call(d3.axisLeft(yScale));

    // Add X axis label
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom+9)
      .style("text-anchor", "middle")
      .text("Contest Date");

    // Add Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20-7)
      .attr("x", -innerHeight / 2)
      .style("text-anchor", "middle")
      .text("Rank");

    // Add path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
      .attr("cy", d => yScale(d.rank))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .append("title") // Add tooltip
      .text(d => `Rank: ${d.rank}\nDate: ${formatDate(d.ratingUpdateTimeSeconds)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/codeforces?handle=${encodeURIComponent(handle)}`);
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to fetch data');
        }
        
        if (responseData?.rating && Array.isArray(responseData.rating)) {
          // Sort data by timestamp
          const sortedData = responseData.rating.sort(
            (a: RatingChange, b: RatingChange) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds
          );
          createGraph(sortedData);
        } else {
          setError('No rating data available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    };

    fetchData();
  }, [handle]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <svg ref={svgRef}></svg>;
}
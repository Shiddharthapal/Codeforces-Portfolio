import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RatingChange {
  contestId: number;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export default function Graph({ handle }: { handle: string }) {
  console.log("🧞‍♂️  handle --->", handle);
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RatingChange[] | null>(null); // Store data in state

  // Format timestamp to month/year
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  // Create graph with data
  const createGraph = (data: RatingChange[]) => {
    console.log("Creating graph with data:", data);

    if (!svgRef.current || !data || data.length === 0) {
      console.log("No data or SVG ref not available");
      return;
    }

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const width = 1200;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right - 10;
    const innerHeight = height - margin.top - margin.bottom - 10;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create group for the graph
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales with null checks and proper domains
    const timeExtent = d3.extent(
      data,
      (d) => new Date(d.ratingUpdateTimeSeconds * 1000)
    );
    if (!timeExtent[0] || !timeExtent[1]) {
      console.error("Invalid time extent:", timeExtent);
      return;
    }

    const xScale = d3.scaleTime().domain(timeExtent).range([0, innerWidth]);

    const minRating = d3.min(data, (d) => d.newRating) || 0;
    const maxRating = d3.max(data, (d) => d.newRating) || 3000;

    const yScale = d3
      .scaleLinear()
      .domain([Math.max(0, minRating * 0.9), maxRating * 1.1])
      .range([innerHeight, 0]);

    console.log("Scale domains:", {
      x: timeExtent,
      y: [minRating, maxRating],
    });

    // Create line generator for rating progression
    const ratingLine = d3
      .line<RatingChange>()
      .x((d) => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
      .y((d) => yScale(d.newRating))
      .curve(d3.curveMonotoneX);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => formatDate((d as Date).getTime() / 1000))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add Y axis
    g.append("g").call(d3.axisLeft(yScale));

    // Add X axis label
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom + 9)
      .style("text-anchor", "middle")
      .text("Contest Date");

    // Add Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20 - 7)
      .attr("x", -innerHeight / 2)
      .style("text-anchor", "middle")
      .text("Rating");

    // Add path for rating progression
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2ecc71")
      .attr("stroke-width", 2)
      .attr("d", ratingLine);

    // Add dots for rating changes
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(new Date(d.ratingUpdateTimeSeconds * 1000)))
      .attr("cy", (d) => yScale(d.newRating))
      .attr("r", 4)
      .attr("fill", "#2ecc71")
      .append("title")
      .text(
        (d) =>
          `Rating: ${d.newRating}\nChange: ${
            d.newRating - d.oldRating > 0 ? "+" : ""
          }${d.newRating - d.oldRating}\nDate: ${formatDate(
            d.ratingUpdateTimeSeconds
          )}`
      );
  };

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!handle) {
          throw new Error("Handle is required");
        }

        setError(null); // Clear previous errors

        const response = await fetch(
          `/api/users/codeforces?handle=${encodeURIComponent(handle)}`
        );
        const responseData = await response.json();
        console.log("🧞‍♂️  responseData --->", responseData);

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to fetch data");
        }

        if (responseData?.rating && Array.isArray(responseData.rating)) {
          // Sort data by timestamp and store in state
          const sortedData = responseData.rating.sort(
            (a: RatingChange, b: RatingChange) =>
              a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds
          );
          setData(sortedData); // Store data in state instead of calling createGraph directly
        } else {
          setError("No rating data available");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      }
    };

    fetchData();
  }, [handle]);

  // Separate effect to create graph when data and SVG ref are ready
  useEffect(() => {
    if (data && svgRef.current) {
      // Small delay to ensure SVG is fully mounted
      const timer = setTimeout(() => {
        createGraph(data);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [data]); // This runs whenever data changes

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-full h-[500px] overflow-x-auto">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minWidth: "800px" }}
      ></svg>
    </div>
  );
}

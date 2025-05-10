// src/components/D3Graph.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface data{
  contestId: number;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export default function Graph({handle}: {handle: string}) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() =>{
        // Sample data
        // const data = [
        //     { x: 0, y: 10 },
        //     { x: 1, y: 15 },
        //     { x: 2, y: 35 },
        //     { x: 3, y: 25 },
        //     { x: 4, y: 45 }
        // ];
        let data:data[]= [];
        const fetchData=async()=>{
            const response=await fetch(`/api/users/codeforces?handle=${encodeURIComponent(handle)}`);
            const reponseData=await response.json();
            data=reponseData?.rating
        }
    
        // Clear any previous SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up dimensions
        const width = 1200;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        fetchData();
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)!])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)!])
            .range([innerHeight, 0]);

        // Create SVG
        const svg = d3.select(svgRef?.current)
            .attr("width", width)
            .attr("height", height);

        // Create group for the graph
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        // Add Y axis
        g.append("g")
            .call(d3.axisLeft(yScale));

        // Create line generator
        const line = d3.line<{ x: number; y: number }>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);

        // Add the line path
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Add dots
        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 5)
            .attr("fill", "steelblue");
    }, []);

    return <svg ref={svgRef}></svg>;
}
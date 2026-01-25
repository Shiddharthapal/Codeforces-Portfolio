"use client";

import React, { useState, useEffect, useRef } from "react";

interface CursorFollowerProps {
  isDarkMode?: boolean;
}

export default function CursorFollower({ isDarkMode = true }: CursorFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dotPosition, setDotPosition] = useState({ x: 75, y: 30 });
  const [isInside, setIsInside] = useState(false);
  const positionHistoryRef = useRef<Array<{ x: number; y: number }>>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if cursor is inside the container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setIsInside(true);
        // Add cursor position to history
        positionHistoryRef.current.push({
          x: Math.max(0, Math.min(x, rect.width)),
          y: Math.max(0, Math.min(y, rect.height)),
        });
      } else {
        setIsInside(false);
      }
    };

    const handleMouseLeave = () => {
      setIsInside(false);
      positionHistoryRef.current = [];
    };

    // Animate the dot following the trail
    const animate = () => {
      if (positionHistoryRef.current.length > 0) {
        // Get the first position in history (oldest)
        const targetPosition = positionHistoryRef.current[0];
        
        setDotPosition(targetPosition);
        
        // Remove the position we just used
        positionHistoryRef.current.shift();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-12 rounded-lg border-2 overflow-hidden transition-all ${
        isDarkMode
          ? "border-cyan-600 bg-gradient-to-br from-gray-800 to-gray-900"
          : "border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50"
      }`}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, ${isDarkMode ? 'rgba(34,211,238,0.2)' : 'rgba(6,182,212,0.3)'} 1px, transparent 1px),
            linear-gradient(${isDarkMode ? 'rgba(34,211,238,0.2)' : 'rgba(6,182,212,0.3)'} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Dot follower */}
      <div
        className={`absolute w-3 h-3 rounded-full pointer-events-none transition-all duration-700 ${
          isDarkMode
            ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
            : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-400/50"
        }`}
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isInside ? 1 : 0.3,
        }}
      />

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className={`text-sm font-medium ${
          isDarkMode
            ? "text-cyan-300"
            : "text-cyan-700"
        }`}>
          {isInside ? "Follow" : "Move here"}
        </p>
      </div>
    </div>
  );
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type Symbol = {
  id: number
  char: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
  color: string
  zIndex: number
  rotation: number
}

// Utility function to debounce function calls
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

export default function CodeRain() {
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const symbolsRef = useRef<Symbol[]>([])
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  // Coding symbols array
  const codingChars = [
    "<>", "{}","JavaScript", "[]", "()","C#", "//", "Svelte", "/*", "*/","C", "=>","</span>", "==", "===", "!=", "!==",
    ";", "&&", "||","Python" ,"++", "--", "+=", "-=", "*=", "/=", "%=", "Java", "**", "??",
    "#", "$", "async","@", "~", "|", "^", "&","TypeScript", "*", "+", "-", "/", "=", ".", ":",
    "function", "const", "let", "var", "if", "else", "for", "while", "return",
    "class", "import", "export",  "await", "try", "catch", "true", "false",
    "<div>", "</div>", "<p>", "</p>", "<span>",  "<h1>", "</h1>",
    "React", "Vue", "Angular","C++", "Node", "Next.js", 
  ]

  // Colors array with opacity variants
  const colors = [
    "text-green-400/70", "text-green-500/70", "text-green-600/70",
    "text-blue-400/70", "text-blue-500/70", "text-blue-600/70",
    "text-purple-400/70", "text-purple-500/70", "text-purple-600/70",
    "text-yellow-400/70", "text-yellow-500/70", "text-yellow-600/70",
    "text-pink-400/70", "text-pink-500/70", "text-pink-600/70",
    "text-cyan-400/70", "text-cyan-500/70", "text-cyan-600/70",
  ]

  // Create a new symbol with enhanced properties
  const createSymbol = useCallback((id: number): Symbol => {
    return {
      id,
      char: codingChars[Math.floor(Math.random() * codingChars.length)],
      x: Math.random() * dimensions.width,
      y: -50 - Math.random() * 500, // Start above viewport
      speed: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.4, // Reduced opacity range
      size: 12 + Math.floor(Math.random() * 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      zIndex: Math.floor(Math.random() * 3), // Reduced z-index range
      rotation: Math.random() * 10 - 5,
    }
  }, [dimensions.width])

  // Initialize symbols
  useEffect(() => {
    const symbolCount = Math.floor(dimensions.width / 20)
    const initialSymbols = Array.from({ length: symbolCount }, (_, i) => createSymbol(i))
    symbolsRef.current = initialSymbols
    setSymbols(initialSymbols)
  }, [dimensions.width, createSymbol])

  // Handle window resize with debouncing
  useEffect(() => {
    const handleResize = debounce(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 250)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Optimized animation loop
  useEffect(() => {
    let animationFrameId: number
    console.log("Animation started") // Debug log

    const animate = () => {
      const updatedSymbols = symbolsRef.current.map(symbol => {
        const y = symbol.y + symbol.speed

        // Reset symbol if it's off screen
        if (y > dimensions.height) {
          return createSymbol(symbol.id)
        }

        // Update existing symbol
        return {
          ...symbol,
          y,
          opacity: Math.max(0.2, Math.min(0.7, symbol.opacity + (Math.random() * 0.1 - 0.05))),
          rotation: symbol.rotation + (Math.random() * 0.2 - 0.1),
        }
      })

      symbolsRef.current = updatedSymbols
      setSymbols(updatedSymbols)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      console.log("Animation cleanup") // Debug log
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions.height, createSymbol])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className={`absolute ${symbol.color} font-mono whitespace-nowrap transition-opacity duration-300 mix-blend-screen`}
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            opacity: symbol.opacity,
            fontSize: `${symbol.size}px`,
            transform: `rotate(${symbol.rotation}deg)`,
            textShadow: `0 0 8px currentColor`,
            zIndex: symbol.zIndex,
          }}
        >
          {symbol.char}
        </div>
      ))}
    </div>
  )
}

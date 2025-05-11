"use client"

import { useEffect, useState } from "react"

type Symbol = {
  id: number
  char: string
  x: number
  y: number
  speed: number
  opacity: number
  size: number
  color: string
}

export default function CodeRain() {
  const [symbols, setSymbols] = useState<Symbol[]>([])
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  // Coding symbols to use in the rain
  const codingChars = [
    "<>",
    "{}",
    "[]",
    "()",
    "//",
    "/*",
    "*/",
    "=>",
    "==",
    "===",
    "!=",
    "!==",
    ";",
    "&&",
    "||",
    "++",
    "--",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "**",
    "??",
    "#",
    "$",
    "@",
    "~",
    "|",
    "^",
    "&",
    "*",
    "+",
    "-",
    "/",
    "=",
    ".",
    ":",
    "function",
    "const",
    "let",
    "var",
    "if",
    "else",
    "for",
    "while",
    "return",
    "class",
    "import",
    "export",
    "async",
    "await",
    "try",
    "catch",
    "true",
    "false",
    "<div>",
    "</div>",
    "<p>",
    "</p>",
    "<span>",
    "</span>",
    "<h1>",
    "</h1>",
    "React",
    "Vue",
    "Angular",
    "Svelte",
    "Node",
    "Next.js",
    "TypeScript",
    "JavaScript",
  ]

  // Colors for the symbols
  const colors = [
    "text-green-400",
    "text-green-500",
    "text-green-600",
    "text-blue-400",
    "text-blue-500",
    "text-blue-600",
    "text-purple-400",
    "text-purple-500",
    "text-purple-600",
    "text-yellow-400",
    "text-yellow-500",
    "text-yellow-600",
    "text-pink-400",
    "text-pink-500",
    "text-pink-600",
    "text-cyan-400",
    "text-cyan-500",
    "text-cyan-600",
  ]

  // Create a new symbol
  const createSymbol = (id: number): Symbol => {
    return {
      id,
      char: codingChars[Math.floor(Math.random() * codingChars.length)],
      x: Math.random() * dimensions.width,
      y: -50 - Math.random() * 500, // Start above the viewport
      speed: 1 + Math.random() * 3,
      opacity: 0.5 + Math.random() * 0.5,
      size: 12 + Math.floor(Math.random() * 16),
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  // Initialize symbols
  useEffect(() => {
    const initialSymbols: Symbol[] = []
    const symbolCount = Math.floor(dimensions.width / 20) // Adjust density based on screen width

    for (let i = 0; i < symbolCount; i++) {
      initialSymbols.push(createSymbol(i))
    }

    setSymbols(initialSymbols)

    // Handle window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [dimensions.width])

  // Animation loop
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setSymbols((prevSymbols) =>
        prevSymbols.map((symbol) => {
          // Move symbol down
          const y = symbol.y + symbol.speed

          // If symbol is off screen, reset it to the top
          if (y > dimensions.height) {
            return createSymbol(symbol.id)
          }

          return { ...symbol, y }
        }),
      )
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [symbols, dimensions.height])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className={`absolute ${symbol.color} font-mono whitespace-nowrap`}
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            opacity: symbol.opacity,
            fontSize: `${symbol.size}px`,
            transform: `rotate(${Math.random() * 10 - 5}deg)`,
            textShadow: `0 0 5px currentColor`,
          }}
        >
          {symbol.char}
        </div>
      ))}
    </div>
  )
}

"use client"

import { motion, useAnimation } from "framer-motion"
import { Code2} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export type IconType = "code2"

interface CodeIconProps {
  type?: IconType
  size?: number
  color?: string
  animated?: boolean
  className?: string
  onClick?: () => void
}

export function CodeIcon({
  type = "code2",
  size = 24,
  color = "currentColor",
  className,
  onClick,
}: CodeIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  const iconMap = {
    code2: Code2,
  }

  const IconComponent = iconMap[type]

  // Function to run the animation cycle
  const runAnimationCycle = async () => {
    // Wait 4 seconds before starting
    await new Promise((resolve) => setTimeout(resolve, 4000))

    while (true) {
      // Fast spin for 2 seconds
      await controls.start({
        rotate: 920, // Spin twice for faster effect
        transition: {
          duration: 2,
          ease: "linear",
        },
      })

      // Reset rotation without animation
      await controls.set({ rotate: 0 })

      // Pause for 4 seconds
      await new Promise((resolve) => setTimeout(resolve, 4000))
    }
  }

  useEffect(() => {
    // Start the animation cycle when component mounts
    runAnimationCycle()

    // No cleanup needed as the animation will stop when component unmounts
  }, [])

  const hoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
      },
    },
  }

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      initial="initial"
      animate={controls}
      whileHover={isHovered ? "hover" : "initial"}
      whileTap="tap"
      variants={hoverVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <IconComponent size={size} color={color} />
    </motion.div>
  )
}

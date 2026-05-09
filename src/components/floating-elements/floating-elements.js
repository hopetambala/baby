import React from "react"
import { motion } from "framer-motion"

const ELEMENTS = [
  { icon: "🍼",  x: 8,  y: 15, duration: 7,  delay: 0   },
  { icon: "🌙",  x: 88, y: 22, duration: 9,  delay: 1.5 },
  { icon: "👶🏾", x: 15, y: 62, duration: 8,  delay: 3   },
  { icon: "⭐",  x: 78, y: 70, duration: 10, delay: 0.5 },
  { icon: "🌸",  x: 52, y: 42, duration: 6,  delay: 4.5 },
  { icon: "🍼",  x: 65, y: 8,  duration: 11, delay: 2   },
  { icon: "🌸",  x: 30, y: 82, duration: 7,  delay: 5   },
  { icon: "🌙",  x: 90, y: 55, duration: 9,  delay: 0   },
  { icon: "⭐",  x: 42, y: 72, duration: 8,  delay: 7   },
  { icon: "🐥", x: 20, y: 30, duration: 10, delay: 1   },
]

export function FloatingElements() {
  return (
    <>
      {ELEMENTS.map(({ icon, x, y, duration, delay }, i) => (
        <motion.div
          key={i}
          style={{
            position: "fixed",
            left: `${x}%`,
            top: `${y}%`,
            opacity: 0.45,
            fontSize: "36px",
            pointerEvents: "none",
            zIndex: 0,
            userSelect: "none",
          }}
          animate={{ y: [0, -50, 0], x: [0, 25, -25, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      ))}
    </>
  )
}

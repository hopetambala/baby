import React, { useState, useEffect } from "react"
import * as styles from "./countdown.module.css"

const DUE_DATE = new Date("2026-10-09T00:00:00")

function getTimeLeft() {
  const diff = DUE_DATE - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (timeLeft === null) return null

  if (timeLeft === undefined || Object.keys(timeLeft).length === 0) {
    return <p className={styles.arrived}>She&rsquo;s here! 🐥</p>
  }

  const units = [
    ["days", timeLeft.days],
    ["hours", timeLeft.hours],
    ["minutes", timeLeft.minutes],
    ["seconds", timeLeft.seconds],
  ]

  return (
    <div className={styles.countdown}>
      {units.map(([label, value]) => (
        <div key={label} className={styles.unit}>
          <span className={styles.number}>{String(value).padStart(2, "0")}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  )
}

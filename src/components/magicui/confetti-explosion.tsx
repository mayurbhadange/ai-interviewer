"use client"

import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

export function ConfettiExplosion() {
  const refCanvas = useRef<HTMLCanvasElement>(null)
  const refConfetti = useRef<confetti.CreateTypes | null>(null)

  useEffect(() => {
    // Initialize confetti
    if (refCanvas.current && !refConfetti.current) {
      refConfetti.current = confetti.create(refCanvas.current, {
        resize: true,
        useWorker: true,
      })

      // Fire initial explosion
      fireConfetti()

      // Fire a few more bursts for a more dramatic effect
      setTimeout(() => fireConfetti(0.25, { x: 0.2, y: 0.8 }), 500)
      setTimeout(() => fireConfetti(0.25, { x: 0.8, y: 0.8 }), 800)
    }

    return () => {
      if (refConfetti.current) {
        refConfetti.current.reset()
      }
    }
  }, [])

  const fireConfetti = (particleRatio = 0.5, origin = { x: 0.5, y: 0.3 }) => {
    if (!refConfetti.current) return

    refConfetti.current({
      particleCount: 100,
      spread: 70,
      origin,
      colors: ["#3b82f6", "#93c5fd", "#1d4ed8", "#60a5fa", "#2563eb"],
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2,
      shapes: ["circle", "square"],
    //   particleRatio,
    })
  }

  return (
    <canvas
      ref={refCanvas}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  )
}

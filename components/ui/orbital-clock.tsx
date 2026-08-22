"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

export function OrbitalClock() {
  const [time, setTime] = useState(new Date())
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setMousePos({ x: x * 8, y: y * 8 })
  }

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000
  const minutes = time.getMinutes() + seconds / 60
  const hours = (time.getHours() % 12) + minutes / 60

  const secondDeg = seconds * 6
  const minuteDeg = minutes * 6
  const hourDeg = hours * 30

  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const ORB_PRIMARY = "rgb(167,139,250)"
  const MARKER_STRONG = "rgba(255,255,255,0.7)"
  const MARKER_WEAK = "rgba(255,255,255,0.25)"
  const CENTER = "rgba(255,255,255,0.85)"
  const DATE_COLOR = "rgba(148,163,184,0.9)"

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer select-none text-slate-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: "600px" }}
    >
      <div
        className="relative w-52 h-52 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(circle, color-mix(in srgb, ${ORB_PRIMARY} 40%, transparent) 0%, transparent 70%)`
              : "transparent",
            transform: isHovered ? "scale(1.3)" : "scale(1)",
          }}
        />

        <div className="absolute inset-2 rounded-full bg-[#131119] border border-white/10 shadow-xl">
          <div
            className="absolute inset-3 rounded-full border transition-all duration-500"
            style={{
              borderColor: isHovered ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.05)",
            }}
          />

          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30
            const isActive = Math.floor(hours) === i || Math.floor(hours) === i + 12
            const rad = (angle - 90) * (Math.PI / 180)
            const x = 50 + 38 * Math.cos(rad)
            const y = 50 + 38 * Math.sin(rad)

            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  background: isActive
                    ? ORB_PRIMARY
                    : i % 3 === 0
                      ? MARKER_STRONG
                      : MARKER_WEAK,
                  boxShadow: isActive
                    ? `0 0 10px color-mix(in srgb, ${ORB_PRIMARY} 70%, transparent)`
                    : "none",
                }}
              />
            )
          })}

          <div
            className="absolute left-1/2 bottom-1/2 w-1 origin-bottom rounded-full transition-all duration-200 bg-slate-200"
            style={{
              height: "28%",
              transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            }}
          />

          <div
            className="absolute left-1/2 bottom-1/2 w-0.5 origin-bottom rounded-full transition-all duration-200 bg-slate-300"
            style={{
              height: "36%",
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            }}
          />

          <div
            className="absolute left-1/2 bottom-1/2 origin-bottom rounded-full"
            style={{
              width: "1px",
              height: "40%",
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              background: ORB_PRIMARY,
              boxShadow: `0 0 8px color-mix(in srgb, ${ORB_PRIMARY} 70%, transparent)`,
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              transform: "translate(-50%, -50%)",
              background: isHovered ? ORB_PRIMARY : CENTER,
              boxShadow: isHovered
                ? `0 0 12px color-mix(in srgb, ${ORB_PRIMARY} 80%, transparent)`
                : "none",
            }}
          />
        </div>
      </div>

      <div
        className="absolute w-full flex items-center justify-center -bottom-8 left-1/2 font-mono text-xs tracking-[0.3em] uppercase transition-all duration-500"
        style={{
          transform: `translateX(-50%) translateY(${isHovered ? 0 : -10}px)`,
          opacity: isHovered ? 1 : 0,
          color: isHovered ? ORB_PRIMARY : DATE_COLOR,
        }}
      >
        {formatDate()}
      </div>
    </div>
  )
}

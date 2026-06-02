"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Shared3DBackground } from "./shared-3d-background"

// Hero stats data
const heroStats = [
  { value: 196, label: "Matches Played", suffix: "", icon: "M" },
  { value: 1256, label: "Runs Scored", suffix: "+", icon: "R" },
  { value: 47, label: "Highest Score", suffix: "", icon: "H" },
  { value: 28, label: "Average", suffix: ".5", icon: "A" },
  { value: 15, label: "Not Outs", suffix: "", icon: "N" },
]

// Attribute cards data
const attributes = [
  { 
    name: "Discipline", 
    description: "Unwavering commitment to training and match preparation",
    level: 92,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  },
  { 
    name: "Consistency", 
    description: "Reliable performance across diverse match conditions",
    level: 88,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  { 
    name: "Leadership", 
    description: "Natural ability to inspire and guide teammates",
    level: 85,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  { 
    name: "Confidence", 
    description: "Strong self-belief under high-pressure situations",
    level: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  { 
    name: "Focus", 
    description: "Exceptional concentration throughout long innings",
    level: 94,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  { 
    name: "Sportsmanship", 
    description: "Exemplary conduct and respect for the game",
    level: 96,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  },
]

// Count up animation hook
function useCountUp(end: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      setCount(Math.floor(easeProgress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, start])
  
  return count
}

// Hexagonal stat card component
function HexStatCard({ stat, index, isInView }: { stat: typeof heroStats[0], index: number, isInView: boolean }) {
  const count = useCountUp(stat.value, 2500, isInView)
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate hexagon position in a radial pattern
  const angle = (index / heroStats.length) * Math.PI * 2 - Math.PI / 2
  const radius = 180
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return (
    <motion.div
      className="absolute"
      style={{ 
        left: `calc(50% + ${x}px - 70px)`,
        top: `calc(50% + ${y}px - 70px)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 + 0.5, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connecting line to center */}
      <motion.svg
        className="absolute pointer-events-none"
        style={{
          width: radius + 70,
          height: radius + 70,
          left: x > 0 ? -radius : 0,
          top: y > 0 ? -radius : 0,
          transform: `translate(${x > 0 ? 70 : 0}px, ${y > 0 ? 70 : 0}px)`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.3 }}
      >
        <motion.line
          x1={x > 0 ? 0 : radius}
          y1={y > 0 ? 0 : radius}
          x2={x > 0 ? radius : 0}
          y2={y > 0 ? radius : 0}
          stroke="url(#lineGradient)"
          strokeWidth={isHovered ? 3 : 1}
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.15 + 0.8 }}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      {/* Hexagon card */}
      <motion.div
        className="relative w-[140px] h-[140px] cursor-pointer"
        animate={{
          scale: isHovered ? 1.15 : 1,
          z: isHovered ? 50 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            filter: "blur(20px)"
          }}
          animate={{ opacity: isHovered ? 0.4 : 0.1 }}
        />
        
        {/* Hexagon shape using clip-path */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: isHovered 
              ? "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(10,10,10,0.95) 100%)"
              : "linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(5,5,5,0.95) 100%)",
            border: "none"
          }}
        />
        
        {/* Border hexagon */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 140">
          <motion.polygon
            points="70,5 135,37.5 135,102.5 70,135 5,102.5 5,37.5"
            fill="none"
            stroke={isHovered ? "#22c55e" : "#22c55e40"}
            strokeWidth={isHovered ? 2 : 1}
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
          />
        </svg>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
          <motion.div
            className="text-3xl md:text-4xl font-black text-primary mb-1"
            style={{ textShadow: "0 0 20px rgba(34,197,94,0.5)" }}
          >
            {count}{stat.suffix}
          </motion.div>
          <div className="text-[10px] md:text-xs text-muted-foreground font-medium leading-tight">
            {stat.label}
          </div>
        </div>
        
        {/* Pulse ring on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                border: "2px solid #22c55e"
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// Central core component
function CentralCore({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Rotating outer ring */}
      <motion.div
        className="absolute -inset-16 rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={angle}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translateX(64px) translateY(-50%)`
            }}
          />
        ))}
      </motion.div>
      
      {/* Inner rotating ring */}
      <motion.div
        className="absolute -inset-10 rounded-full border border-accent/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[45, 135, 225, 315].map((angle) => (
          <div
            key={angle}
            className="absolute w-1.5 h-1.5 bg-accent rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${angle}deg) translateX(40px) translateY(-50%)`
            }}
          />
        ))}
      </motion.div>
      
      {/* Core hexagon */}
      <div className="relative w-28 h-28">
        {/* Glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            filter: "blur(25px)",
            opacity: 0.5
          }}
        />
        
        {/* Hexagon */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          }}
        />
        
        {/* Inner hexagon */}
        <div
          className="absolute inset-2"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(5,5,5,0.95) 100%)"
          }}
        />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-primary">STATS</span>
          <span className="text-[8px] text-muted-foreground tracking-widest">ANALYTICS</span>
        </div>
      </div>
    </motion.div>
  )
}

// Holographic Skill Web - Interactive radar visualization for traits
function HolographicSkillWeb({ isInView }: { isInView: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [rotationAngle, setRotationAngle] = useState(0)
  
  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || !isInView) return
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.3) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isAutoRotating, isInView])
  
  const centerX = 300
  const centerY = 300
  const maxRadius = 220
  const rings = [0.33, 0.66, 1] // Inner, middle, outer rings
  
  // Calculate point positions on the web
  const getPointPosition = (index: number, level: number, baseAngle: number = 0) => {
    const angle = ((index / attributes.length) * Math.PI * 2) - Math.PI / 2 + (baseAngle * Math.PI / 180)
    const radius = (level / 100) * maxRadius
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: angle * (180 / Math.PI)
    }
  }
  
  // Get label position (outside the web)
  const getLabelPosition = (index: number, baseAngle: number = 0) => {
    const angle = ((index / attributes.length) * Math.PI * 2) - Math.PI / 2 + (baseAngle * Math.PI / 180)
    const radius = maxRadius + 60
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  }
  
  // Create the skill polygon path
  const getSkillPolygonPath = (baseAngle: number = 0) => {
    const points = attributes.map((attr, i) => {
      const pos = getPointPosition(i, attr.level, baseAngle)
      return `${pos.x},${pos.y}`
    })
    return `M${points.join('L')}Z`
  }

  return (
    <div className="relative w-full max-w-[700px] mx-auto">
      {/* Outer glow container */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      
      {/* Main SVG */}
      <svg 
        viewBox="0 0 600 600" 
        className="w-full h-auto"
        onMouseEnter={() => setIsAutoRotating(false)}
        onMouseLeave={() => setIsAutoRotating(true)}
      >
        <defs>
          {/* Skill area gradient */}
          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#16a34a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.3" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Pulse animation */}
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          
          {/* Node gradient */}
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
        </defs>
        
        {/* Background circular grid */}
        <g opacity={isInView ? 1 : 0} style={{ transition: "opacity 1s" }}>
          {/* Concentric rings */}
          {rings.map((ring, i) => (
            <motion.circle
              key={`ring-${i}`}
              cx={centerX}
              cy={centerY}
              r={maxRadius * ring}
              fill="none"
              stroke="rgba(34,197,94,0.15)"
              strokeWidth={1}
              strokeDasharray={i === 2 ? "none" : "4 4"}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
          ))}
          
          {/* Percentage labels on rings */}
          {[33, 66, 100].map((pct, i) => (
            <text
              key={`pct-${i}`}
              x={centerX + 8}
              y={centerY - maxRadius * rings[i] + 4}
              fill="rgba(34,197,94,0.4)"
              fontSize="10"
              fontWeight="bold"
            >
              {pct}%
            </text>
          ))}
          
          {/* Axis lines from center to each trait */}
          {attributes.map((_, i) => {
            const outerPoint = getPointPosition(i, 100, rotationAngle)
            return (
              <motion.line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke={activeIndex === i ? "rgba(34,197,94,0.8)" : "rgba(34,197,94,0.2)"}
                strokeWidth={activeIndex === i ? 2 : 1}
                strokeDasharray={activeIndex === i ? "none" : "2 4"}
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
              />
            )
          })}
        </g>
        
        {/* Skill polygon - the filled area */}
        <motion.path
          d={getSkillPolygonPath(rotationAngle)}
          fill="url(#skillGradient)"
          stroke="#22c55e"
          strokeWidth={2}
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        />
        
        {/* Data points on the polygon */}
        {attributes.map((attr, i) => {
          const pos = getPointPosition(i, attr.level, rotationAngle)
          const isActive = activeIndex === i
          
          return (
            <g key={`point-${i}`}>
              {/* Pulse ring when active */}
              {isActive && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={25}
                  fill="url(#pulseGradient)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Outer glow */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 18 : 12}
                fill="rgba(34,197,94,0.2)"
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 1.2 }}
              />
              
              {/* Main node */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 10 : 6}
                fill="url(#nodeGradient)"
                stroke="#fff"
                strokeWidth={2}
                style={{ cursor: "pointer" }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 1.2, type: "spring" }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              />
              
              {/* Level value near node */}
              <motion.text
                x={pos.x}
                y={pos.y - 18}
                fill={isActive ? "#4ade80" : "#22c55e"}
                fontSize={isActive ? "14" : "11"}
                fontWeight="bold"
                textAnchor="middle"
                filter={isActive ? "url(#glow)" : "none"}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.1 + 1.5 }}
              >
                {attr.level}%
              </motion.text>
            </g>
          )
        })}
        
        {/* Trait labels around the outside */}
        {attributes.map((attr, i) => {
          const labelPos = getLabelPosition(i, rotationAngle)
          const isActive = activeIndex === i
          const isRightSide = labelPos.x > centerX
          
          return (
            <motion.g
              key={`label-${i}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.1 + 1.8 }}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Label background */}
              <rect
                x={isRightSide ? labelPos.x - 10 : labelPos.x - 90}
                y={labelPos.y - 12}
                width={100}
                height={24}
                rx={4}
                fill={isActive ? "rgba(34,197,94,0.2)" : "rgba(10,10,10,0.8)"}
                stroke={isActive ? "#22c55e" : "rgba(34,197,94,0.3)"}
                strokeWidth={1}
              />
              
              {/* Icon circle */}
              <circle
                cx={isRightSide ? labelPos.x : labelPos.x - 80}
                cy={labelPos.y}
                r={8}
                fill={isActive ? "#22c55e" : "rgba(34,197,94,0.3)"}
              />
              
              {/* Label text */}
              <text
                x={isRightSide ? labelPos.x + 15 : labelPos.x - 65}
                y={labelPos.y + 4}
                fill={isActive ? "#4ade80" : "#a3a3a3"}
                fontSize="11"
                fontWeight={isActive ? "bold" : "medium"}
              >
                {attr.name}
              </text>
            </motion.g>
          )
        })}
        
        {/* Center core */}
        <motion.g
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
        >
          {/* Outer rotating ring */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={45}
            fill="none"
            stroke="rgba(34,197,94,0.3)"
            strokeWidth={1}
            strokeDasharray="8 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
          
          {/* Middle ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={35}
            fill="rgba(34,197,94,0.1)"
            stroke="rgba(34,197,94,0.4)"
            strokeWidth={2}
          />
          
          {/* Inner core */}
          <circle
            cx={centerX}
            cy={centerY}
            r={25}
            fill="linear-gradient(135deg, #22c55e, #16a34a)"
            stroke="#4ade80"
            strokeWidth={2}
          />
          
          {/* Core icon - cricket bat/player silhouette */}
          <text
            x={centerX}
            y={centerY + 5}
            fill="#fff"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            CORE
          </text>
        </motion.g>
      </svg>
      
      {/* Active trait detail panel */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="p-4 rounded-xl backdrop-blur-xl"
              style={{
                background: "rgba(10,10,10,0.95)",
                border: "1px solid rgba(34,197,94,0.4)",
                boxShadow: "0 0 30px rgba(34,197,94,0.2)"
              }}
            >
              {/* HUD-style corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br" />
              
              <div className="flex items-start gap-4">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-primary"
                  style={{ background: "rgba(34,197,94,0.15)" }}
                >
                  {attributes[activeIndex].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-bold text-foreground">
                      {attributes[activeIndex].name}
                    </h4>
                    <span 
                      className="text-2xl font-black text-primary"
                      style={{ textShadow: "0 0 10px rgba(34,197,94,0.5)" }}
                    >
                      {attributes[activeIndex].level}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {attributes[activeIndex].description}
                  </p>
                  
                  {/* Mini progress bar */}
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${attributes[activeIndex].level}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Instructions */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2.5 }}
      >
        <p className="text-xs text-muted-foreground">
          Hover over nodes or labels to explore traits
        </p>
      </motion.div>
    </div>
  )
}

// Floating particles component
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    })), []
  )
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.3
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Main component
export function PerformanceStatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const hexGridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const isHexInView = useInView(hexGridRef, { once: true, margin: "-50px" })
  
  return (
    <section 
      ref={sectionRef}
      id="stats"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(5,5,5,1) 0%, rgba(10,10,10,1) 50%, rgba(5,5,5,1) 100%)"
      }}
    >
      {/* 3D Cricket Background */}
      <Shared3DBackground />

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stadium light rays */}
        <div className="absolute top-0 left-1/4 w-1 h-[400px] bg-gradient-to-b from-primary/10 to-transparent transform -rotate-12" />
        <div className="absolute top-0 right-1/4 w-1 h-[400px] bg-gradient-to-b from-primary/10 to-transparent transform rotate-12" />
        <div className="absolute top-0 left-1/2 w-1 h-[500px] bg-gradient-to-b from-primary/5 to-transparent transform -translate-x-1/2" />
        
        {/* Cricket field pattern - subtle hexagonal grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15v22L30 52 0 37V15z' fill='none' stroke='%2322c55e' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 52px"
          }}
        />
      </div>
      
      <FloatingParticles />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)"
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">
              Performance Analytics
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            Performance By The{" "}
            <span className="text-primary" style={{ textShadow: "0 0 30px rgba(34,197,94,0.3)" }}>
              Numbers
            </span>
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Every run, every match, every moment contributing to a bigger journey.
          </p>
        </motion.div>
        
        {/* Hexagonal Stats Grid */}
        <div 
          ref={hexGridRef}
          className="relative h-[500px] md:h-[550px] mb-20 md:mb-28"
        >
          {/* Central Core */}
          <CentralCore isInView={isHexInView} />
          
          {/* Hexagonal Stat Cards */}
          {heroStats.map((stat, i) => (
            <HexStatCard 
              key={stat.label} 
              stat={stat} 
              index={i} 
              isInView={isHexInView}
            />
          ))}
          
          {/* Data stream lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="dataStream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Key Traits Section - Holographic Skill Web */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Key Traits
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          
          <HolographicSkillWeb isInView={isInView} />
        </motion.div>
        
        {/* Bottom accent */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-3 h-3 rotate-45 border border-primary/50" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/50" />
        </motion.div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}

"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"

// Achievement categories with premium styling
const achievementCategories = [
  { id: "tournaments", label: "Tournament Participation", icon: "🏆", count: 15 },
  { id: "certifications", label: "Cricket Certifications", icon: "📜", count: 8 },
  { id: "academy", label: "Academy Recognition", icon: "🎓", count: 12 },
  { id: "teams", label: "Team Representation", icon: "👥", count: 6 },
  { id: "competitive", label: "Competitive Experience", icon: "⚡", count: 25 },
]

// Sample certificates data with real achievement images
const certificates = [
  {
    id: 1,
    title: "District Level Championship",
    category: "tournaments",
    date: "2024",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop&q=80",
    description: "Winner - U-17 District Cricket Championship",
  },
  {
    id: 2,
    title: "BCCI Coaching Certificate",
    category: "certifications",
    date: "2024",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop&q=80",
    description: "Level 1 Cricket Coaching Certification",
  },
  {
    id: 3,
    title: "Academy Excellence Award",
    category: "academy",
    date: "2023",
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&h=600&fit=crop&q=80",
    description: "Best All-Rounder of the Year",
  },
  {
    id: 4,
    title: "State Team Selection",
    category: "teams",
    date: "2024",
    image: "https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=800&h=600&fit=crop&q=80",
    description: "Selected for State U-19 Cricket Team",
  },
  {
    id: 5,
    title: "Inter-School Championship",
    category: "competitive",
    date: "2024",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&h=600&fit=crop&q=80",
    description: "Runner-up - Regional Inter-School Tournament",
  },
  {
    id: 6,
    title: "Summer Cricket Camp",
    category: "academy",
    date: "2023",
    image: "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=800&h=600&fit=crop&q=80",
    description: "Outstanding Performance Certificate",
  },
]

// Floating particle component
function FloatingParticle({ delay, duration, size, left }: { delay: number; duration: number; size: number; left: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: "-20px",
        background: `radial-gradient(circle, rgba(34, 197, 94, ${0.3 + Math.random() * 0.4}) 0%, transparent 70%)`,
        boxShadow: `0 0 ${size * 2}px rgba(34, 197, 94, 0.3)`,
      }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{
        y: [0, -800, -1600],
        opacity: [0, 1, 0],
        scale: [0, 1, 0.5],
        x: [0, Math.sin(left) * 100, Math.sin(left) * 200],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  )
}

// Stadium spotlight effect
function StadiumSpotlight({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {/* Left spotlight */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px]"
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, rgba(34, 197, 94, 0.15) 0deg, transparent 60deg)",
          filter: "blur(40px)",
        }}
        animate={{
          rotate: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Right spotlight */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px]"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, rgba(212, 175, 55, 0.1) 0deg, transparent 60deg)",
          filter: "blur(40px)",
        }}
        animate={{
          rotate: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Center glow */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

// 3D Tilt Certificate Card
function CertificateCard({
  certificate,
  index,
  onClick,
  isInView,
}: {
  certificate: typeof certificates[0]
  index: number
  onClick: () => void
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const categoryColors: Record<string, string> = {
    tournaments: "from-amber-500/20 to-yellow-600/20",
    certifications: "from-emerald-500/20 to-green-600/20",
    academy: "from-blue-500/20 to-cyan-600/20",
    teams: "from-purple-500/20 to-violet-600/20",
    competitive: "from-rose-500/20 to-pink-600/20",
  }

  const categoryBorders: Record<string, string> = {
    tournaments: "border-amber-500/30",
    certifications: "border-emerald-500/30",
    academy: "border-blue-500/30",
    teams: "border-purple-500/30",
    competitive: "border-rose-500/30",
  }

  const categoryGlows: Record<string, string> = {
    tournaments: "rgba(245, 158, 11, 0.4)",
    certifications: "rgba(34, 197, 94, 0.4)",
    academy: "rgba(59, 130, 246, 0.4)",
    teams: "rgba(147, 51, 234, 0.4)",
    competitive: "rgba(244, 63, 94, 0.4)",
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer perspective-1000"
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border ${categoryBorders[certificate.category]} bg-gradient-to-br ${categoryColors[certificate.category]} backdrop-blur-xl`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px ${categoryGlows[certificate.category]}`
            : "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${categoryGlows[certificate.category]} 0%, transparent 50%, ${categoryGlows[certificate.category]} 100%)`,
            opacity: isHovered ? 0.3 : 0,
          }}
          animate={{
            rotate: isHovered ? [0, 360] : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Certificate image with real photo */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
          />
          
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* View icon on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3" style={{ transform: "translateZ(20px)" }}>
          {/* Category badge */}
          <motion.div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColors[certificate.category]} border ${categoryBorders[certificate.category]}`}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
          </motion.div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
            {certificate.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {certificate.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground font-medium">
              {certificate.date}
            </span>
            <motion.span
              className="text-xs text-primary font-semibold flex items-center gap-1"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              View Details
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Lightbox component
function Lightbox({
  certificate,
  onClose,
}: {
  certificate: typeof certificates[0] | null
  onClose: () => void
}) {
  if (!certificate) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Content */}
        <motion.div
          className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-3xl border border-primary/20 bg-gradient-to-br from-card/95 to-background/95 backdrop-blur-2xl shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow effect */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-50 blur-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)",
            }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted/50 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/50"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Image area */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={certificate.image}
              alt={certificate.title}
              fill
              className="object-cover"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl font-bold text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {certificate.title}
              </motion.h2>

              <motion.p
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {certificate.description}
              </motion.p>
            </div>

            <motion.div
              className="flex items-center gap-6 pt-4 border-t border-border/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span className="text-muted-foreground">{certificate.date}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Achievement counter with animated number
function AchievementCounter({ 
  item, 
  index, 
  isInView 
}: { 
  item: typeof achievementCategories[0]
  index: number
  isInView: boolean 
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    
    const duration = 2000
    const steps = 60
    const increment = item.count / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= item.count) {
        setCount(item.count)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, item.count])

  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
          background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
        }} />
        
        <div className="relative flex items-center gap-4">
          {/* Animated counter */}
          <div className="text-3xl md:text-4xl font-black text-primary" style={{ textShadow: "0 0 30px rgba(34, 197, 94, 0.5)" }}>
            {count}+
          </div>
          
          {/* Label */}
          <div className="text-sm md:text-base text-muted-foreground font-medium whitespace-nowrap">
            {item.label}
          </div>
        </div>
        
        {/* Animated line */}
        <motion.div
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
        />
      </div>
    </motion.div>
  )
}

// Main component
export function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    size: 4 + Math.random() * 8,
    left: Math.random() * 100,
  }))

  const filteredCertificates = activeFilter === "all" 
    ? certificates 
    : certificates.filter(c => c.category === activeFilter)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(5,15,5,1) 50%, rgba(10,10,10,1) 100%)",
      }}
    >
      {/* Stadium spotlight effects */}
      <StadiumSpotlight isInView={isInView} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Dynamic gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 space-y-6">
          {/* Decorative top element */}
          <motion.div
            className="flex justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-primary"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div
              className="w-3 h-3 rotate-45 bg-primary"
              animate={{ rotate: [45, 225, 45] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-primary"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>

          {/* Main title */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-foreground">Achievements</span>
            <br />
            <span 
              className="text-primary"
              style={{ textShadow: "0 0 60px rgba(34, 197, 94, 0.5), 0 0 120px rgba(34, 197, 94, 0.3)" }}
            >
              & Milestones
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Every certificate represents dedication, growth, discipline, and progress on the journey toward excellence.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-1 w-32 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              style={{ backgroundSize: "200% 200%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30"
            }`}
            onClick={() => setActiveFilter("all")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Achievements
          </motion.button>
          {achievementCategories.slice(0, 4).map((cat) => (
            <motion.button
              key={cat.id}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/30"
              }`}
              onClick={() => setActiveFilter(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-28"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredCertificates.map((certificate, index) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                index={index}
                onClick={() => setSelectedCertificate(certificate)}
                isInView={isInView}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Achievement Summary Strip */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -mx-4 md:-mx-6 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)",
              }}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Stats strip */}
          <div className="relative py-8 md:py-12">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {achievementCategories.map((item, index) => (
                <AchievementCounter 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  isInView={isInView} 
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="flex justify-center mt-16 md:mt-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedCertificate && (
          <Lightbox
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default AchievementsSection

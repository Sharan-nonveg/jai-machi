"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2, Grid3X3, LayoutGrid } from "lucide-react"

interface GalleryImage {
  id: number
  src: string
  category: string
  title: string
  description: string
  date: string
  aspectRatio: "portrait" | "landscape" | "square"
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/gallery/match-day-1.png",
    category: "Match Day",
    title: "The Perfect Drive",
    description: "Championship finals - a defining moment",
    date: "March 2024",
    aspectRatio: "portrait"
  },
  {
    id: 2,
    src: "/gallery/match-day-2.png",
    category: "Match Day",
    title: "Century Celebration",
    description: "100 runs - breaking personal records",
    date: "February 2024",
    aspectRatio: "landscape"
  },
  {
    id: 3,
    src: "/gallery/training-1.png",
    category: "Training Sessions",
    title: "Net Practice Intensity",
    description: "Early morning sessions that build champions",
    date: "January 2024",
    aspectRatio: "square"
  },
  {
    id: 4,
    src: "/gallery/training-2.png",
    category: "Training Sessions",
    title: "Dawn Dedication",
    description: "Fitness at first light",
    date: "December 2023",
    aspectRatio: "landscape"
  },
  {
    id: 5,
    src: "/gallery/team-1.png",
    category: "Team Moments",
    title: "Brotherhood",
    description: "Victory huddle with teammates",
    date: "November 2023",
    aspectRatio: "portrait"
  },
  {
    id: 6,
    src: "/gallery/tournament-1.png",
    category: "Tournaments",
    title: "Under The Lights",
    description: "Championship night atmosphere",
    date: "October 2023",
    aspectRatio: "landscape"
  },
  {
    id: 7,
    src: "/gallery/achievement-1.png",
    category: "Achievements",
    title: "Golden Moment",
    description: "Man of the match recognition",
    date: "September 2023",
    aspectRatio: "portrait"
  },
  {
    id: 8,
    src: "/gallery/match-day-3.png",
    category: "Match Day",
    title: "The Delivery",
    description: "Bowling precision at its finest",
    date: "August 2023",
    aspectRatio: "square"
  },
  {
    id: 9,
    src: "/gallery/team-2.png",
    category: "Team Moments",
    title: "March to Glory",
    description: "Walking onto the field together",
    date: "July 2023",
    aspectRatio: "landscape"
  },
  {
    id: 10,
    src: "/gallery/achievement-2.png",
    category: "Achievements",
    title: "Medal of Honor",
    description: "Tournament MVP recognition",
    date: "June 2023",
    aspectRatio: "portrait"
  },
  {
    id: 11,
    src: "/gallery/tournament-2.png",
    category: "Tournaments",
    title: "The Catch",
    description: "Match-winning fielding moment",
    date: "May 2023",
    aspectRatio: "square"
  }
]

const categories = ["All", "Match Day", "Training Sessions", "Team Moments", "Tournaments", "Achievements"]

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cricket-green/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Premium lightbox component
function Lightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev 
}: {
  images: GalleryImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev])

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(onNext, 4000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, onNext])

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div 
            className="absolute inset-0 bg-cricket-darker/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          
          {/* Dynamic lighting effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full bg-cricket-green/10 blur-[150px]"
              animate={{
                x: ["-50%", "50%", "-50%"],
                y: ["-30%", "30%", "-30%"],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ left: "50%", top: "50%" }}
            />
          </div>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main image with frame */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cricket-green via-cricket-gold to-cricket-green rounded-lg opacity-50 blur group-hover:opacity-75 transition-opacity" />
              <motion.img
                key={currentImage.id}
                src={currentImage.src}
                alt={currentImage.title}
                className="relative max-w-full max-h-[70vh] object-contain rounded-lg"
                initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Spotlight overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cricket-darker/80 via-transparent to-transparent rounded-lg pointer-events-none" />
            </div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center max-w-xl"
            >
              <span className="text-cricket-green text-xs font-semibold tracking-[0.3em] uppercase">
                {currentImage.category}
              </span>
              <h3 className="text-2xl font-bold text-foreground mt-2">
                {currentImage.title}
              </h3>
              <p className="text-muted-foreground mt-1">
                {currentImage.description}
              </p>
              <p className="text-cricket-gold text-sm mt-2">{currentImage.date}</p>
            </motion.div>

            {/* Image counter */}
            <div className="mt-4 flex items-center gap-2">
              {images.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "w-8 bg-cricket-green" 
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying) }}
              className="p-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onClose() }}
              className="p-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border hover:bg-destructive/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Navigation arrows */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-secondary/30 backdrop-blur-sm border border-border hover:bg-cricket-green/20 transition-all z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-secondary/30 backdrop-blur-sm border border-border hover:bg-cricket-green/20 transition-all z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual gallery item with premium effects
function GalleryItem({ 
  image, 
  index, 
  onClick,
  layout
}: { 
  image: GalleryImage
  index: number
  onClick: () => void
  layout: "masonry" | "grid"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  const getAspectClass = () => {
    if (layout === "grid") return "aspect-square"
    switch (image.aspectRatio) {
      case "portrait": return "aspect-[3/4]"
      case "landscape": return "aspect-[4/3]"
      default: return "aspect-square"
    }
  }

  const getSpanClass = () => {
    if (layout === "grid") return ""
    // Create interesting masonry patterns
    if (index % 5 === 0) return "md:col-span-2 md:row-span-2"
    if (index % 7 === 0) return "md:row-span-2"
    if (index % 3 === 0) return "md:col-span-2"
    return ""
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={`relative group cursor-pointer ${getSpanClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }) }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <motion.div
        className={`relative overflow-hidden rounded-xl ${getAspectClass()}`}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: isHovered ? mousePosition.y * -10 : 0,
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Glow border effect */}
        <motion.div
          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-cricket-green via-cricket-gold to-cricket-green opacity-0 blur-sm"
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Image container */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-secondary">
          <motion.img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover"
            initial={{ filter: "blur(10px)", scale: 1.2 }}
            animate={{ 
              filter: isInView ? "blur(0px)" : "blur(10px)",
              scale: isHovered ? 1.15 : 1
            }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Spotlight hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-cricket-green/20 via-transparent to-transparent"
            style={{
              background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)`
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Glass overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-cricket-darker via-cricket-darker/50 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content overlay */}
          <motion.div
            className="absolute inset-0 p-4 flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-cricket-green text-[10px] font-bold tracking-[0.25em] uppercase mb-1">
              {image.category}
            </span>
            <h4 className="text-foreground font-semibold text-lg leading-tight">
              {image.title}
            </h4>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {image.description}
            </p>
          </motion.div>

          {/* View icon */}
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 rounded-full bg-cricket-green/20 backdrop-blur-sm border border-cricket-green/30">
              <Maximize2 className="w-4 h-4 text-cricket-green" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Featured hero showcase
function FeaturedHero() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      className="relative mt-32 rounded-3xl overflow-hidden"
      style={{ opacity }}
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-cricket-green/20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cricket-gold/15 blur-[80px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-border/50 group"
      >
        {/* Border glow */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cricket-green via-cricket-gold to-cricket-green opacity-30" />
        
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src="/gallery/featured-hero.png"
            alt="Featured moment"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cricket-darker via-cricket-darker/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cricket-darker via-transparent to-cricket-darker/30" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 text-cricket-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
                <span className="w-8 h-[2px] bg-cricket-gold" />
                Featured Highlight
              </span>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Where Legends
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cricket-green to-cricket-gold">
                  Are Made
                </span>
              </h3>
              <p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
                Every frame tells a story of dedication, every moment captures the essence 
                of the beautiful game. This is not just cricket - this is legacy.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 inline-flex items-center gap-3 text-cricket-green font-semibold group/btn"
              >
                <span className="relative">
                  View Full Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cricket-green group-hover/btn:w-full transition-all duration-300" />
                </span>
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-8 right-8 flex gap-6"
        >
          {[
            { value: "500+", label: "Matches" },
            { value: "12K+", label: "Runs" },
            { value: "50+", label: "Awards" }
          ].map((stat, i) => (
            <div 
              key={i}
              className="text-center px-4 py-3 rounded-xl bg-secondary/30 backdrop-blur-sm border border-border/50"
            >
              <div className="text-2xl font-bold text-cricket-gold">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function MomentsGallery() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [layout, setLayout] = useState<"masonry" | "grid">("masonry")
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" })

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  const handleImageClick = useCallback((index: number) => {
    const actualIndex = galleryImages.findIndex(img => img.id === filteredImages[index].id)
    setCurrentImageIndex(actualIndex)
    setLightboxOpen(true)
  }, [filteredImages])

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 overflow-hidden bg-background"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cricket-green/5 via-transparent to-transparent" />
      <FloatingParticles />
      
      {/* Stadium light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-[50vh] bg-gradient-to-b from-cricket-green/50 to-transparent rotate-12" />
        <div className="absolute top-0 right-1/4 w-px h-[60vh] bg-gradient-to-b from-cricket-gold/30 to-transparent -rotate-12" />
        <div className="absolute top-0 left-1/2 w-px h-[40vh] bg-gradient-to-b from-cricket-green/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-flex items-center gap-3 text-cricket-green text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6">
              <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cricket-green" />
              Gallery
              <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cricket-green" />
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance"
          >
            <span className="text-foreground">Moments That Define</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cricket-green via-cricket-gold to-cricket-green animate-shimmer bg-[length:200%_100%]">
              The Journey
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty leading-relaxed"
          >
            Every match, every training session, every milestone captured through 
            the lens of passion and perseverance.
          </motion.p>
        </div>

        {/* Filter tabs and layout toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeCategory === category 
                    ? "text-cricket-darker" 
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-cricket-green to-cricket-gold rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary/50 border border-border">
            <button
              onClick={() => setLayout("masonry")}
              className={`p-2 rounded-full transition-all ${
                layout === "masonry" ? "bg-cricket-green text-cricket-darker" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-full transition-all ${
                layout === "grid" ? "bg-cricket-green text-cricket-darker" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          layout
          className={`
            grid gap-4 md:gap-6
            ${layout === "masonry" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] md:auto-rows-[250px]" 
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }
          `}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <GalleryItem
                key={image.id}
                image={image}
                index={index}
                onClick={() => handleImageClick(index)}
                layout={layout}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Featured hero section */}
        <FeaturedHero />
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  )
}

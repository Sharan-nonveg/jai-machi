"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Play, Pause, Camera, Zap, Focus } from "lucide-react"
import { Shared3DBackground } from "./shared-3d-background"

const galleryImages = [
  {
    id: 1,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XwqPRfjdsIvGMfCfWv8u4967x10KEh.png",
    title: "Dreams at Chinnaswamy",
    subtitle: "V.JAI #7",
    category: "Stadium",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lKHjvNBkF53QzR5cVbSlb0LUVBmyPQ.png",
    title: "Focus Mode",
    subtitle: "Net Sessions",
    category: "Training",
    featured: false,
    aspectRatio: "landscape",
  },
  {
    id: 3,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KvwZ2NJN3HYF8qb7QzcPDN6Piixl4g.png",
    title: "Karnataka Pride",
    subtitle: "TATA IPL 2026",
    category: "Stadium",
    featured: false,
    aspectRatio: "landscape",
  },
  {
    id: 4,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IbBWRyNLJOx8kxyMKYrdfdEHalENVU.png",
    title: "KIOC Academy",
    subtitle: "Karnataka Institute of Cricket",
    category: "Academy",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: 5,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aD93YdM8xo3kbtDgKxt76nvqqQBs1D.png",
    title: "Perfect Cover Drive",
    subtitle: "Match Day",
    category: "Action",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: 6,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MW3PhrsUVDibEp1Z0RfPcoiPN6gm00.png",
    title: "The Pull Shot",
    subtitle: "Championship Match",
    category: "Action",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: 7,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TnSqBhPbKnq973ltsBhSafJ1ZTShgo.png",
    title: "Ready to Battle",
    subtitle: "Practice Ground",
    category: "Portrait",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: 8,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lLXApUgEed0LZmegU3KEnvjnItnQcE.png",
    title: "Intense Practice",
    subtitle: "Net Sessions",
    category: "Training",
    featured: true,
    aspectRatio: "landscape",
  },
  {
    id: 9,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G0e3U3HlsWkjHmOhh6A2QsDoE1pJeS.png",
    title: "Defensive Stance",
    subtitle: "Tournament Play",
    category: "Action",
    featured: false,
    aspectRatio: "portrait",
  },
  {
    id: 10,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-in4EGSnaP8ASzsR981YMCPRwcg2mSw.png",
    title: "Under The Lights",
    subtitle: "Night Sessions",
    category: "Training",
    featured: false,
    aspectRatio: "square",
  },
]

// Filmstrip thumbnail component
function FilmstripThumbnail({ 
  image, 
  isActive, 
  onClick 
}: { 
  image: typeof galleryImages[0]
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 z-10' 
          : 'opacity-60 hover:opacity-100'
      }`}
      whileHover={{ scale: isActive ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-20 h-14 md:w-24 md:h-16">
        <Image
          src={image.src}
          alt={image.title}
          fill
          className="object-cover"
        />
        {isActive && (
          <motion.div
            layoutId="filmstrip-indicator"
            className="absolute inset-0 border-2 border-primary rounded-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
      {/* Film sprocket holes */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/80 flex justify-around">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/30 rounded-full mt-0" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/80 flex justify-around">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
        ))}
      </div>
    </motion.button>
  )
}

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const filmstripRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1.1, 1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Scroll filmstrip to active item
  useEffect(() => {
    if (filmstripRef.current) {
      const activeElement = filmstripRef.current.children[activeIndex] as HTMLElement
      if (activeElement) {
        // Scroll only the filmstrip container, not the page
        const scrollContainer = filmstripRef.current
        const elementOffsetLeft = (activeElement as HTMLElement).offsetLeft
        const elementWidth = (activeElement as HTMLElement).offsetWidth
        const containerWidth = scrollContainer.clientWidth
        const scrollLeft = scrollContainer.scrollLeft
        
        // Calculate target scroll position to center the element
        const targetScroll = elementOffsetLeft - (containerWidth - elementWidth) / 2
        
        scrollContainer.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        })
      }
    }
  }, [activeIndex])

  const navigateGallery = (direction: "prev" | "next") => {
    setIsAutoPlaying(false)
    if (direction === "prev") {
      setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
    } else {
      setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
    }
  }

  const currentImage = galleryImages[activeIndex]

  return (
    <section ref={containerRef} id="gallery" className="relative min-h-screen bg-background overflow-hidden">
      {/* 3D Cricket Background */}
      <Shared3DBackground />

      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Section Header - Magazine Editorial Style */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          {/* Editorial Header Layout */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            {/* Left: Title */}
            <div className="flex-1">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-primary to-transparent" />
                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">Visual Journal</span>
              </motion.div>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none"
              >
                <span className="text-foreground">Through</span>
                <br />
                <span className="text-foreground/60">The Lens</span>
              </motion.h2>
            </div>

            {/* Right: Stats & Controls */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-start md:items-end gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-3xl font-black text-foreground">{galleryImages.length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Moments</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-right">
                  <div className="text-3xl font-black text-primary">2024-26</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Timeline</div>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 hover:bg-card transition-colors"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Play</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Gallery Display - Full Width Cinematic */}
      <div className="relative z-10">
        {/* Hero Image Display */}
        <motion.div 
          className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.src}
                alt={currentImage.title}
                fill
                className="object-cover"
                priority
              />
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
              
              {/* Letterbox bars for cinematic effect */}
              <div className="absolute top-0 left-0 right-0 h-[5%] bg-gradient-to-b from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[5%] bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateGallery("prev")}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => navigateGallery("next")}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/50 transition-all group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Image Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Left: Title & Category */}
              <motion.div
                key={`info-${currentImage.id}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-xs font-medium text-primary uppercase tracking-wider">
                    {currentImage.category}
                  </span>
                  <span className="text-sm text-white/60">{String(activeIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-1">{currentImage.title}</h3>
                <p className="text-white/70">{currentImage.subtitle}</p>
              </motion.div>

              {/* Right: View Full Button */}
              <motion.button
                onClick={() => setSelectedImage(activeIndex)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group"
              >
                <Focus className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                <span className="text-white font-medium">View Full</span>
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-yellow-500"
              initial={{ width: "0%" }}
              animate={{ width: isAutoPlaying ? "100%" : `${((activeIndex + 1) / galleryImages.length) * 100}%` }}
              transition={isAutoPlaying ? { duration: 4, ease: "linear" } : { duration: 0.3 }}
              key={isAutoPlaying ? `auto-${activeIndex}` : 'manual'}
            />
          </div>
        </motion.div>

        {/* Filmstrip Thumbnails */}
        <div className="relative bg-black/80 backdrop-blur-sm py-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              {/* Film reel icon */}
              <div className="hidden md:flex items-center gap-2 text-white/40">
                <Camera className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wider">Gallery</span>
              </div>
              
              {/* Thumbnails scroll container */}
              <div 
                ref={filmstripRef}
                className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {galleryImages.map((image, index) => (
                  <FilmstripThumbnail
                    key={image.id}
                    image={image}
                    isActive={index === activeIndex}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setActiveIndex(index)
                    }}
                  />
                ))}
              </div>

              {/* Frame counter */}
              <div className="hidden md:block text-right">
                <div className="text-2xl font-mono font-bold text-primary">
                  {String(activeIndex + 1).padStart(2, '0')}
                </div>
                <div className="text-xs text-white/40">FRAME</div>
              </div>
            </div>
          </div>
          
          {/* Film perforations decoration */}
          <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/5 -mt-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['All', 'Action', 'Training', 'Stadium', 'Portrait', 'Academy'].map((category) => {
              const count = category === 'All' 
                ? galleryImages.length 
                : galleryImages.filter(img => img.category === category).length
              
              if (count === 0 && category !== 'All') return null
              
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : (prev ?? 0) - 1))
              }}
              className="absolute left-4 md:left-8 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage((prev) => ((prev ?? 0) === galleryImages.length - 1 ? 0 : (prev ?? 0) + 1))
              }}
              className="absolute right-4 md:right-8 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-[90vw] max-h-[85vh] aspect-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].title}
                width={1920}
                height={1080}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              
              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                    {galleryImages[selectedImage].category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{galleryImages[selectedImage].title}</h3>
                <p className="text-white/70">{galleryImages[selectedImage].subtitle}</p>
              </div>
            </motion.div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/50 backdrop-blur-sm">
              {galleryImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImage ? 'bg-primary w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

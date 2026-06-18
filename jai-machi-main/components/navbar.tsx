"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Journey", href: "#journey" },
  { name: "Stats", href: "#stats" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
]

// Magnetic effect hook
function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { ref, springX, springY, handleMouseMove, handleMouseLeave }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  
  const mousePositionX = useMotionValue(0)
  const mousePositionY = useMotionValue(0)
  const { scrollY } = useScroll()
  const navRef = useRef<HTMLElement>(null)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldScroll = latest > 50
    if (shouldScroll !== isScrolled) {
      setIsScrolled(shouldScroll)
    }
  })

  // IntersectionObserver for scroll-spying active sections
  useEffect(() => {
    const sections = navItems.map((item) => item.href.substring(1))
    
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Trigger when section is in active viewing area
      threshold: [0, 0.1, 0.2],
    }

    const activeSections: Record<string, boolean> = {}

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        activeSections[entry.target.id] = entry.isIntersecting
      })

      // Find the first intersecting section or fall back to the highest visible one
      const currentActive = sections.find((section) => activeSections[section])
      if (currentActive) {
        setActiveSection(currentActive)
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        mousePositionX.set(e.clientX - rect.left)
        mousePositionY.set(e.clientY - rect.top)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mousePositionX, mousePositionY])

  const mouseFollowBg = useMotionTemplate`radial-gradient(600px circle at ${mousePositionX}px ${mousePositionY}px, rgba(34, 197, 94, 0.06), transparent 40%)`
  const borderGlowBg = useMotionTemplate`radial-gradient(400px circle at ${mousePositionX}px ${mousePositionY}px, rgba(34, 197, 94, 0.15), transparent 40%)`

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const logoMagnetic = useMagnetic(0.2)
  const ctaMagnetic = useMagnetic(0.3)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4"
      >
        <nav
          ref={navRef}
          className={`
            relative mx-auto max-w-6xl rounded-2xl border transition-all duration-700
            ${isScrolled 
              ? "border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-black/50" 
              : "border-transparent bg-transparent"
            }
          `}
        >
          {/* Mouse follow gradient */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-500"
            style={{
              background: mouseFollowBg,
              opacity: isScrolled ? 1 : 0,
            }}
          />

          {/* Border glow effect */}
          <motion.div
            className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
            style={{
              background: borderGlowBg,
              opacity: isScrolled ? 1 : 0,
            }}
          />

          <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            {/* Logo */}
            <motion.div
              ref={logoMagnetic.ref}
              onMouseMove={logoMagnetic.handleMouseMove}
              onMouseLeave={logoMagnetic.handleMouseLeave}
              style={{ x: logoMagnetic.springX, y: logoMagnetic.springY }}
            >
              <motion.a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("#home")
                }}
                className="group relative flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated cricket ball logo */}
                <div className="relative">
                  <motion.div
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Seam lines */}
                    <div className="absolute inset-1 rounded-full border border-white/10">
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40 -translate-y-1/2 transform rotate-12" />
                    </div>
                  </motion.div>
                  {/* Glow */}
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-primary/20 blur-xl"
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-black tracking-tight text-foreground">
                    JAI
                    <span className="text-primary ml-0.5">VIGNESH</span>
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase font-medium">
                    Cricketer
                  </span>
                </div>

                {/* Hover underline */}
                <motion.div
                  className="absolute -bottom-1 left-12 right-0 h-px bg-gradient-to-r from-primary to-transparent"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="relative flex items-center bg-white/[0.02] rounded-xl p-1 border border-white/5">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.substring(1)
                  const isHovered = hoveredItem === item.name

                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(item.href)
                      }}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative px-4 py-2 text-sm font-medium transition-colors z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      whileHover={{ y: -1 }}
                    >
                      {/* Active pill background */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-white/5 rounded-lg border border-white/10 z-0"
                          layoutId="activeNavPill"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      {/* Hover gradient */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Text */}
                      <span
                        className={`relative z-10 transition-colors duration-300 ${
                          isActive 
                            ? "text-primary" 
                            : isHovered 
                              ? "text-foreground" 
                              : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* Active dot */}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          layoutId="activeNavDot"
                          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        />
                      )}
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* CTA Button (Desktop) */}
            <motion.div
              ref={ctaMagnetic.ref}
              onMouseMove={ctaMagnetic.handleMouseMove}
              onMouseLeave={ctaMagnetic.handleMouseLeave}
              style={{ x: ctaMagnetic.springX, y: ctaMagnetic.springY }}
              className="hidden lg:block"
            >
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick("#contact")
                }}
                className="group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-400 to-primary bg-[length:200%_100%] animate-gradient-x" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                </div>

                {/* Glow */}
                <div className="absolute -inset-1 bg-primary/40 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                <span className="relative z-10 text-primary-foreground">Connect</span>
                <motion.svg 
                  className="relative z-10 w-4 h-4 text-primary-foreground"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <motion.span
                  className="block h-0.5 bg-foreground rounded-full origin-left"
                  animate={isMobileMenuOpen 
                    ? { rotate: 45, y: -1, width: "141%" } 
                    : { rotate: 0, y: 0, width: "100%" }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="block h-0.5 bg-foreground rounded-full"
                  animate={isMobileMenuOpen 
                    ? { opacity: 0, x: -20 } 
                    : { opacity: 1, x: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-0.5 bg-foreground rounded-full origin-left"
                  animate={isMobileMenuOpen 
                    ? { rotate: -45, y: 1, width: "141%" } 
                    : { rotate: 0, y: 0, width: "100%" }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-black via-background to-black border-l border-white/5 lg:hidden overflow-hidden"
            >
              {/* Background effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
              </div>

              {/* Close button */}
              <div className="flex justify-between items-center p-6">
                <motion.span 
                  className="text-xs text-muted-foreground font-mono tracking-widest"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  NAVIGATION
                </motion.span>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Menu Items */}
              <nav className="px-6 py-8 relative z-10">
                <ul className="space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.href.substring(1)

                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavClick(item.href)
                          }}
                          className={`
                            group flex items-center gap-4 px-4 py-5 rounded-xl transition-all duration-300
                            ${isActive 
                              ? "bg-primary/10 border border-primary/20" 
                              : "hover:bg-white/5"
                            }
                          `}
                        >
                          {/* Number */}
                          <motion.span 
                            className={`text-sm font-mono tabular-nums ${isActive ? "text-primary" : "text-muted-foreground/50"}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            0{index + 1}
                          </motion.span>

                          {/* Divider */}
                          <div className={`h-8 w-px ${isActive ? "bg-primary/30" : "bg-white/5"}`} />

                          {/* Name */}
                          <span
                            className={`text-2xl font-bold tracking-tight transition-all duration-300 ${
                              isActive ? "text-primary translate-x-2" : "text-foreground group-hover:text-accent group-hover:translate-x-2"
                            }`}
                          >
                            {item.name}
                          </span>

                          {/* Arrow */}
                          <motion.svg
                            className={`ml-auto w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground/30 group-hover:text-accent"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            initial={{ x: 0, opacity: 0 }}
                            whileHover={{ x: 5, opacity: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </motion.svg>
                        </a>
                      </motion.li>
                    )
                  })}
                </ul>

                {/* CTA Button (Mobile) */}
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick("#contact")
                  }}
                  className="mt-8 flex items-center justify-center gap-3 w-full py-5 rounded-xl bg-gradient-to-r from-primary to-green-400 text-primary-foreground font-bold text-lg relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative z-10">Get in Touch</span>
                  <svg className="relative z-10 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>

                {/* Footer */}
                <motion.div 
                  className="mt-16 pt-8 border-t border-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">Follow</p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { name: "Instagram", icon: "IG", href: "https://www.instagram.com/jai_vignesh_80?igsh=MWp2eTdpdGI4M29ndA==" },
                      { name: "X", icon: "X", href: "https://x.com/vjai5894?s=11" },
                      { name: "Email", icon: "✉", href: "mailto:vjai5894@gmail.com" },
                    ].map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[60px] py-3 rounded-lg bg-white/5 border border-white/5 text-center text-sm font-mono text-muted-foreground hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>

                  {/* Copyright */}
                  <p className="mt-8 text-xs text-muted-foreground/30 text-center font-mono">
                    2024 Jai Vignesh. All rights reserved.
                  </p>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

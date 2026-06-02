"use client"

import { useRef, useState, useEffect, Suspense, useMemo, useCallback } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  Float, 
  Sphere, 
  Trail, 
  Environment,
  Sparkles,
  Stars
} from "@react-three/drei"
import * as THREE from "three"

// Optimized Cricket Ball - simplified for performance
function CricketBall({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const targetPos = useRef({ x: 0, y: 0 })
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    
    // Smooth lerp for position (reduced intensity)
    targetPos.current.x = THREE.MathUtils.lerp(
      targetPos.current.x,
      mousePosition.current.x * viewport.width * 0.15 + 2.5,
      delta * 2
    )
    targetPos.current.y = THREE.MathUtils.lerp(
      targetPos.current.y,
      mousePosition.current.y * viewport.height * 0.15,
      delta * 2
    )
    
    groupRef.current.position.x = targetPos.current.x
    groupRef.current.position.y = targetPos.current.y
    
    // Smooth rotation
    groupRef.current.rotation.x = t * 0.2
    groupRef.current.rotation.y = t * 0.3
  })

  return (
    <Trail
      width={3}
      length={10}
      color={new THREE.Color("#22c55e")}
      attenuation={(t) => t * t}
    >
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={groupRef} scale={0.9}>
          <mesh castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhysicalMaterial
              color="#8B0000"
              roughness={0.3}
              metalness={0.05}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
              emissive="#3d0000"
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Primary seam */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.005, 0.02, 12, 48]} />
            <meshStandardMaterial color="#f5f5dc" roughness={0.7} />
          </mesh>
          
          {/* Simplified glow ring */}
          <mesh scale={1.3}>
            <ringGeometry args={[0.95, 1.05, 32]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>
    </Trail>
  )
}

// Simplified organic blob with basic distort
function OrganicBlob({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <Sphere ref={meshRef} args={[2, 32, 32]} position={position}>
        <meshPhysicalMaterial
          color="#0a4a0a"
          roughness={0.4}
          metalness={0.1}
          emissive="#22c55e"
          emissiveIntensity={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  )
}

// Simplified Energy Rings
function EnergyRings() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[2.5, 0, 0]}>
      <mesh>
        <torusGeometry args={[2.5, 0.02, 12, 48]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 12, 48]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// Floating geometric shapes - reduced count
function FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 5
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.25,
      speed: 0.3 + Math.random() * 0.5,
      type: i % 3
    }))
  }, [])

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={shape.position} scale={shape.scale}>
            {shape.type === 0 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <dodecahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#22c55e" : "#eab308"}
              emissive={i % 2 === 0 ? "#22c55e" : "#eab308"}
              emissiveIntensity={0.2}
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// Optimized Scene
function Scene({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  const cameraTarget = useRef({ x: 0, y: 0 })
  
  useFrame((_, delta) => {
    cameraTarget.current.x = THREE.MathUtils.lerp(cameraTarget.current.x, mousePosition.current.x * 0.8, delta * 1.5)
    cameraTarget.current.y = THREE.MathUtils.lerp(cameraTarget.current.y, mousePosition.current.y * 0.5, delta * 1.5)
    camera.position.x = cameraTarget.current.x
    camera.position.y = cameraTarget.current.y
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Environment preset="night" />
      <fog attach="fog" args={["#050505", 10, 30]} />
      
      {/* Optimized Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#eab308" />
      <spotLight position={[5, 15, 5]} angle={0.3} penumbra={1} intensity={3} color="#22c55e" />
      
      {/* Reduced particle count stars */}
      <Stars radius={80} depth={40} count={1000} factor={3} saturation={0} fade speed={0.5} />
      
      {/* 3D Elements */}
      <CricketBall mousePosition={mousePosition} />
      <OrganicBlob position={[-4, -1, -4]} />
      <EnergyRings />
      <FloatingShapes />
      
      {/* Reduced sparkles */}
      <Sparkles count={80} scale={15} size={2} speed={0.2} color="#22c55e" opacity={0.4} />
      <Sparkles count={40} scale={12} size={1.5} speed={0.15} color="#eab308" opacity={0.25} />
      
      {/* Simplified Post Processing */}
      
    </>
  )
}

// Magnetic Button Component
function MagneticButton({ children, className, href }: { 
  children: React.ReactNode
  className?: string
  href?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 300 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <motion.a
        href={href}
        className={className}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.a>
    </motion.div>
  )
}

// Text Scramble Effect - optimized
function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " "
              if (index < iteration) return text[index]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )
        if (iteration >= text.length) {
          clearInterval(interval)
        }
        iteration += 0.5
      }, 40)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return <span className={className}>{displayText || text.replace(/./g, " ")}</span>
}

// Animated Counter - optimized with RAF
function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = performance.now()
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
            setCount(Math.floor(eased * value))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>
}

// Split Text Animation - simplified
function SplitTextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  )
}

// Glitch Text Effect - simplified
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 text-primary/50"
        style={{ transform: "translate(-2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 text-accent/50"
        style={{ transform: "translate(2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
    </div>
  )
}

// Main Hero Component
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 500 })
  const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 500 })

  // Loading animation - faster
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoaded(true), 100)
          return 100
        }
        return prev + 10
      })
    }, 15)
    return () => clearInterval(interval)
  }, [])

  // Throttled mouse move handler
  useEffect(() => {
    let ticking = false
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { clientX, clientY } = e
          const { innerWidth, innerHeight } = window
          
          mousePositionRef.current = {
            x: (clientX / innerWidth) * 2 - 1,
            y: -(clientY / innerHeight) * 2 + 1,
          }
          
          cursorX.set(clientX)
          cursorY.set(clientY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cursorX, cursorY])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background" id="home">
      {/* Custom Cursor - only on desktop */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden lg:flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white flex items-center justify-center"
          animate={{
            width: 12,
            height: 12,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
        >

        </motion.div>
      </motion.div>

      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 bg-background z-[200] flex flex-col items-center justify-center"
            exit={{ 
              clipPath: "circle(0% at 50% 50%)",
              transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
            }}
          >
            <motion.div
              className="text-6xl md:text-8xl font-black text-primary mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              JV
            </motion.div>
            
            <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            <motion.p
              className="mt-4 text-sm text-muted-foreground font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {loadingProgress}%
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas - optimized settings */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 45 }}
          gl={{ 
            antialias: false,
            alpha: true, 
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          dpr={[1, 1.5]}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Scene mousePosition={mousePositionRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-[1] pointer-events-none" />
      
      {/* Noise texture - simplified */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-24">
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl w-full">
            {/* Pre-title Badge */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="text-xs md:text-sm tracking-[0.3em] text-primary uppercase font-semibold">
                  Student Athlete
                </span>
              </div>
            </motion.div>

            {/* Main Name */}
            <div 
              className="relative mb-6"
            >
              {/* Background stroke text */}
              <motion.div
                className="absolute inset-0 select-none pointer-events-none"
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 0.08 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <span 
                  className="text-[18vw] md:text-[14vw] lg:text-[12vw] font-black leading-[0.85] tracking-tighter"
                  style={{
                    WebkitTextStroke: "1px rgba(34, 197, 94, 0.3)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  JAI<br/>VIGNESH
                </span>
              </motion.div>

              {/* Main text */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={isLoaded ? { y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-[18vw] md:text-[14vw] lg:text-[12vw] font-black leading-[0.85] tracking-tighter">
                    <GlitchText text="JAI" className="text-foreground block" />
                  </h1>
                </motion.div>
              </div>
              
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={isLoaded ? { y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-[18vw] md:text-[14vw] lg:text-[12vw] font-black leading-[0.85] tracking-tighter text-primary text-glow-green">
                    <ScrambleText text="VIGNESH" delay={1} />
                  </h1>
                </motion.div>
              </div>
            </div>

            {/* Subtitle */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground">
                <SplitTextReveal text="Student." className="mr-2" delay={0.9} />
                <SplitTextReveal text="Cricketer." className="mr-2 text-primary" delay={1.1} />
                <SplitTextReveal text="Dream Chaser." className="text-accent text-glow-gold" delay={1.3} />
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap gap-8 md:gap-12 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {[
                { value: 5, suffix: "+", label: "Years Playing" },
                { value: 150, suffix: "+", label: "Matches" },
                { value: 3000, suffix: "+", label: "Runs Scored" },
                { value: 50, suffix: "+", label: "Wickets" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5 + i * 0.2} />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                  <div className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <MagneticButton
                href="#contact"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-green-400 to-primary bg-[length:200%_100%] animate-gradient-x" />
                <span className="relative z-10 text-sm font-bold text-primary-foreground tracking-wide uppercase">
                  Get in Touch
                </span>
                <motion.svg 
                  className="relative z-10 w-4 h-4 text-primary-foreground"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </MagneticButton>

              <MagneticButton
                href="#journey"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
              >
                <span className="text-sm font-bold text-accent tracking-wide uppercase">
                  My Journey
                </span>
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        {/* Bottom Elements */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-6 md:px-12 lg:px-24"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
        >
          {/* Left - Year */}
          <div className="hidden md:block">
            <div className="text-xs text-muted-foreground font-mono tracking-widest">
              <span className="text-primary">EST.</span> 2024
            </div>
          </div>

          {/* Center - Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-3 bg-primary"
                animate={{ y: [0, 40, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          {/* Right - Social */}
          <div className="hidden md:flex items-center gap-6">
            {["IG", "TW", "YT"].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono tracking-wider"
                whileHover={{ y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

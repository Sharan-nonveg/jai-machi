"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Environment, Sparkles, Stars } from "@react-three/drei"
import * as THREE from "three"

// Journey data - Updated with all education details
const journeyData = [
  { 
    year: "2005", 
    title: "ORIGIN", 
    location: "Vellore, Tamil Nadu",
    description: "The journey begins. Born with destiny written in the stars, in the ancient city known for its temples and heritage.",
    type: "milestone",
    icon: "birth",
    color: "#22c55e"
  },
  { 
    year: "2008", 
    title: "NEW HORIZON", 
    location: "Bengaluru, Karnataka",
    description: "Moved to the Silicon Valley of India. A new chapter unfolds in the city that would shape dreams.",
    type: "milestone",
    icon: "location",
    color: "#eab308"
  },
  { 
    year: "2010", 
    title: "STARTING STEPS", 
    location: "Bettal School",
    description: "The foundation years. Where curiosity met learning, and a young mind began to bloom.",
    type: "education",
    icon: "school",
    color: "#22c55e"
  },
  { 
    year: "2013", 
    title: "GROWTH", 
    location: "Sri Mithri English School",
    description: "Building character, forging friendships. The playground became the first battlefield of dreams.",
    type: "education",
    icon: "school",
    color: "#eab308"
  },
  { 
    year: "2016", 
    title: "RISING STAR", 
    location: "New Baldwin International School Mandur",
    description: "Where passion met opportunity. The corridors echoed with ambition and the fields witnessed dedication.",
    type: "education",
    icon: "school",
    color: "#22c55e"
  },
  { 
    year: "2017", 
    title: "THE SELECTION", 
    location: "School Cricket Team",
    description: "6th standard. First major milestone. Selected for the school cricket team. The dream takes tangible shape.",
    type: "achievement",
    icon: "trophy",
    color: "#eab308"
  },
  { 
    year: "2022", 
    title: "ENGINEERING", 
    location: "PSG College of Technology",
    description: "Electrical & Electronics Engineering. Where science meets sport. Merging intellect with athletic prowess.",
    type: "education",
    icon: "university",
    color: "#22c55e"
  },
  { 
    year: "2024", 
    title: "CURRENT ERA", 
    location: "Garden City University",
    description: "BBAB Degree. The present chapter in the Garden City. Still writing the story, still chasing excellence.",
    type: "education",
    icon: "university",
    color: "#eab308"
  },
]

// Icon components
function JourneyIcon({ type, color }: { type: string; color: string }) {
  const iconProps = { className: "w-5 h-5 md:w-6 md:h-6", fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: 1.5 }
  
  switch (type) {
    case 'birth':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )
    case 'location':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    case 'school':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
        </svg>
      )
    case 'university':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
  }
}

// Orbital Ring Component
function OrbitalRing({ radius, speed, color, thickness = 0.02 }: { radius: number; speed: number; color: string; thickness?: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * speed
      ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Cricket Ball Component
function CricketBall({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ballRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.x = state.clock.elapsedTime * 0.3
      ballRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={ballRef} position={position} scale={scale}>
        {/* Main ball */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#dc2626" 
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* Seam - horizontal ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.51, 0.03, 8, 32]} />
          <meshStandardMaterial color="#f5f5dc" emissive="#f5f5dc" emissiveIntensity={0.3} />
        </mesh>
        {/* Cross stitches on seam */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i / 12) * Math.PI * 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Cricket Stumps Component
function CricketStumps({ position }: { position: [number, number, number] }) {
  const stumpsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (stumpsRef.current) {
      stumpsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={stumpsRef} position={position}>
        {/* Three stumps */}
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.5, 16]} />
            <meshStandardMaterial 
              color="#d4a574" 
              emissive="#eab308"
              emissiveIntensity={0.1}
              roughness={0.6}
            />
          </mesh>
        ))}
        {/* Bails */}
        {[-0.15, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
            <meshStandardMaterial 
              color="#eab308" 
              emissive="#eab308"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Cricket Bat Component
function CricketBat({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const batRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (batRef.current) {
      batRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + rotation[1]
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={batRef} position={position} rotation={rotation}>
        {/* Bat blade */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.5]} />
          <meshStandardMaterial 
            color="#d4a574" 
            roughness={0.4}
            emissive="#eab308"
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* Bat handle */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.8, 16]} />
          <meshStandardMaterial 
            color="#8b4513" 
            roughness={0.5}
          />
        </mesh>
        {/* Handle grip */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.6, 16]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#22c55e"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Floating Cricket Elements - replaces generic geometrics
function FloatingCricketElements() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cricket balls scattered around */}
      <CricketBall position={[-12, 3, -10]} scale={0.8} />
      <CricketBall position={[10, -2, -8]} scale={0.6} />
      <CricketBall position={[-8, -5, -12]} scale={0.7} />
      <CricketBall position={[15, 5, -15]} scale={0.5} />
      <CricketBall position={[-5, 8, -8]} scale={0.9} />
      
      {/* Cricket stumps */}
      <CricketStumps position={[8, -3, -10]} />
      <CricketStumps position={[-10, 5, -12]} />
      
      {/* Cricket bats */}
      <CricketBat position={[-6, 2, -6]} rotation={[0.3, 0.5, 0.2]} />
      <CricketBat position={[12, -4, -8]} rotation={[-0.2, -0.8, 0.1]} />
      <CricketBat position={[5, 6, -10]} rotation={[0.4, 0.2, -0.3]} />
    </group>
  )
}

// Main 3D Scene
function AboutScene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 2
    camera.position.y = scrollProgress * -5
    camera.lookAt(0, scrollProgress * -5, 0)
  })

  return (
    <>
      <fog attach="fog" args={["#030303", 20, 60]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#eab308" />
      <spotLight position={[0, 20, 0]} intensity={1} color="#ffffff" angle={0.3} penumbra={1} />
      
      <Stars radius={150} depth={80} count={1500} factor={4} saturation={0} fade speed={0.2} />
      <FloatingCricketElements />
      
      {/* Central cricket ball with orbital rings */}
      <group position={[-6, 0, -3]}>
        <OrbitalRing radius={3} speed={0.2} color="#22c55e" />
        <OrbitalRing radius={2.5} speed={-0.3} color="#eab308" thickness={0.015} />
        <OrbitalRing radius={2} speed={0.4} color="#22c55e" thickness={0.01} />
        {/* Central glowing cricket ball */}
        <CricketBall position={[0, 0, 0]} scale={1.2} />
      </group>
      
      <Sparkles count={100} scale={40} size={2} speed={0.1} color="#22c55e" opacity={0.4} />
      <Sparkles count={50} scale={30} size={1.5} speed={0.08} color="#eab308" opacity={0.3} />
      
      
    </>
  )
}

// Timeline Card Component
function TimelineCard({ item, index, isVisible }: { item: typeof journeyData[0]; index: number; isVisible: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const isLeft = index % 2 === 0
  
  return (
    <motion.div
      className={`relative flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -100 : 100 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Card */}
      <motion.div
        className={`relative w-full md:w-[45%] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="relative overflow-hidden rounded-2xl md:rounded-3xl"
          animate={{
            scale: isHovered ? 1.02 : 1,
            y: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.4 }}
          style={{ 
            background: `linear-gradient(135deg, rgba(15,15,15,0.9), rgba(10,10,10,0.95))`,
          }}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 backdrop-blur-xl" />
          
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${item.color}30, transparent, ${item.color}15)`,
              padding: '1px',
            }}
            animate={{
              background: isHovered 
                ? `linear-gradient(135deg, ${item.color}60, transparent, ${item.color}40)`
                : `linear-gradient(135deg, ${item.color}30, transparent, ${item.color}15)`,
            }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-3xl blur-xl pointer-events-none"
            style={{ backgroundColor: item.color }}
            animate={{ opacity: isHovered ? 0.15 : 0.05 }}
          />
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <motion.div
              className="absolute top-3 left-3 w-8 h-[2px]"
              style={{ backgroundColor: item.color }}
              animate={{ scaleX: isHovered ? 1.5 : 1 }}
            />
            <motion.div
              className="absolute top-3 left-3 w-[2px] h-8"
              style={{ backgroundColor: item.color }}
              animate={{ scaleY: isHovered ? 1.5 : 1 }}
            />
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <motion.div
              className="absolute bottom-3 right-3 w-8 h-[2px]"
              style={{ backgroundColor: item.color }}
              animate={{ scaleX: isHovered ? 1.5 : 1 }}
            />
            <motion.div
              className="absolute bottom-3 right-3 w-[2px] h-8"
              style={{ backgroundColor: item.color }}
              animate={{ scaleY: isHovered ? 1.5 : 1 }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 md:p-8">
            {/* Type badge */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  border: `1px solid ${item.color}30`
                }}
              >
                <JourneyIcon type={item.icon} color={item.color} />
                <span>{item.type}</span>
              </div>
              <motion.span 
                className="text-3xl md:text-4xl font-black opacity-20"
                style={{ color: item.color }}
                animate={{ opacity: isHovered ? 0.4 : 0.2 }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>
            </div>
            
            {/* Year */}
            <motion.div
              className="text-4xl md:text-5xl font-black mb-2"
              style={{ 
                color: item.color,
                textShadow: `0 0 30px ${item.color}40`
              }}
              animate={{ 
                textShadow: isHovered ? `0 0 40px ${item.color}60` : `0 0 30px ${item.color}40`
              }}
            >
              {item.year}
            </motion.div>
            
            {/* Title */}
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-foreground mb-3"
              animate={{ x: isHovered ? 10 : 0 }}
            >
              {item.title}
            </motion.h3>
            
            {/* Location */}
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={item.color} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium" style={{ color: item.color }}>
                {item.location}
              </span>
            </div>
            
            {/* Description */}
            <motion.p
              className="text-sm md:text-base text-muted-foreground leading-relaxed"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              {item.description}
            </motion.p>
            
            {/* Progress line */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-[2px] bg-border/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: isVisible ? "100%" : "0%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: item.color,
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Timeline Node (center) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-20">
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute w-16 h-16 rounded-full"
            style={{ 
              background: `radial-gradient(circle, ${item.color}30, transparent)`,
            }}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : 1,
              opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3,
            }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
          
          {/* Main node */}
          <motion.div
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: '#0a0a0a',
              border: `2px solid ${item.color}`,
              boxShadow: `0 0 20px ${item.color}40, inset 0 0 15px ${item.color}20`
            }}
            animate={{
              boxShadow: isHovered 
                ? `0 0 30px ${item.color}60, inset 0 0 20px ${item.color}30`
                : `0 0 20px ${item.color}40, inset 0 0 15px ${item.color}20`
            }}
          >
            <JourneyIcon type={item.icon} color={item.color} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Vertical Timeline Line
function TimelineLine({ progress }: { progress: number }) {
  return (
    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]">
      {/* Background line */}
      <div className="absolute inset-0 bg-border/20" />
      
      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-accent to-primary"
        style={{ 
          height: `${progress * 100}%`,
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
        }}
      />
      
      {/* Glowing dot at the end */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
        style={{ 
          top: `${progress * 100}%`,
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.4)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}

// Section Header Component
function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div 
      className="text-center mb-16 md:mb-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Pre-title */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-12 md:w-20 h-[2px] bg-gradient-to-r from-transparent to-primary"
          animate={{ scaleX: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <span className="text-xs md:text-sm tracking-[0.3em] text-primary uppercase font-semibold">
          The Journey
        </span>
        <motion.div
          className="w-12 md:w-20 h-[2px] bg-gradient-to-l from-transparent to-primary"
          animate={{ scaleX: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Main title */}
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-4">
        <span className="block">MY</span>
        <span 
          className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
          style={{ 
            textShadow: '0 0 60px rgba(34, 197, 94, 0.3)',
          }}
        >
          STORY
        </span>
      </h2>
      
      {/* Subtitle */}
      <motion.p
        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        From the ancient streets of Vellore to the bustling fields of Bengaluru.
        <br className="hidden md:block" />
        A chronicle of passion, persistence, and the pursuit of cricketing excellence.
      </motion.p>
    </motion.div>
  )
}

// Stats Component
function JourneyStats({ isVisible }: { isVisible: boolean }) {
  const stats = [
    { value: "19+", label: "Years of Journey", color: "#22c55e" },
    { value: "5", label: "Schools Attended", color: "#eab308" },
    { value: "2017", label: "First Selection", color: "#22c55e" },
    { value: "3", label: "Cities Lived", color: "#eab308" },
  ]
  
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="relative p-4 md:p-6 rounded-2xl overflow-hidden group"
          style={{ 
            background: `linear-gradient(135deg, rgba(15,15,15,0.8), rgba(10,10,10,0.9))`,
            border: `1px solid ${stat.color}20`
          }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
              background: `radial-gradient(circle at center, ${stat.color}15, transparent 70%)`
            }}
          />
          
          <div className="relative z-10 text-center">
            <motion.div
              className="text-3xl md:text-5xl font-black mb-2"
              style={{ color: stat.color }}
            >
              {stat.value}
            </motion.div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Main About Section Component
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const isInView = useInView(containerRef, { once: false, margin: "-10%" })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })
  
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest)
    })
    return () => unsubscribe()
  }, [smoothProgress])

  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative bg-background py-16 md:py-24"
    >
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 50 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <AboutScene scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 z-[1] pointer-events-none" />
      
      {/* Noise texture */}
      <div 
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <SectionHeader isVisible={isInView} />
        
        {/* Journey Stats */}
        <JourneyStats isVisible={isInView} />
        
        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <TimelineLine progress={scrollProgress} />
          
          {/* Timeline Cards */}
          <div className="space-y-8 md:space-y-16">
            {journeyData.map((item, index) => (
              <TimelineCard
                key={item.year}
                item={item}
                index={index}
                isVisible={isInView}
              />
            ))}
          </div>
        </div>
        
        {/* End Card */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex flex-col items-center gap-6 p-8 md:p-12 rounded-3xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15,15,15,0.8), rgba(10,10,10,0.9))',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="text-xs md:text-sm tracking-[0.5em] text-primary uppercase">To Be Continued</div>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground">
              THE STORY
              <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                style={{ textShadow: '0 0 40px rgba(34, 197, 94, 0.3)' }}
              >
                CONTINUES...
              </span>
            </h3>
            <motion.div
              className="flex items-center gap-2 text-muted-foreground mt-4"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm">More chapters await</span>
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

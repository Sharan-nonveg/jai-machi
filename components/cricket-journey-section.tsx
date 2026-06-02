"use client"

import { useRef, useState, Suspense, useMemo } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Sparkles, Stars, Trail } from "@react-three/drei"
import * as THREE from "three"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  Annotation
} from "react-simple-maps"

// India TopoJSON URL
const INDIA_TOPO_JSON = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Academy data
const currentAssociations = [
  {
    name: "Karnataka State Cricket Association",
    shortName: "KSCA",
    description: "Official state cricket governing body. Training under elite coaching programs and competing in state-level tournaments.",
    type: "current",
    icon: "trophy",
    year: "Present",
    achievements: ["State Level Tournaments", "Elite Coaching", "Professional Training"]
  },
  {
    name: "KIOC Cricket Academy",
    shortName: "KIOC",
    description: "Premier cricket academy known for producing quality cricketers with world-class facilities and coaching.",
    type: "current",
    icon: "academy",
    year: "Present",
    achievements: ["World-Class Facilities", "Technical Excellence", "Match Exposure"]
  },
  {
    name: "MBCA",
    shortName: "MBCA",
    description: "Dedicated cricket association focusing on nurturing talent and providing competitive match exposure.",
    type: "current",
    icon: "cricket",
    year: "Present",
    achievements: ["Talent Development", "Competition Focus", "Team Building"]
  }
]

const previousAssociations = [
  {
    name: "Neon Cricket Academy",
    shortName: "Neon",
    description: "Foundation years of professional training. Building technical skills and match temperament.",
    type: "previous",
    icon: "academy",
    year: "2019-2021",
    achievements: ["Skill Foundation", "Basic Techniques", "Cricket Fundamentals"]
  },
  {
    name: "Vision Cricket Academy",
    shortName: "Vision",
    description: "Enhanced training programs focusing on advanced techniques and competitive mindset.",
    type: "previous",
    icon: "academy",
    year: "2021-2022",
    achievements: ["Advanced Training", "Mental Conditioning", "Competition Prep"]
  },
  {
    name: "Jharkhand Cricket Circuits",
    shortName: "Jharkhand",
    description: "Exposure to different playing conditions and competitive cricket circuits across India.",
    type: "previous",
    icon: "location",
    year: "2022",
    achievements: ["Multi-State Exposure", "Adaptability", "Match Experience"]
  }
]

// City locations for the map with real coordinates
const cities = [
  { name: "Bengaluru", coordinates: [77.5946, 12.9716] as [number, number], isHome: true, state: "Karnataka" },
  { name: "Goa", coordinates: [74.1240, 15.2993] as [number, number], isHome: false, state: "Goa" },
  { name: "Delhi", coordinates: [77.1025, 28.7041] as [number, number], isHome: false, state: "Delhi" },
  { name: "Kochi", coordinates: [76.2673, 9.9312] as [number, number], isHome: false, state: "Kerala" },
  { name: "Ranchi", coordinates: [85.3096, 23.3441] as [number, number], isHome: false, state: "Jharkhand" },
  { name: "Coimbatore", coordinates: [76.9558, 11.0168] as [number, number], isHome: false, state: "Tamil Nadu" },
]

// Expanded Experience timeline data with more points
const experienceTimeline = [
  { year: "2005", event: "Born in Vellore", type: "birth", description: "The journey begins in Tamil Nadu" },
  { year: "2008", event: "Moved to Bengaluru", type: "milestone", description: "New chapter in Karnataka" },
  { year: "2015", event: "First Cricket Bat", type: "milestone", description: "The dream takes shape" },
  { year: "2017", event: "School Cricket Selection", type: "milestone", description: "Selected for school team in 6th standard" },
  { year: "2018", event: "First Century", type: "achievement", description: "Scored first 100 runs in school match" },
  { year: "2019", event: "Neon Cricket Academy", type: "academy", description: "Professional training begins" },
  { year: "2020", event: "Inter-School Champion", type: "tournament", description: "Won inter-school tournament" },
  { year: "2020", event: "District Selection", type: "milestone", description: "Selected for district trials" },
  { year: "2021", event: "Vision Cricket Academy", type: "academy", description: "Advanced training phase" },
  { year: "2021", event: "All-Rounder Award", type: "achievement", description: "Best all-rounder in academy" },
  { year: "2022", event: "Jharkhand Circuit", type: "exposure", description: "Multi-state tournament exposure" },
  { year: "2022", event: "200+ Match Wickets", type: "achievement", description: "Career wicket milestone" },
  { year: "2023", event: "KSCA Registration", type: "milestone", description: "Official state cricket body member" },
  { year: "2023", event: "State Camp Selection", type: "milestone", description: "Selected for state cricket camp" },
  { year: "2024", event: "KIOC & MBCA Active", type: "current", description: "Training with premier academies" },
  { year: "2024", event: "500+ Career Runs", type: "achievement", description: "Batting milestone achieved" },
]

// 3D Cricket Ball with Trail
function CricketBallWithTrail({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ballRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ballRef.current) {
      const t = state.clock.elapsedTime
      ballRef.current.position.x = position[0] + Math.sin(t * 0.5) * 3
      ballRef.current.position.y = position[1] + Math.cos(t * 0.3) * 2
      ballRef.current.rotation.x = t * 0.8
      ballRef.current.rotation.z = t * 0.5
    }
  })

  return (
    <group>
      <Trail
        width={1}
        length={8}
        color="#22c55e"
        attenuation={(width) => width * width}
      >
        <group ref={ballRef} scale={scale}>
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial 
              color="#dc2626" 
              roughness={0.3}
              metalness={0.2}
              emissive="#dc2626"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.41, 0.025, 8, 32]} />
            <meshStandardMaterial color="#f5f5dc" emissive="#f5f5dc" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </Trail>
    </group>
  )
}

// 3D Stadium Lights
function StadiumLights() {
  const lightsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (lightsRef.current) {
      lightsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.PointLight) {
          const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3
          child.intensity = intensity * 3
        }
      })
    }
  })

  return (
    <group ref={lightsRef}>
      {[[-15, 12, -10], [15, 12, -10], [-15, 12, 10], [15, 12, 10]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={[0.5, 8, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <boxGeometry args={[2, 0.8, 1.5]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff"
              emissiveIntensity={1}
            />
          </mesh>
          <pointLight 
            position={[0, 3, 0]} 
            intensity={2} 
            color={i % 2 === 0 ? "#22c55e" : "#eab308"} 
            distance={30}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}

// 3D Cricket Pitch
function CricketPitch() {
  const pitchRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (pitchRef.current) {
      pitchRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={pitchRef} position={[0, -5, -15]} rotation={[-0.3, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 22]} />
          <meshStandardMaterial 
            color="#c4a35a" 
            roughness={0.8}
            emissive="#eab308"
            emissiveIntensity={0.1}
          />
        </mesh>
        {[-9, 9].map((z, i) => (
          <group key={i} position={[0, 0.01, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.5, 0.1]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
        {[-9, 9].map((z, i) => (
          <group key={`stumps-${i}`} position={[0, 0, z]}>
            {[-0.15, 0, 0.15].map((x, j) => (
              <mesh key={j} position={[x, 0.6, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
                <meshStandardMaterial 
                  color="#d4a574" 
                  emissive="#eab308"
                  emissiveIntensity={0.2}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Float>
  )
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3)
    const colors = new Float32Array(500 * 3)
    
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      
      const isGreen = Math.random() > 0.5
      colors[i * 3] = isGreen ? 0.13 : 0.92
      colors[i * 3 + 1] = isGreen ? 0.77 : 0.70
      colors[i * 3 + 2] = isGreen ? 0.27 : 0.03
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={500}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Glowing Rings
function GlowingRings() {
  const ringsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.x = state.clock.elapsedTime * 0.1
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group ref={ringsRef} position={[10, 0, -8]}>
      {[4, 5, 6].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.3]}>
          <torusGeometry args={[radius, 0.03, 16, 100]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#22c55e" : "#eab308"}
            emissive={i % 2 === 0 ? "#22c55e" : "#eab308"}
            emissiveIntensity={0.8}
            transparent
            opacity={0.6 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function JourneyScene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 3
    camera.position.y = scrollProgress * -3 + Math.cos(state.clock.elapsedTime * 0.05) * 0.5
    camera.lookAt(0, scrollProgress * -2, -5)
  })

  return (
    <>
      <fog attach="fog" args={["#030303", 15, 50]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#eab308" />
      <spotLight position={[0, 20, 0]} intensity={1.5} color="#ffffff" angle={0.4} penumbra={1} />
      
      <Stars radius={100} depth={60} count={2000} factor={5} saturation={0} fade speed={0.3} />
      
      <StadiumLights />
      <CricketPitch />
      <CricketBallWithTrail position={[-8, 3, -5]} scale={1.2} />
      <CricketBallWithTrail position={[8, -2, -8]} scale={0.8} />
      <ParticleField />
      <GlowingRings />
      
      <Sparkles count={150} scale={50} size={3} speed={0.15} color="#22c55e" opacity={0.5} />
      <Sparkles count={100} scale={40} size={2} speed={0.1} color="#eab308" opacity={0.4} />
      
      
    </>
  )
}

// DNA Helix Style Academy Card - Unique Twisted Layout
function DNAHelixCard({ 
  academy, 
  index, 
  isCurrent,
  totalCards 
}: { 
  academy: typeof currentAssociations[0]
  index: number
  isCurrent: boolean
  totalCards: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  
  const accentColor = isCurrent ? "#22c55e" : "#eab308"
  
  // Calculate rotation and offset for DNA helix effect
  const rotationAngle = (index / totalCards) * 360
  const xOffset = Math.sin((index / totalCards) * Math.PI * 2) * 30
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? -20 : 20 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        perspective: "1000px",
        marginLeft: isLeft ? 0 : "auto",
        marginRight: isLeft ? "auto" : 0,
        width: "85%"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connecting DNA strand line */}
      <motion.div
        className="absolute top-1/2 h-[2px] hidden lg:block"
        style={{
          left: isLeft ? "100%" : "auto",
          right: isLeft ? "auto" : "100%",
          width: "15%",
          background: `linear-gradient(${isLeft ? "to right" : "to left"}, ${accentColor}, transparent)`,
          transformOrigin: isLeft ? "left center" : "right center"
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
      />
      
      {/* DNA Node connector */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full hidden lg:block"
        style={{
          left: isLeft ? "calc(100% + 15%)" : "auto",
          right: isLeft ? "auto" : "calc(100% + 15%)",
          background: accentColor,
          boxShadow: `0 0 20px ${accentColor}`
        }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
      />

      <motion.div
        className="relative overflow-hidden rounded-3xl"
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -10 : 0,
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? (isLeft ? 5 : -5) : 0,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: `linear-gradient(135deg, rgba(15,15,15,0.95), rgba(8,8,8,0.98))`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated gradient border */}
        <div 
          className="absolute inset-0 rounded-3xl p-[1px]"
          style={{
            background: `linear-gradient(${45 + index * 30}deg, ${accentColor}50, transparent 50%, ${accentColor}30)`,
          }}
        />
        
        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 backdrop-blur-2xl rounded-3xl" />
        
        {/* Animated glow orbs */}
        <motion.div
          className="absolute w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ 
            backgroundColor: accentColor,
            top: "-20%",
            left: isLeft ? "-10%" : "auto",
            right: isLeft ? "auto" : "-10%",
          }}
          animate={{ 
            opacity: isHovered ? 0.3 : 0.1,
            scale: isHovered ? 1.5 : 1 
          }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full blur-2xl pointer-events-none"
          style={{ 
            backgroundColor: isCurrent ? "#eab308" : "#22c55e",
            bottom: "-15%",
            right: isLeft ? "-10%" : "auto",
            left: isLeft ? "auto" : "-10%",
          }}
          animate={{ 
            opacity: isHovered ? 0.2 : 0.05,
            scale: isHovered ? 1.3 : 1 
          }}
        />
        
        {/* Hexagonal pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23${accentColor.slice(1)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px"
          }}
        />
        
        {/* Corner accent shapes */}
        <svg className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{ color: accentColor }}>
          <motion.path
            d="M0 24 L0 0 L24 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
          />
        </svg>
        <svg className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rotate-180" style={{ color: accentColor }}>
          <motion.path
            d="M0 24 L0 0 L24 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
          />
        </svg>
        
        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header with status and year */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                    border: `1px solid ${accentColor}40`
                  }}
                >
                  <span className="text-2xl font-black" style={{ color: accentColor }}>
                    {index + 1}
                  </span>
                </div>
                {/* Orbiting dot */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
                  animate={{
                    rotate: 360,
                    x: [14, 14],
                    y: [0, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <div>
                <motion.div
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}40`,
                  }}
                >
                  {isCurrent ? "Active" : "Alumni"}
                </motion.div>
                <span className="text-xs text-muted-foreground mt-1 block">{academy.year}</span>
              </div>
            </div>
            
            {/* Large abbreviated name */}
            <motion.div
              className="text-5xl font-black opacity-20"
              style={{ color: accentColor }}
              animate={{ opacity: isHovered ? 0.4 : 0.2 }}
            >
              {academy.shortName.charAt(0)}
            </motion.div>
          </div>
          
          {/* Short name - prominent display */}
          <motion.div
            className="text-4xl md:text-5xl font-black mb-2"
            style={{ 
              color: accentColor,
              textShadow: `0 0 40px ${accentColor}50`
            }}
            animate={{
              textShadow: isHovered ? `0 0 60px ${accentColor}80, 0 0 100px ${accentColor}40` : `0 0 40px ${accentColor}50`
            }}
          >
            {academy.shortName}
          </motion.div>
          
          {/* Full name */}
          <motion.h3
            className="text-xl font-semibold text-foreground mb-4"
            animate={{ x: isHovered ? 10 : 0 }}
          >
            {academy.name}
          </motion.h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {academy.description}
          </p>
          
          {/* Achievement tags */}
          <div className="flex flex-wrap gap-2">
            {academy.achievements.map((achievement, i) => (
              <motion.span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${accentColor}10`,
                  color: accentColor,
                  border: `1px solid ${accentColor}20`
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.2 + 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: `${accentColor}20` }}
              >
                {achievement}
              </motion.span>
            ))}
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-1 bg-border/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${isCurrent ? "#eab308" : "#22c55e"})` }}
                initial={{ width: "0%" }}
                animate={isInView ? { width: isHovered ? "100%" : "70%" } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: accentColor }}
              animate={{ 
                scale: [1, 1.3, 1],
                boxShadow: [`0 0 0px ${accentColor}`, `0 0 15px ${accentColor}`, `0 0 0px ${accentColor}`]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Real India Map Component using react-simple-maps
function IndiaMapReal() {
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const mapRef = useRef(null)
  const isInView = useInView(mapRef, { once: true, margin: "-100px" })

  // Home city coordinates for drawing lines
  const homeCity = cities.find(c => c.isHome)!

  return (
    <motion.div
      ref={mapRef}
      className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "linear-gradient(135deg, rgba(15,15,15,0.9), rgba(5,5,5,0.95))",
        border: "1px solid rgba(34, 197, 94, 0.2)"
      }}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 20.5937]
        }}
        className="w-full h-full"
        style={{ background: "transparent" }}
      >
        {/* India geography */}
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies
              .filter(geo => geo.properties.name === "India")
              .map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(34, 197, 94, 0.1)"
                  stroke="#22c55e"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(34, 197, 94, 0.15)" },
                    pressed: { outline: "none" }
                  }}
                />
              ))
          }
        </Geographies>

        {/* Connection lines from Bengaluru to other cities */}
        {cities.filter(city => !city.isHome).map((city, i) => (
          <Line
            key={city.name}
            from={homeCity.coordinates}
            to={city.coordinates}
            stroke={hoveredCity === city.name ? "#22c55e" : "#eab308"}
            strokeWidth={hoveredCity === city.name ? 2 : 1}
            strokeDasharray="5,5"
            strokeLinecap="round"
            style={{
              opacity: hoveredCity === city.name ? 1 : 0.5
            }}
          />
        ))}

        {/* City markers */}
        {cities.map((city, i) => (
          <Marker
            key={city.name}
            coordinates={city.coordinates}
            onMouseEnter={() => setHoveredCity(city.name)}
            onMouseLeave={() => setHoveredCity(null)}
            onClick={() => setActiveCity(activeCity === city.name ? null : city.name)}
          >
            {/* Pulse ring */}
            <motion.circle
              r={city.isHome ? 12 : 8}
              fill="none"
              stroke={city.isHome ? "#22c55e" : "#eab308"}
              strokeWidth={0.5}
              animate={{
                r: [city.isHome ? 12 : 8, city.isHome ? 20 : 14],
                opacity: [0.8, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            
            {/* Main marker */}
            <motion.circle
              r={city.isHome ? 8 : 5}
              fill={city.isHome ? "#22c55e" : "#eab308"}
              stroke="#fff"
              strokeWidth={2}
              style={{ cursor: "pointer" }}
              animate={{
                scale: hoveredCity === city.name ? 1.5 : 1,
                filter: hoveredCity === city.name 
                  ? `drop-shadow(0 0 10px ${city.isHome ? "#22c55e" : "#eab308"})`
                  : "none"
              }}
            />
            
            {/* Inner glow */}
            <circle
              r={city.isHome ? 3 : 2}
              fill="#ffffff"
              opacity={0.9}
            />
          </Marker>
        ))}

        {/* City annotations */}
        {cities.map((city) => (
          <Annotation
            key={`label-${city.name}`}
            subject={city.coordinates}
            dx={city.name === "Delhi" ? 20 : city.name === "Goa" ? -30 : 25}
            dy={city.name === "Kochi" ? 20 : city.name === "Bengaluru" ? 15 : -10}
            connectorProps={{
              stroke: city.isHome ? "#22c55e" : "#eab308",
              strokeWidth: 1,
              strokeDasharray: "2,2"
            }}
          >
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { 
                opacity: hoveredCity === city.name || hoveredCity === null ? 1 : 0.5, 
                scale: hoveredCity === city.name ? 1.1 : 1 
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <rect
                x={-40}
                y={-12}
                width={80}
                height={24}
                rx={6}
                fill={city.isHome ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)"}
                stroke={city.isHome ? "#22c55e40" : "#eab30840"}
              />
              <text
                textAnchor="middle"
                y={4}
                style={{
                  fontFamily: "inherit",
                  fontSize: 10,
                  fontWeight: 700,
                  fill: city.isHome ? "#22c55e" : "#eab308"
                }}
              >
                {city.name}
              </text>
              {city.isHome && (
                <text
                  textAnchor="middle"
                  y={14}
                  style={{
                    fontFamily: "inherit",
                    fontSize: 7,
                    fill: "#22c55e",
                    opacity: 0.7
                  }}
                >
                  HOME
                </text>
              )}
            </motion.g>
          </Annotation>
        ))}
      </ComposableMap>
      
      {/* Legend */}
      <motion.div
        className="absolute bottom-6 left-6 flex flex-col gap-3 p-4 rounded-xl"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
          <span className="text-muted-foreground">Home Base - Bengaluru</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 rounded-full bg-accent shadow-lg shadow-accent/50" />
          <span className="text-muted-foreground">Training & Match Locations</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-[2px] border-t-2 border-dashed border-accent/50" />
          <span className="text-muted-foreground">Cricket Routes</span>
        </div>
      </motion.div>

      {/* Stats overlay */}
      <motion.div
        className="absolute top-6 right-6 flex flex-col gap-2 p-4 rounded-xl"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.2 }}
      >
        <div className="text-3xl font-black text-primary">{cities.length}</div>
        <div className="text-xs text-muted-foreground">Cities Played</div>
      </motion.div>
    </motion.div>
  )
}

// Type colors and icons for timeline
const getTypeColor = (type: string) => {
  switch(type) {
    case "milestone": return "#22c55e"
    case "achievement": return "#eab308"
    case "academy": return "#3b82f6"
    case "tournament": return "#8b5cf6"
    case "exposure": return "#ec4899"
    case "current": return "#22c55e"
    case "birth": return "#f97316"
    default: return "#22c55e"
  }
}

// Constellation Galaxy Timeline - Stars forming patterns in space
function ConstellationGalaxyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [selectedStar, setSelectedStar] = useState<number | null>(null)
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null)

  // Group events by type for constellation formation
  const constellations = useMemo(() => {
    const groups: Record<string, typeof experienceTimeline> = {}
    experienceTimeline.forEach(item => {
      if (!groups[item.type]) groups[item.type] = []
      groups[item.type].push(item)
    })
    return groups
  }, [])

  // Calculate star positions in a galaxy spiral pattern
  const starPositions = useMemo(() => {
    const positions: { x: number; y: number; size: number; angle: number; distance: number }[] = []
    const totalStars = experienceTimeline.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle for spiral
    
    experienceTimeline.forEach((_, i) => {
      // Spiral galaxy distribution
      const angle = i * goldenAngle * 2.5
      const distance = 120 + Math.sqrt(i / totalStars) * 200 + (Math.random() * 30 - 15)
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance * 0.6 // Elliptical for depth effect
      const size = 8 + Math.random() * 8
      
      positions.push({ x, y, size, angle, distance })
    })
    return positions
  }, [])

  // Constellation connection lines
  const getConstellationLines = (type: string) => {
    const indices = experienceTimeline
      .map((item, i) => item.type === type ? i : -1)
      .filter(i => i !== -1)
    
    const lines: { from: number; to: number }[] = []
    for (let i = 0; i < indices.length - 1; i++) {
      lines.push({ from: indices[i], to: indices[i + 1] })
    }
    return lines
  }

  const constellationTypes = Object.keys(constellations)

  return (
    <div ref={containerRef} className="relative w-full py-8">
      {/* Galaxy Container */}
      <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden rounded-3xl"
        style={{
          background: "radial-gradient(ellipse at center, rgba(10,10,20,0.95) 0%, rgba(3,3,8,1) 100%)",
          border: "1px solid rgba(34, 197, 94, 0.15)"
        }}
      >
        {/* Nebula background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
              top: "20%",
              left: "10%",
              filter: "blur(60px)"
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #eab308 0%, transparent 70%)",
              bottom: "20%",
              right: "15%",
              filter: "blur(50px)"
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.12, 0.08]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full opacity-8"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              filter: "blur(40px)"
            }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Distant stars background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={`bg-star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* SVG Galaxy Map */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="-400 -350 800 700"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Orbital rings */}
          {[150, 220, 300].map((radius, i) => (
            <motion.ellipse
              key={`orbit-${i}`}
              cx={0}
              cy={0}
              rx={radius}
              ry={radius * 0.6}
              fill="none"
              stroke={`rgba(34, 197, 94, ${0.1 - i * 0.02})`}
              strokeWidth={1}
              strokeDasharray="4 8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: i * 0.3 }}
            />
          ))}

          {/* Year markers on orbits */}
          {["2015", "2019", "2024"].map((year, i) => {
            const radius = 150 + i * 70
            const angle = -Math.PI / 4 + i * 0.3
            return (
              <motion.g key={`year-marker-${i}`}>
                <text
                  x={Math.cos(angle) * radius}
                  y={Math.sin(angle) * radius * 0.6}
                  fill="rgba(255,255,255,0.3)"
                  fontSize={10}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {year}
                </text>
              </motion.g>
            )
          })}

          {/* Constellation lines */}
          {constellationTypes.map((type) => {
            const lines = getConstellationLines(type)
            const color = getTypeColor(type)
            const isActive = activeConstellation === type || activeConstellation === null
            
            return (
              <g key={`constellation-${type}`}>
                {lines.map(({ from, to }, lineIndex) => (
                  <motion.line
                    key={`line-${type}-${lineIndex}`}
                    x1={starPositions[from].x}
                    y1={starPositions[from].y}
                    x2={starPositions[to].x}
                    y2={starPositions[to].y}
                    stroke={color}
                    strokeWidth={hoveredStar === from || hoveredStar === to ? 2 : 1}
                    strokeOpacity={isActive ? (hoveredStar === from || hoveredStar === to ? 0.8 : 0.3) : 0.05}
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.5, delay: lineIndex * 0.1 + 0.5 }}
                    style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                  />
                ))}
              </g>
            )
          })}

          {/* Central Sun - The Player */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Sun glow layers */}
            <motion.circle
              cx={0}
              cy={0}
              r={45}
              fill="url(#sunGlow)"
              animate={{
                r: [45, 55, 45],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx={0}
              cy={0}
              r={30}
              fill="url(#sunCore)"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx={0} cy={0} r={20} fill="#fbbf24" />
            <circle cx={0} cy={0} r={12} fill="#fef3c7" />
            
            {/* Corona rays */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              return (
                <motion.line
                  key={`ray-${i}`}
                  x1={Math.cos(angle) * 25}
                  y1={Math.sin(angle) * 25}
                  x2={Math.cos(angle) * 40}
                  y2={Math.sin(angle) * 40}
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.6}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    x2: [Math.cos(angle) * 38, Math.cos(angle) * 50, Math.cos(angle) * 38],
                    y2: [Math.sin(angle) * 38, Math.sin(angle) * 50, Math.sin(angle) * 38]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              )
            })}
          </motion.g>

          {/* Timeline Stars */}
          {experienceTimeline.map((item, i) => {
            const pos = starPositions[i]
            const color = getTypeColor(item.type)
            const isHovered = hoveredStar === i
            const isSelected = selectedStar === i
            const isConstellationActive = activeConstellation === null || activeConstellation === item.type
            
            return (
              <motion.g
                key={`star-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { 
                  scale: isConstellationActive ? 1 : 0.5, 
                  opacity: isConstellationActive ? 1 : 0.3 
                } : {}}
                transition={{ duration: 0.6, delay: i * 0.05 + 0.8 }}
                onMouseEnter={() => setHoveredStar(i)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => setSelectedStar(selectedStar === i ? null : i)}
                style={{ cursor: "pointer" }}
              >
                {/* Star pulse ring */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  animate={isHovered || isSelected ? {
                    r: [pos.size + 5, pos.size + 20, pos.size + 5],
                    opacity: [0.8, 0, 0.8],
                  } : { opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Star glow */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size * 2}
                  fill={color}
                  opacity={0.2}
                  animate={{
                    r: isHovered ? pos.size * 3 : pos.size * 2,
                    opacity: isHovered ? 0.4 : 0.2
                  }}
                  style={{ filter: `blur(${pos.size}px)` }}
                />

                {/* Main star */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size / 2}
                  fill={color}
                  animate={{
                    r: isHovered || isSelected ? pos.size : pos.size / 2,
                    filter: isHovered || isSelected ? `drop-shadow(0 0 15px ${color})` : `drop-shadow(0 0 5px ${color})`
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Star core */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size / 4}
                  fill="#ffffff"
                  opacity={0.9}
                />

                {/* Year label */}
                <motion.text
                  x={pos.x}
                  y={pos.y - pos.size - 8}
                  fill={color}
                  fontSize={isHovered || isSelected ? 12 : 9}
                  textAnchor="middle"
                  fontWeight="bold"
                  animate={{ opacity: isHovered || isSelected ? 1 : 0.6 }}
                >
                  {item.year}
                </motion.text>
              </motion.g>
            )
          })}

          {/* Gradients */}
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>
          </defs>
        </svg>

        {/* Central Label */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs font-bold text-amber-400 tracking-widest uppercase">
            Journey
          </div>
        </motion.div>

        {/* Selected Star Detail Panel */}
        <AnimatePresence>
          {selectedStar !== null && (
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="p-6 rounded-2xl backdrop-blur-xl"
                style={{
                  background: "rgba(10,10,20,0.9)",
                  border: `2px solid ${getTypeColor(experienceTimeline[selectedStar].type)}40`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: getTypeColor(experienceTimeline[selectedStar].type),
                        boxShadow: `0 0 15px ${getTypeColor(experienceTimeline[selectedStar].type)}`
                      }}
                    />
                    <span 
                      className="text-3xl font-black"
                      style={{ color: getTypeColor(experienceTimeline[selectedStar].type) }}
                    >
                      {experienceTimeline[selectedStar].year}
                    </span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ 
                      backgroundColor: `${getTypeColor(experienceTimeline[selectedStar].type)}20`,
                      color: getTypeColor(experienceTimeline[selectedStar].type),
                      border: `1px solid ${getTypeColor(experienceTimeline[selectedStar].type)}40`
                    }}
                  >
                    {experienceTimeline[selectedStar].type}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  {experienceTimeline[selectedStar].event}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {experienceTimeline[selectedStar].description}
                </p>
                <button 
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSelectedStar(null)}
                >
                  Click to close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hovered Star Tooltip */}
        <AnimatePresence>
          {hoveredStar !== null && selectedStar === null && (
            <motion.div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `calc(50% + ${starPositions[hoveredStar].x * 0.5}px)`,
                top: `calc(50% + ${starPositions[hoveredStar].y * 0.5}px - 60px)`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div 
                className="px-4 py-2 rounded-xl backdrop-blur-lg whitespace-nowrap"
                style={{
                  background: "rgba(10,10,20,0.9)",
                  border: `1px solid ${getTypeColor(experienceTimeline[hoveredStar].type)}60`
                }}
              >
                <div className="text-sm font-bold text-foreground">
                  {experienceTimeline[hoveredStar].event}
                </div>
                <div className="text-xs text-muted-foreground">
                  Click for details
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Constellation Filter */}
        <motion.div
          className="absolute top-6 left-6 flex flex-wrap gap-2 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 2 }}
        >
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeConstellation === null 
                ? "bg-white/20 text-white" 
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
            onClick={() => setActiveConstellation(null)}
          >
            All Stars
          </button>
          {constellationTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2`}
              style={{
                backgroundColor: activeConstellation === type ? `${getTypeColor(type)}30` : "rgba(255,255,255,0.05)",
                color: activeConstellation === type ? getTypeColor(type) : "rgba(255,255,255,0.5)",
                border: `1px solid ${activeConstellation === type ? getTypeColor(type) : "transparent"}`
              }}
              onClick={() => setActiveConstellation(activeConstellation === type ? null : type)}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getTypeColor(type) }}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          className="absolute top-6 right-6 flex flex-col gap-3 p-4 rounded-xl z-20"
          style={{
            background: "rgba(10,10,20,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 2.2 }}
        >
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{experienceTimeline.length}</div>
            <div className="text-xs text-muted-foreground">Milestones</div>
          </div>
          <div className="h-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{Object.keys(constellations).length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-6 right-6 text-xs text-muted-foreground z-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 3 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Hover stars to preview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Click for full details</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Main Component
export default function CricketJourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const allAcademies = [...currentAssociations, ...previousAssociations]

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #030303, #050505, #030303)" }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <Suspense fallback={null}>
            <JourneyScene scrollProgress={scrollProgress.get()} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <motion.div
            ref={headerRef}
            className="text-center mb-16 md:mb-24"
            style={{ y }}
          >
            {/* Pre-title */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent to-primary"
                initial={{ scaleX: 0 }}
                animate={isHeaderInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <span className="text-xs md:text-sm font-medium tracking-[0.3em] text-primary uppercase">
                The Cricket Path
              </span>
              <motion.div 
                className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent to-primary"
                initial={{ scaleX: 0 }}
                animate={isHeaderInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </motion.div>
            
            {/* Main title */}
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-foreground">Forged Through</span>
              <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
                style={{ 
                  textShadow: "0 0 80px rgba(34, 197, 94, 0.5)",
                  WebkitBackgroundClip: "text"
                }}
              >
                Competition
              </span>
            </motion.h2>
            
            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A journey built across cities, academies, and countless hours on the pitch.
            </motion.p>
          </motion.div>
          
          {/* Story Text */}
          <motion.div
            className="max-w-4xl mx-auto mb-16 md:mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div 
              className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(15,15,15,0.8), rgba(8,8,8,0.9))",
                border: "1px solid rgba(34, 197, 94, 0.2)"
              }}
            >
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent/50" />
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                <span className="text-foreground font-semibold">Jai Vignesh&apos;s cricket journey</span> expanded beyond local grounds as he gained valuable experience playing across{" "}
                <span className="text-primary font-medium">Goa</span>,{" "}
                <span className="text-accent font-medium">Delhi</span>,{" "}
                <span className="text-primary font-medium">Kochi</span>, and{" "}
                <span className="text-accent font-medium">Ranchi</span>. Exposure to different playing conditions, teams, and competitive environments helped strengthen his{" "}
                <span className="text-foreground">match temperament</span>,{" "}
                <span className="text-foreground">confidence</span>,{" "}
                <span className="text-foreground">adaptability</span>, and{" "}
                <span className="text-foreground">understanding of the game</span>.
              </p>
            </div>
          </motion.div>
          
          {/* Two-Column Layout: Map and DNA Helix Academies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 md:mb-32">
            {/* India Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Training Footprint
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cricket journey across multiple states of India
                </p>
              </div>
              <IndiaMapReal />
            </motion.div>
            
            {/* DNA Helix Style Academy Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Academy Evolution
                </h3>
                <p className="text-sm text-muted-foreground">
                  A twisted path of growth and excellence
                </p>
              </div>
              
              {/* DNA Helix Container */}
              <div className="relative space-y-6">
                {/* Central DNA backbone line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-primary opacity-20 hidden lg:block" />
                
                {/* Current Associations Header */}
                <motion.div 
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <h4 className="text-lg font-bold text-foreground">Current Associations</h4>
                </motion.div>
                
                {currentAssociations.map((academy, i) => (
                  <DNAHelixCard 
                    key={academy.name} 
                    academy={academy} 
                    index={i} 
                    isCurrent={true}
                    totalCards={currentAssociations.length}
                  />
                ))}
                
                {/* Divider */}
                <motion.div 
                  className="flex items-center gap-4 py-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <span className="text-xs text-accent uppercase tracking-widest">Previous</span>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
                </motion.div>
                
                {/* Previous Associations Header */}
                <motion.div 
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <h4 className="text-lg font-bold text-foreground">Previous Associations</h4>
                </motion.div>
                
                {previousAssociations.map((academy, i) => (
                  <DNAHelixCard 
                    key={academy.name} 
                    academy={academy} 
                    index={i + currentAssociations.length} 
                    isCurrent={false}
                    totalCards={previousAssociations.length}
                  />
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Cricket Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
                Cricket Timeline
              </h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
                {experienceTimeline.length} key milestones marking the path from first bat to present day
              </p>
            </div>
            <ConstellationGalaxyTimeline />
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}

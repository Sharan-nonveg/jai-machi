"use client"

import { useRef, Suspense, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { isMobile } from "@/lib/device-utils"
import { 
  Float, 
  Sphere, 
  Trail, 
  Environment,
  Sparkles,
  Stars
} from "@react-three/drei"
import * as THREE from "three"

// Cricket Ball Component - Optimized
function CricketBall() {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    
    // Smooth floating motion
    groupRef.current.position.y = Math.sin(t * 0.3) * 2
    groupRef.current.position.x = Math.cos(t * 0.2) * 3
    
    // Rotation
    groupRef.current.rotation.x = t * 0.2
    groupRef.current.rotation.y = t * 0.3
  })

  return (
    <Trail
      width={2}
      length={8}
      color={new THREE.Color("#22c55e")}
      attenuation={(t) => t * t}
    >
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={groupRef} scale={0.8}>
          <mesh castShadow>
            <sphereGeometry args={[1, 16, 16]} />
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
          
          {/* Seam - Simplified */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.005, 0.02, 6, 20]} />
            <meshStandardMaterial color="#f5f5dc" roughness={0.7} />
          </mesh>
          
          {/* Glow ring */}
          <mesh scale={1.3}>
            <ringGeometry args={[0.95, 1.05, 24]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>
    </Trail>
  )
}

// Organic Blob Component - Simplified
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
      <Sphere ref={meshRef} args={[2, 16, 16]} position={position}>
        <meshPhysicalMaterial
          color="#0a4a0a"
          emissive="#0a4a0a"
          emissiveIntensity={0.1}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.05}
        />
      </Sphere>
    </Float>
  )
}

// Energy Rings Component - Reduced complexity
function EnergyRings() {
  return (
    <>
      {[0, 1].map((i) => (
        <mesh key={i} scale={2 + i * 1.5} rotation={[Math.PI * 0.3, 0, Math.PI * 0.4]}>
          <ringGeometry args={[4 + i * 2, 4.3 + i * 2, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#22c55e" : "#eab308"}
            emissive={i % 2 === 0 ? "#22c55e" : "#eab308"}
            emissiveIntensity={0.1}
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}
    </>
  )
}

// Floating Shapes Component - Fewer, simpler shapes
function FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 2 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 5
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.25,
      speed: 0.3 + Math.random() * 0.5,
      type: i % 2
    }))
  }, [])

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={shape.position} scale={shape.scale}>
            {shape.type === 0 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <tetrahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#22c55e" : "#eab308"}
              emissive={i % 2 === 0 ? "#22c55e" : "#eab308"}
              emissiveIntensity={0.2}
              transparent
              opacity={0.25}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// Main 3D Scene
function CricketBackgroundScene() {
  const { camera } = useThree()
  const cameraTarget = useRef({ x: 0, y: 0 })
  
  useFrame((_, delta) => {
    cameraTarget.current.x = THREE.MathUtils.lerp(cameraTarget.current.x, 0, delta * 1.5)
    cameraTarget.current.y = THREE.MathUtils.lerp(cameraTarget.current.y, 0, delta * 1.5)
    camera.position.x = cameraTarget.current.x
    camera.position.y = cameraTarget.current.y
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <fog attach="fog" args={["#050505", 10, 30]} />
      
      {/* Lighting - Reduced count and intensity */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#eab308" />
      
      {/* Background Elements - Reduced complexity */}
      <Stars radius={80} depth={40} count={150} factor={3} saturation={0} fade speed={0.5} />
      
      {/* 3D Cricket Elements */}
      <CricketBall />
      <OrganicBlob position={[-4, -1, -4]} />
      <EnergyRings />
      <FloatingShapes />
      
      {/* Sparkles - Significantly reduced */}
      <Sparkles count={15} scale={15} size={2} speed={0.2} color="#22c55e" opacity={0.3} />
      <Sparkles count={8} scale={12} size={1.5} speed={0.15} color="#eab308" opacity={0.2} />
    </>
  )
}

// Export Component
export function Cricket3DBackground() {
  const [shouldRender, setShouldRender] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setShouldRender(true)
    setMobile(isMobile())
  }, [])

  if (!shouldRender) return null

  if (mobile) return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-950/30 via-background to-background" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-green-500/5 animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full bg-yellow-500/5 animate-pulse" style={{animationDelay:'2s'}} />
    </div>
  )

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ 
          antialias: false,
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 1]}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <CricketBackgroundScene />
        </Suspense>
      </Canvas>
    </div>
  )
}

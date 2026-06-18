'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { isMobile } from '@/lib/device-utils'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedBackground() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0001
      groupRef.current.rotation.y += 0.0003
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cricket Ball - simplified geometry for performance */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.6}
          roughness={0.4}
          emissive="#991b1b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Seams on Ball - simplified */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.08, 6, 20]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Orbiting Stumps */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[4, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
            <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Floating Geometric Shapes */}
      {[0, 1].map((i) => (
        <group key={`geo-${i}`} position={[Math.cos((i * Math.PI * 2) / 2) * 6, Math.sin((i * Math.PI * 2) / 2) * 2, -3]}>
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#fbbf24' : '#16a34a'}
              wireframe={false}
              emissive={i % 2 === 0 ? '#b45309' : '#15803d'}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient Light */}
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#16a34a" />
      <ambientLight intensity={0.4} />
    </group>
  )
}

export function Shared3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setMobile(isMobile())

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!isMounted) return <div ref={containerRef} className="absolute inset-0 z-0" />

  if (mobile) return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-950/20 via-background to-background" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-green-500/5 animate-pulse" />
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-[1] pointer-events-none" />
      {/* Noise texture */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {inView && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: false,
            preserveDrawingBuffer: false,
          }}
          dpr={[1, 1]}
          frameloop="always"
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <AnimatedBackground />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          </Suspense>
        </Canvas>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-[1] pointer-events-none" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

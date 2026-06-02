'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedBackground() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.x += 0.0002
        groupRef.current.rotation.y += 0.0005
      }
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <group ref={groupRef}>
      {/* Cricket Ball */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.6}
          roughness={0.4}
          emissive="#991b1b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Seams on Ball */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.08, 8, 100]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Orbiting Stumps */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[4, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
            <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Floating Geometric Shapes */}
      {[0, 1, 2, 3].map((i) => (
        <group key={`geo-${i}`} position={[Math.cos((i * Math.PI * 2) / 4) * 6, Math.sin((i * Math.PI * 2) / 4) * 2, -3]}>
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
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#16a34a" />
      <ambientLight intensity={0.6} />
    </group>
  )
}

export function Shared3DBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <AnimatedBackground />
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        </Suspense>
      </Canvas>

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

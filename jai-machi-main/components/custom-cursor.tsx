'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'

export function CustomCursor() {
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 400 })
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 400 })

  useEffect(() => {
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) return

    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button')) {
        setIsHoveringLink(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button')) {
        setIsHoveringLink(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    window.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY])

  if (!isClient) return null

  return (
    <>
      {/* Cricket Ball Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: -16,
          translateY: -16,
        }}
      >
        <motion.div
          className="relative w-8 h-8"
          animate={{
            scale: isHoveringLink ? 1.2 : 1,
          }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        >
          <Image
            src="/cricket-ball-cursor.png"
            alt="cricket ball cursor"
            width={32}
            height={32}
            priority
            draggable={false}
            style={{
              filter: isHoveringLink ? 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
              transition: 'filter 0.2s ease',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Glow ring around cricket ball on hover */}
      {isHoveringLink && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 border-2 border-green-500 rounded-full pointer-events-none z-[9998] hidden lg:block"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: -24,
            translateY: -24,
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
          }}
        />
      )}
    </>
  )
}

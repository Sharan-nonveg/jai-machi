'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface CursorPosition {
  x: number
  y: number
}

export function CustomCursor() {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
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

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  if (!isClient) return null

  return (
    <>
      {/* Cricket Ball Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
        animate={{
          x: cursorPosition.x - 16,
          y: cursorPosition.y - 16,
          scale: isHoveringLink ? 1.2 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      >
        <div className="relative w-8 h-8">
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
        </div>
      </motion.div>

      {/* Glow ring around cricket ball on hover */}
      {isHoveringLink && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 border-2 border-green-500 rounded-full pointer-events-none z-[9998] hidden lg:block"
          animate={{
            x: cursorPosition.x - 24,
            y: cursorPosition.y - 24,
          }}
          transition={{ duration: 0.1 }}
          style={{
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
          }}
        />
      )}
    </>
  )
}

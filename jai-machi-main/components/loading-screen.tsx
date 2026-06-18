'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isMobile } from '@/lib/device-utils'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const duration = isMobile() ? 800 : 2000
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-background flex items-center justify-center z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-40 h-40">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 border-r-green-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle rotating ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-transparent border-b-yellow-500 border-l-yellow-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner rotating ring */}
            <motion.div
              className="absolute inset-8 rounded-full border-2 border-transparent border-t-green-400 border-r-yellow-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center cricket ball */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center relative">
                  <div className="absolute w-2 h-2 bg-white left-0 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.div
            className="absolute bottom-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-green-500 text-lg font-bold tracking-wide">LOADING</h2>
            <motion.p
              className="text-muted-foreground text-sm mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparing the best cricket experience...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

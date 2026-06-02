'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, ArrowRight, Star, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Shared3DBackground } from './shared-3d-background'
import { sendContactEmail } from '@/app/actions/send-email'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (feedback) setFeedback(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)

    try {
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setFeedback({ type: 'success', message: result.message })
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFeedback({ type: 'error', message: result.error })
      }
    } catch (error) {
      console.error('[v0] Form submission error:', error)
      setFeedback({ type: 'error', message: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background to-green-950/10"
    >
      {/* 3D Cricket Background */}
      <Shared3DBackground />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-green-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="inline-block mb-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <Star className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-400">Let's Connect</span>
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
              Ready for the Next Challenge?
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Whether you're looking to collaborate, discuss opportunities, or just say hi, I'm always open to connecting with like-minded individuals and exploring new possibilities.
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="flex flex-col items-center justify-center mb-16">
          {/* Contact Info Cards - Centered */}
          <motion.div
            className="space-y-6 mb-12 max-w-lg w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                icon: Mail,
                title: 'Email',
                value: 'vjai5894@gmail.com',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Phone,
                title: 'Phone',
                value: '+91 7349575739',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: MapPin,
                title: 'Location',
                value: 'Bengaluru, India',
                color: 'from-pink-500 to-rose-500',
              },
            ].map((contact, idx) => {
              const Icon = contact.icon
              return (
                <motion.div
                  key={idx}
                  className="group"
                  variants={itemVariants}
                >
                  <motion.div
                    className="p-6 rounded-lg border border-green-500/20 bg-green-500/5 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${contact.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-foreground font-semibold mb-1">{contact.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {contact.value}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Contact Form - Centered */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-lg"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="p-8 rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-yellow-500/5 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Name Input */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border border-green-500/20 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-all duration-300"
                    whileFocus={{
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
                    }}
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-green-500/20 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-all duration-300"
                    whileFocus={{
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
                    }}
                  />
                </motion.div>

                {/* Message Textarea */}
                <motion.div
                  className="group"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your message or opportunity..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-green-500/20 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 transition-all duration-300 resize-none"
                    whileFocus={{
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
                    }}
                  />
                </motion.div>

                {/* Feedback Message */}
                {feedback && (
                  <motion.div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      feedback.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {feedback.type === 'success' ? (
                      <Check className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{feedback.message}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 group ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                  {!isLoading && (
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center pt-12 border-t border-green-500/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Follow my journey on social media for updates and insights
          </p>
          <div className="flex items-center justify-center gap-4">
            {[
              { name: 'X', href: 'https://x.com/vjai5894?s=11' },
              { name: 'Instagram', href: 'https://www.instagram.com/jai_vignesh_80?igsh=MWp2eTdpdGI4M29ndA==' }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-green-500/20 text-muted-foreground hover:text-green-400 hover:border-green-500/50 transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

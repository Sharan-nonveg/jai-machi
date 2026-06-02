'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function PremiumFooter() {
  const footerLinks = [
    { title: 'Navigate', links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Journey', href: '#journey' },
    ]},
    { title: 'Information', links: [
      { label: 'Achievements', href: '#stats' },
      { label: 'Stats', href: '#stats' },
      { label: 'Certificates', href: '#gallery' },
      { label: 'Contact', href: '#contact' },
    ]},
  ]

  return (
    <motion.footer
      className="relative bg-background border-t border-green-500/20 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
              <motion.div
                className="flex items-center gap-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                  CRICKET
                </span>
              </motion.div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Premium cricket portfolio showcasing excellence on and off the field.
              </p>
              <p className="text-sm text-green-400">
                Crafted with passion
              </p>
            </motion.div>

            {/* Links sections */}
            {footerLinks.map((section, idx) => (
              <motion.div key={idx} variants={itemVariants} className="col-span-1">
                <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
                  <motion.div
                    className="w-1 h-4 bg-gradient-to-b from-green-500 to-yellow-500 rounded"
                    layoutId={`bar-${idx}`}
                  />
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <motion.li
                      key={linkIdx}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-green-400 text-sm transition-colors duration-200 flex items-center gap-1 group"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact info */}
            <motion.div variants={itemVariants} className="col-span-1">
              <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
                <motion.div className="w-1 h-4 bg-gradient-to-b from-green-500 to-yellow-500 rounded" />
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">Bengaluru, India</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">vjai5894@gmail.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">+91 7349575739</span>
                </li>
              </ul>
            </motion.div>
          </div>


        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="h-px bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.footer>
  )
}

"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Award, Trophy, Star, Medal, Calendar, MapPin, X, ChevronLeft, ChevronRight, Sparkles, FileText, ExternalLink } from "lucide-react"
import { Shared3DBackground } from "./shared-3d-background"

const certificates = [
  {
    id: 1,
    title: "KSCA State Selection",
    subtitle: "Karnataka State Cricket Association",
    type: "Selection",
    date: "February 14, 2026",
    location: "Delhi Match - April 23, 2026",
    achievement: "State Representative",
    organization: "KSCA Selection Committee",
    description: "Official selection letter from the Karnataka State Cricket Association (KSCA) Selection Committee confirming selection to represent the KSCA in the upcoming match in Delhi on April 23, 2026.",
    image: "/achievements/media__1781717215090.png",
    color: "from-sky-500 to-blue-600",
    icon: Award,
    badge: "STATE",
    isPortrait: false,
  },
  {
    id: 2,
    title: "District Cricket Team Selection",
    subtitle: "Karnataka Cricket Board",
    type: "Selection",
    date: "October 20, 2025",
    location: "Bengaluru, Karnataka",
    achievement: "Selected Player",
    organization: "Karnataka Cricket Board",
    description: "Official selection letter from the District Selection Committee congratulating on being selected to represent the District Cricket Team for the upcoming season.",
    image: "/achievements/media__1781717222042.png",
    color: "from-emerald-500 to-green-600",
    icon: Medal,
    badge: "DISTRICT",
    isPortrait: false,
  },
  {
    id: 3,
    title: "Official Briefing & Kit Selection",
    subtitle: "Karnataka Cricket Board",
    type: "Briefing",
    date: "October 25, 2025",
    location: "District Cricket Ground, Bengaluru",
    achievement: "Briefing & Kit Distribution",
    organization: "District Selection Committee",
    description: "Official instruction request to report to the District Cricket Association Ground on October 25, 2025 at 9:00 AM for the official team briefing and kit distribution.",
    image: "/achievements/media__1781717227344.png",
    color: "from-violet-500 to-purple-600",
    icon: Star,
    badge: "DISTRICT",
    isPortrait: false,
  },
  {
    id: 4,
    title: "8th All India National Goa Gold Cup",
    subtitle: "T20 Cricket Championship 2021",
    type: "Championship",
    date: "October 19-22, 2021",
    location: "Madgaon, Goa",
    achievement: "Team Winners",
    organization: "T20 Cricket Association Goa",
    description: "Certificate of Merit/Participation for outstanding performance in the 8th All India National Goa Gold Cup T20 Cricket Championship held at Madgaon, Goa, under the banner of the T20 Cricket Association of India.",
    image: "/achievements/media__1781717232240.jpg",
    color: "from-amber-500 to-yellow-600",
    icon: Trophy,
    badge: "NATIONAL",
    isPortrait: false,
  },
]

export function CertificatesSection() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const navigateCert = (direction: "prev" | "next") => {
    if (selectedCert === null) return
    const currentIndex = certificates.findIndex((c) => c.id === selectedCert)
    if (direction === "prev") {
      const newIndex = currentIndex === 0 ? certificates.length - 1 : currentIndex - 1
      setSelectedCert(certificates[newIndex].id)
    } else {
      const newIndex = currentIndex === certificates.length - 1 ? 0 : currentIndex + 1
      setSelectedCert(certificates[newIndex].id)
    }
  }

  return (
    <section ref={containerRef} className="relative min-h-screen py-24 overflow-hidden bg-background">
      {/* 3D Cricket Background */}
      <Shared3DBackground />

      {/* Animated Background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.1),transparent_50%)]" />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* Floating Achievement Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            {i % 4 === 0 && <Trophy className="w-8 h-8 text-primary/20" />}
            {i % 4 === 1 && <Medal className="w-8 h-8 text-yellow-500/20" />}
            {i % 4 === 2 && <Star className="w-8 h-8 text-primary/20" />}
            {i % 4 === 3 && <Award className="w-8 h-8 text-yellow-500/20" />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Unique Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-yellow-500/20 border border-primary/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">VERIFIED ACHIEVEMENTS</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>

          {/* Main Title with Split Animation */}
          <div className="relative">
            <motion.h2
              className="text-5xl md:text-7xl font-black tracking-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="block text-foreground/80"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Certified
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Excellence
              </motion.span>
            </motion.h2>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-primary to-transparent rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
            <motion.div
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-yellow-500 to-transparent rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
          </div>

          <motion.p
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Official recognitions, selections, and media features documenting the journey of dedication and achievement
          </motion.p>
        </motion.div>

        {/* Certificates Grid - Unique Stacked Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {certificates.map((cert, index) => {
            const Icon = cert.icon
            const isHovered = hoveredCard === cert.id

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 60, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                onHoverStart={() => setHoveredCard(cert.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => setSelectedCert(cert.id)}
                className="group relative cursor-pointer perspective-1000"
              >
                {/* Card Stack Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-2xl"
                  animate={{
                    x: isHovered ? 8 : 4,
                    y: isHovered ? 8 : 4,
                    rotate: isHovered ? 2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-yellow-500/10 rounded-2xl"
                  animate={{
                    x: isHovered ? 16 : 8,
                    y: isHovered ? 16 : 8,
                    rotate: isHovered ? 4 : 2,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main Card */}
                <motion.div
                  className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden"
                  animate={{
                    scale: isHovered ? 1.02 : 1,
                    rotateY: isHovered ? 2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <motion.div
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${cert.color} text-white text-xs font-bold shadow-lg`}
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {cert.badge}
                    </motion.div>
                  </div>

                  <div className={`flex flex-col ${cert.isPortrait ? '' : 'sm:flex-row'}`}>
                    {/* Image Section */}
                    <div className={`relative w-full ${cert.isPortrait ? 'aspect-[3/4]' : 'sm:w-[30%] aspect-[16/10] sm:aspect-auto'} overflow-hidden bg-white/5 p-2`}>
                      <motion.div
                        className="absolute inset-2"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          fill
                          className="object-contain"
                        />
                      </motion.div>
                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${cert.color} opacity-20 mix-blend-overlay`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:block hidden" />

                      {/* View Button */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      >
                        <motion.div
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">View Document</span>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 md:p-8">
                      {/* Type & Icon */}
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          className={`p-2 rounded-xl bg-gradient-to-br ${cert.color} shadow-lg`}
                          animate={{ rotate: isHovered ? 360 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          {cert.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{cert.subtitle}</p>

                      {/* Achievement Highlight */}
                      <motion.div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${cert.color} bg-opacity-10 border border-current/20 mb-4`}
                        animate={{ x: isHovered ? 4 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-foreground">{cert.achievement}</span>
                      </motion.div>

                      {/* Meta Info */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{cert.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{cert.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{cert.organization}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Progress Bar */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${cert.color}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Certificates", value: "4", icon: Award },
            { label: "Championships", value: "1", icon: Trophy },
            { label: "State Selections", value: "1", icon: Medal },
            { label: "District Selections", value: "2", icon: Star },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative group"
            >
              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 text-center overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedCert(null)}
          >
            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateCert("prev")
              }}
              className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateCert("next")
              }}
              className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Certificate Content */}
            {certificates
              .filter((c) => c.id === selectedCert)
              .map((cert) => {
                const Icon = cert.icon
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-card rounded-3xl border border-border/50 shadow-2xl"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="relative aspect-[3/4] md:aspect-auto">
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          fill
                          className="object-contain bg-white"
                        />
                      </div>

                      {/* Info Side */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        {/* Badge */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cert.color} text-white text-sm font-bold w-fit mb-6`}
                        >
                          <Icon className="w-4 h-4" />
                          {cert.badge} {cert.type.toUpperCase()}
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl md:text-4xl font-black text-foreground mb-2"
                        >
                          {cert.title}
                        </motion.h3>

                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="text-lg text-muted-foreground mb-6"
                        >
                          {cert.subtitle}
                        </motion.p>

                        {/* Achievement */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r ${cert.color} bg-opacity-10 border border-current/20 w-fit mb-8`}
                        >
                          <Trophy className="w-6 h-6 text-yellow-500" />
                          <span className="text-xl font-bold text-foreground">{cert.achievement}</span>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.45 }}
                          className="text-muted-foreground leading-relaxed mb-8"
                        >
                          {cert.description}
                        </motion.p>

                        {/* Meta Grid */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="grid grid-cols-1 gap-4"
                        >
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-xs text-muted-foreground uppercase">Date</div>
                              <div className="font-semibold text-foreground">{cert.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                            <MapPin className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-xs text-muted-foreground uppercase">Location</div>
                              <div className="font-semibold text-foreground">{cert.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-xs text-muted-foreground uppercase">Issued By</div>
                              <div className="font-semibold text-foreground">{cert.organization}</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}

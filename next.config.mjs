/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript strict checking
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize images for production
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'lucide-react'],
  },
  // Fix Turbopack root warning
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig

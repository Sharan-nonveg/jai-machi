import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ScrollProgress } from '@/components/scroll-progress'
import { CustomCursor } from '@/components/custom-cursor'
import { LoadingScreen } from '@/components/loading-screen'
import { PageTransition } from '@/components/page-transition'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Jai Vignesh | Student Athlete & Cricketer',
  description: 'Premium portfolio of Jai Vignesh - Student, Cricketer, Dream Chaser. Discover the journey of a passionate cricket player.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground custom-cursor`}>
        <LoadingScreen />
        <ScrollProgress />
        <CustomCursor />
        <PageTransition>
          {children}
        </PageTransition>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

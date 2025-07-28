'use client'

'use client'

import { motion } from 'framer-motion'
import { useSidebar } from './SidebarContext'
import { useEffect, useState } from 'react'

interface MainContentProps {
  children: React.ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  const { sidebarWidth, animationDuration } = useSidebar()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1024)
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <motion.div
      className="flex-1 flex flex-col min-w-0"
      style={{
        marginLeft: isDesktop ? `${sidebarWidth}px` : (isTablet ? '80px' : '0px'),
        width: isDesktop ? `calc(100vw - ${sidebarWidth}px)` : '100vw',
        paddingBottom: isMobile ? '80px' : '0px' // Add padding for mobile bottom nav
      }}
      animate={{
        marginLeft: isDesktop ? `${sidebarWidth}px` : (isTablet ? '80px' : '0px'),
        width: isDesktop ? `calc(100vw - ${sidebarWidth}px)` : '100vw'
      }}
      transition={{
        duration: animationDuration,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
} 
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  sidebarWidth: number
  animationDuration: number
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarWidth = isCollapsed ? 80 : 280

  // Animation timing constants
  const animationDuration = 0.3

      return (
      <SidebarContext.Provider value={{ 
        isCollapsed, 
        setIsCollapsed, 
        sidebarWidth,
        animationDuration
      }}>
        {children}
      </SidebarContext.Provider>
    )
} 
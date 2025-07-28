'use client'

import { RotateCcw, FileText, Sparkles, Calendar, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: RotateCcw, label: 'History', href: '/dashboard/history' },
  { icon: FileText, label: 'My Classes', href: '/dashboard/create-class' },
  { icon: Sparkles, label: 'Chat', href: '/dashboard/new-plan' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center space-y-1 p-2 transition-colors"
            >
              <Icon 
                className={`w-5 h-5 ${
                  isActive 
                    ? 'text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text' 
                    : 'text-gray-600'
                }`} 
              />
              <span 
                className={`text-xs ${
                  isActive 
                    ? 'text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text font-medium' 
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 
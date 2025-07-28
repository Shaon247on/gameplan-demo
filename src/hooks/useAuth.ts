import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  selectAuth, 
  selectToken, 
  selectIsAuthenticated, 
  checkAuthStatus,
  logoutUser 
} from '@/store/features/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize auth on client side
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token in cookies
        if (typeof window !== 'undefined') {
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1]
          
          if (token) {
            // Verify token with server
            await dispatch(checkAuthStatus())
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear invalid token
        await dispatch(logoutUser())
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [dispatch])

  return {
    ...auth,
    isInitialized,
  }
}

// Hook to get token from cookies (client-side only)
export const useToken = () => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]
      
      setToken(cookieToken || null)
    }
  }, [])

  return token
} 
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: number
  username: string
  avatar_url: string | null
  email: string | null
  api_token: string
  created_at: number
}

interface Package {
  name: string
  description: string
  downloads: number
  created_at: number
}

interface AuthContextType {
  user: User | null
  packages: Package[]
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  regenerateToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setPackages(data.packages || [])
      } else {
        setUser(null)
        setPackages([])
      }
    } catch {
      setUser(null)
      setPackages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = () => {
    // Redirect to GitHub OAuth
    window.location.href = '/api/auth/github'
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      setPackages([])
      window.location.href = '/'
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const regenerateToken = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/token/regenerate', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Update user with new token
        if (user) {
          setUser({ ...user, api_token: data.api_token })
        }
        return data.api_token
      }
      return null
    } catch {
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        packages,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        regenerateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

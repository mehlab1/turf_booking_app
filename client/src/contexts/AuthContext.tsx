import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      // User not authenticated
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/login', { email, password })
      if (response.data.success) {
        setUser(response.data.user)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.data.message || 'Login failed')
        return false
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/register', { email, password })
      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        return true
      } else {
        toast.error(response.data.message || 'Registration failed')
        return false
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
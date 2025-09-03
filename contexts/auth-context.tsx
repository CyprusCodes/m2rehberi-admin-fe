"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login as loginRequest, logout as logoutRequest, getMe } from "@/services/auth/login"
import { setAuthToken, getAuthToken, removeAuthToken, getUser, removeUser, setUser as setUserToStorage } from "@/lib/storage"

interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "user" | "server_owner"
  avatar?: string
  userType?: string
  userTypeLabel?: string
  phoneNumber?: string
  userStatus?: string
  emailVerifyStatus?: string
  isServerOwnerRequestable?: number
}

interface AuthContextType {
  user: User | null
  adminLogin: (email: string, password: string) => Promise<boolean>
  userLogin: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const createUserData = (meData: any, email: string): User => ({
    id: String(meData.userId ?? "self"),
    email: meData.email ?? email,
    name: `${meData.firstName ?? ""} ${meData.lastName ?? ""}`.trim() || email.split("@")[0],
    role: (meData.userType ?? "user") as User["role"],
    avatar: undefined,
    userType: meData.userType,
    userTypeLabel: meData.userTypeLabel,
    phoneNumber: meData.phoneNumber,
    userStatus: meData.userStatus,
    emailVerifyStatus: meData.emailVerifyStatus,
    isServerOwnerRequestable: meData.isServerOwnerRequestable
  })

  const clearStorage = () => {
    removeAuthToken()
    removeUser()
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getUser<User>()
        const token = getAuthToken()

        if (storedUser && token) {
          try {
            const me = await getMe()
            if (me?.user) {
              const userData = createUserData(me.user, storedUser.email)
              setUser(userData)
            } else {
              clearStorage()
              setUser(null)
            }
          } catch (error) {
            clearStorage()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await loginRequest(email, password)
      
      if (!data?.accessToken) {
        throw new Error('No access token received')
      }

      setAuthToken(data.accessToken)
      
      const me = await getMe()
      if (!me?.user) {
        throw new Error('Failed to fetch user data')
      }


      const userData = createUserData(me.user, email)
      
      setUserToStorage(userData)
      setUser(userData)
        
      return true
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const userLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await loginRequest(email, password)
      
      if (!data?.accessToken) {
        throw new Error('No access token received')
      }

      // Store token in localStorage
      setAuthToken(data.accessToken)
      
      const me = await getMe()
      if (!me?.user) {
        throw new Error('Failed to fetch user data')
      }

      const userData = createUserData(me.user, email)
      
      // Store user data in localStorage
      setUserToStorage(userData)
      
      // Update state
      setUser(userData)
      
      return true
    } catch (error) {
      console.error('User login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try { 
      await logoutRequest() 
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearStorage()
      setUser(null)
      router.push('/')
    }
  }

  const isAdmin = user?.role === 'super_admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        adminLogin,
        userLogin,
        logout,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { login as loginRequest, logout as logoutRequest, getMe } from "@/services/auth/login"
import { getAuthToken, setAuthToken, removeAuthToken, setUser as setUserStorage, getUser as getUserStorage, removeUser as removeUserStorage } from "@/lib/storage"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUserStorage<User>()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const data = await loginRequest(email, password)
      // Expecting { accessToken, user? }
      if (data?.accessToken) {
        setAuthToken(data.accessToken)
      }
      // Fetch real user profile
      const me = await getMe()
      const userData: User = {
        id: String(me?.user?.userId ?? "self"),
        email: me?.user?.email ?? email,
        name: `${me?.user?.firstName ?? ""} ${me?.user?.lastName ?? ""}`.trim() || (email.split("@")[0]),
        role: (me?.user?.userType ?? "user") as User["role"],
        avatar: undefined
      }
      setUser(userData)
      setUserStorage(userData)
      setIsLoading(false)
      return true
    } catch (_err) {
      setIsLoading(false)
      return false
    }
  }

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginRequest(email, password)
      if (data?.accessToken) {
        setAuthToken(data.accessToken)
      }
      return true
    } catch (_err) {
      return false
    }
  }

  const logout = async () => {
    try { await logoutRequest() } catch (_) {}
    removeAuthToken()
    removeUserStorage()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
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

"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { adminLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const ok = await adminLogin(email, password)
      if (ok) {
        router.push("/admin")
      } else {
        setError("Geçersiz e-posta veya şifre")
      }
    } catch (_err) {
      setError("Giriş yapılırken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }
  // 
  // const handleLogin = async (email: string, password: string) => {
  //   const ok = await doLogin(email, password)
  //   if (ok) {
  // }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-200">
          E-posta Adresi
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@oyna.gg"
          required
          className="h-12 rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-200">
          Şifre
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-12 rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 text-slate-100 shadow-lg shadow-indigo-900/40 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100/60 border-t-transparent" />
            Giriş yapılıyor...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            Oyna.gg Admin Paneli
          </>
        )}
      </Button>
    </form>
  )
}

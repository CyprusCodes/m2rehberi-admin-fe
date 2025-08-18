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
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("password")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login: doLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const ok = await doLogin(email, password)
      if (ok) {
        router.push("/dashboard")
      } else {
        setError("Geçersiz email veya şifre")
      }
    } catch (_err) {
      setError("Giriş yapılırken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/90 font-medium">
          Email Adresi
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@metinport.com"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/20 h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/90 font-medium">
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
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/20 h-12 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold h-12 shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Giriş yapılıyor...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Paneline Giriş
          </div>
        )}
      </Button>
    </form>
  )
}

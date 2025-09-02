"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { Gamepad2, ArrowLeft, LogIn, User, Eye, EyeOff, AlertCircle, Crown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const { adminLogin } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = 'E-posta adresi gerekli'
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!password) {
      newErrors.password = 'Şifre gerekli'
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const success = await adminLogin(email.trim(), password)
      if (success) {
        router.push('/admin')
      } else {
        setErrors({ general: 'Admin girişi başarısız. Lütfen bilgilerinizi kontrol edin.' })
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      const message = error?.response?.data?.message || 'Admin girişi yapılırken bir hata oluştu'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5" />
      

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-primary/10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Button>
        </Link>
        <ModeToggle />
      </div>

      {/* Login Content */}
      <div className="relative z-20 min-h-[calc(100vh-88px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">M2Rehberi</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Glass Login Card */}
          <Card className="glass border-2 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            
            <CardHeader className="text-center pb-6 relative">
              <CardTitle className="text-xl font-semibold flex items-center justify-center space-x-2">
                <Crown className="w-5 h-5 text-primary" />
                <span>Admin Giriş</span>
              </CardTitle>
              <CardDescription>
                Admin paneline erişmek için bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {errors.general && (
                  <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">{errors.general}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        clearError('email')
                      }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="admin@example.com"
                      className={`pr-10 ${
                        errors.email ? 'border-destructive' : 
                        focusedField === 'email' ? 'border-primary' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearError('password')
                      }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Şifrenizi girin"
                      className={`pr-10 ${
                        errors.password ? 'border-destructive' : 
                        focusedField === 'password' ? 'border-primary' : ''
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Giriş yapılıyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Admin Giriş</span>
                    </div>
                  )}
                </Button>

                {/* Links */}
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Normal kullanıcı mısınız?{' '}
                    <Link href="/auth/signin" className="text-primary hover:underline">
                      Buradan giriş yapın
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              M2Rehberi platformu için güvenli admin erişimi
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 M2Rehberi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
    </div>
  )
}

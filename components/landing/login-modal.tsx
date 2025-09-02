'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function LoginModal({ isOpen, onClose, userEmail }: LoginModalProps) {
  const [email, setEmail] = useState(userEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login: doLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const ok = await doLogin(email, password)
      if (ok) {
        toast.success('Giriş başarılı! Admin paneline yönlendiriliyorsunuz...')
        onClose()
        router.push('/admin')
      } else {
        setError('Geçersiz email veya şifre')
      }
    } catch (_err) {
      setError('Giriş yapılırken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 bg-card border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Zaten Hesabınız Var!
          </CardTitle>
          
          <p className="text-muted-foreground text-sm">
            Bu e-posta adresi ile kayıtlı bir hesap bulundu. Lütfen giriş yapın.
          </p>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-posta Adresi
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-12 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Kapat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

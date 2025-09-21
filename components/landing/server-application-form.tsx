'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Server, MessageSquare, Send, CheckCircle, Rocket, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { checkEmail } from '@/services/auth/checkEmail'
import { LoginModal } from './login-modal'

export function ServerApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    serverName: '',
    description: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await checkEmail(formData.email)
      const userExists = response.exists
      
      if (userExists) {
        setUserEmail(formData.email)
        setShowLoginModal(true)
        toast.success('Kullanıcı bulundu! Bu e-posta adresinden bir kullanıcı var. Lütfen giriş yapın.')
      } else {
        toast.success('Bu e-posta adresinde kullanıcı bulunamadı. Yeni hesap oluşturabilirsiniz.')
        
        // Formu sıfırla
        setFormData({
          email: '',
          serverName: '',
          description: '',
        })
        
        setIsSubmitted(true)
      }
    } catch (error) {
      toast.error('E-posta kontrolü yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({
      email: '',
      serverName: '',
      description: '',
    })
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
    setUserEmail('')
  }

  if (isSubmitted) {
    return (
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-green-500/10 to-green-500/5 rounded-2xl" />
        <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5 rounded-2xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-green-500/30 rounded-full animate-pulse" />
        <div className="absolute top-8 right-6 w-2 h-2 bg-green-500/40 rounded-full animate-ping" />
        <div className="absolute bottom-6 left-8 w-2 h-2 bg-green-500/35 rounded-full animate-bounce" />
        
        <Card className="relative bg-card/50 backdrop-blur-sm border-green-200/50 hover:border-green-300/50 transition-all duration-300 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 transition-colors">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">
              E-posta Kontrolü Tamamlandı!
            </h3>
            <p className="text-green-700 mb-6 max-w-md mx-auto">
              Bu e-posta adresinde kullanıcı bulunamadı. Yeni hesap oluşturabilirsiniz.
            </p>
            <Button 
              onClick={resetForm}
              variant="outline"
              size="lg"
              className="border-2 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-300"
            >
              Yeni Başvuru
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl" />
        <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5 rounded-2xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-8 right-6 w-2 h-2 bg-primary/40 rounded-full animate-ping" />
        <div className="absolute bottom-6 left-8 w-2 h-2 bg-primary/35 rounded-full animate-bounce" />
        
        <Card className="relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 shadow-xl hover:shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Server Başvuru Formu
            </CardTitle>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Sunucunuzu Oyna.gg platformuna eklemek için aşağıdaki formu doldurun
            </p>
          </CardHeader>
          
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                    E-posta Adresiniz *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="serverName" className="text-sm font-semibold text-foreground">
                    Server Adı *
                  </Label>
                  <div className="relative group">
                    <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Input
                      id="serverName"
                      name="serverName"
                      type="text"
                      required
                      placeholder="Server'ınızın adını girin"
                      value={formData.serverName}
                      onChange={handleInputChange}
                      className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                  Server Açıklaması
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Server'ınız hakkında kısa bir açıklama yazın..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all duration-300 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg font-semibold group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Server Başvurusu Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                    Server Başvurusu Gönder
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        userEmail={userEmail}
      />
    </>
  )
}

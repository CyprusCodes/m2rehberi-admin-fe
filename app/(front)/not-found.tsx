'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search, Gamepad2 } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/OynaGG-bg.png')] bg-cover bg-center opacity-5" />
      
      <Card className="w-full max-w-2xl glass border-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <CardContent className="p-12 text-center relative">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold font-mono bg-gradient-to-r from-primary via-gray-500 to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </h1>
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-gray-500 rounded-full" />
              <Gamepad2 className="w-8 h-8 text-primary animate-pulse" />
              <div className="h-1 w-12 bg-gradient-to-r from-gray-500 to-gray-500 rounded-full" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sayfa Bulunamadı
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>
            <p className="text-sm text-muted-foreground">
              Belki bu sayfayı arıyorsunuz ya da ana sayfaya dönmek istersiniz?
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-500/40 rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-pink-500/30 rounded-full animate-bounce" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-gray-600 hover:from-primary/90 hover:to-gray-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 group"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Ana Sayfa
            </Button>
            
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto border-2 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 group"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Geri Dön
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <span>İhtiyacınız olan sayfayı bulamadınız mı? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-primary/80 underline"
                onClick={() => router.push('/admin')}
              >
                Tüm menüleri görüntüleyin
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-gray-500/10 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-gray-500/10 to-gray-500/10 rounded-full blur-xl" />
        </CardContent>
      </Card>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping animation-delay-1000" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-500 rounded-full animate-pulse animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce animation-delay-3000" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-500 rounded-full animate-ping animation-delay-4000" />
        </div>
      </div>
    </div>
  )
}

"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Gamepad2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5" />
      

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-primary/10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
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
              <CardTitle className="text-xl font-semibold">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <LoginForm />
            </CardContent>

          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Secure admin access for M2Rehberi platform
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 M2Rehberi. All rights reserved.
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

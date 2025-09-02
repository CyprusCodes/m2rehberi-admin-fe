'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Gamepad2, LogIn, Menu, X, User, Settings, Server, LogOut, ChevronDown, Crown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Server Başvuru', href: '#server-application' },
    { name: 'Mobile App', href: '#mobile' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">M2Rehberi</h1>
              <p className="text-xs text-muted-foreground">Metin2 Server Guide</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || 'Kullanıcı'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {isAdmin ? (
                        <>
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">Admin</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">{user?.userTypeLabel || 'Kullanıcı'}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Hesap</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-servers" className="flex items-center space-x-2">
                      <Server className="w-4 h-4" />
                      <span>Sunucularım</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Ayarlar</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center space-x-2 text-primary">
                          <Crown className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline">
                    <LogIn className="w-4 h-4 mr-2" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Crown className="w-4 h-4 mr-2" />
                    Admin Giriş
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-2 py-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {isAdmin ? (
                          <>
                            <Crown className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">Admin</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-medium">{user?.userTypeLabel || 'Kullanıcı'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href="/profile" className="block px-2 py-1 text-foreground hover:text-primary">
                      Hesap
                    </Link>
                    <Link href="/my-servers" className="block px-2 py-1 text-foreground hover:text-primary">
                      Sunucularım
                    </Link>
                    <Link href="/settings" className="block px-2 py-1 text-foreground hover:text-primary">
                      Ayarlar
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-2 py-1 text-primary hover:text-primary/80">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1 text-red-600 hover:text-red-700"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/signin" className="block">
                      <Button variant="outline" className="w-full">
                        <LogIn className="w-4 h-4 mr-2" />
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/auth/login" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Crown className="w-4 h-4 mr-2" />
                        Admin Giriş
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

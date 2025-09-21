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
    { name: 'Özellikler', href: '#features' },
    { name: 'Sunucu Vitrini', href: '#server-announcement' },
    { name: 'Mobil Uygulama', href: '#mobile' },
    { name: 'Destek', href: '#contact' },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-2">
              <Gamepad2 className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide text-slate-100">Oyna.gg</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Gaming Social Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-indigo-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <ModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-200 hover:border-indigo-400/40 hover:text-indigo-100">
                    <User className="h-4 w-4" />
                    <span>{user?.name || 'Kullanıcı'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border border-slate-800/50 bg-slate-900/90 text-slate-100">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {isAdmin ? (
                        <>
                          <Crown className="h-3 w-3 text-amber-300" />
                          <span className="text-xs text-amber-200 font-medium">Admin</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 text-indigo-200" />
                          <span className="text-xs text-indigo-100 font-medium">{user?.userTypeLabel || 'Kullanıcı'}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Hesap</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-servers" className="flex items-center space-x-2">
                      <Server className="h-4 w-4" />
                      <span>Sunucularım</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Ayarlar</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center space-x-2 text-indigo-200">
                          <Crown className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-rose-300 focus:text-rose-200">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" className="rounded-xl border border-slate-700/60 text-slate-200 hover:border-indigo-400/40">
                    <LogIn className="mr-2 h-4 w-4" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 text-slate-100 shadow-lg shadow-indigo-900/40">
                    <Crown className="mr-2 h-4 w-4" />
                    Admin Giriş
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ModeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl p-2 text-slate-300 hover:bg-slate-900/60 hover:text-indigo-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-slate-800/60 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-2 py-1 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-indigo-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="border-t border-slate-800/60 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-2 py-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
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
                    <Link href="/profile" className="block px-2 py-1 text-slate-300 hover:text-indigo-200">
                      Hesap
                    </Link>
                    <Link href="/my-servers" className="block px-2 py-1 text-slate-300 hover:text-indigo-200">
                      Sunucularım
                    </Link>
                    <Link href="/settings" className="block px-2 py-1 text-slate-300 hover:text-indigo-200">
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

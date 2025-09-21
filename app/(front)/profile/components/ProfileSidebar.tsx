'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { User, Bell, Gamepad2, Heart, FileText, MessageCircle, Settings, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  {
    id: 'profile',
    label: 'Kişisel Bilgiler',
    icon: User,
    description: 'Profil bilgilerinizi yönetin'
  },
  {
    id: 'notifications',
    label: 'Bildirimler',
    icon: Bell,
    description: 'Bildirim ayarlarınızı yapılandırın'
  },
  {
    id: 'servers',
    label: 'Sunucularım',
    icon: Gamepad2,
    description: 'Yönettiğiniz sunucuları görüntüleyin'
  },
  {
    id: 'favorites',
    label: 'Favori Sunucular',
    icon: Heart,
    description: 'Favori sunucularınızı yönetin'
  },
  {
    id: 'requests',
    label: 'Taleplerim',
    icon: FileText,
    description: 'Sunucu başvurularınızı takip edin'
  },
  {
    id: 'support',
    label: 'Destek Taleplerim',
    icon: MessageCircle,
    description: 'Destek taleplerini yönet'
  },
  {
    id: 'messages',
    label: 'Mesajlarım',
    icon: MessageCircle,
    description: 'Gelen mesajlarınızı görüntüleyin'
  },
  {
    id: 'settings',
    label: 'Hesap Ayarları',
    icon: Settings,
    description: 'Hesap ayarlarınızı özelleştirin'
  }
]

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    // Update URL with tab parameter
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    router.push(url.pathname + url.search, { scroll: false })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="w-80 min-h-screen space-y-6 border-r border-slate-800/60 bg-gradient-to-br from-[#0b1120] via-[#050816] to-[#03050d] p-6 shadow-xl shadow-black/30">
      {/* User Profile Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 px-6 py-8 text-center shadow-lg shadow-black/40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-slate-900/40" />
        <div className="relative space-y-5">
          {/* Avatar */}
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/40 to-slate-700/40 p-[3px] shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/80">
              <span className="text-2xl font-bold text-slate-200">
                {getInitials(user?.name || 'U')}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">{user?.name || 'Kullanıcı'}</h2>
              <p className="text-xs tracking-wide text-slate-400">{user?.email || 'email@example.com'}</p>
            </div>

            {/* Role Badge */}
            <div className="mx-auto inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-200">
              {user?.role === 'super_admin' ? (
                <>
                  <Crown className="h-3 w-3 text-amber-300" />
                  Admin
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-indigo-300" />
                  {user?.userTypeLabel || 'Kullanıcı'}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'group w-full rounded-xl border border-transparent p-3 text-left transition-all duration-200',
                isActive
                  ? 'border-indigo-500/60 bg-gradient-to-r from-indigo-600/90 to-slate-700/90 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/60 hover:text-slate-100'
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-colors duration-200',
                    isActive ? 'text-white' : 'text-indigo-300 group-hover:text-indigo-100'
                  )} 
                />
                <div className="flex-1 text-left">
                  <div className="font-medium tracking-wide">{item.label}</div>
                  <div className={cn(
                    'text-xs transition-colors duration-200',
                    isActive ? 'text-indigo-100/70' : 'text-slate-500 group-hover:text-slate-300'
                  )}>
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-5 text-center shadow-inner shadow-black/40">
        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
          Oyna.gg Platform
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Hesap yönetimini buradan kontrol edin
        </div>
      </div>
    </aside>
  )
}

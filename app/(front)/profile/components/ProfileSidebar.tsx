'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { User, Bell, Car, Heart, FileText, MessageCircle, Settings, Crown } from 'lucide-react'
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
    icon: Car,
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
  const { user, userType } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="w-80 bg-card border-r border-border p-6 space-y-6">
      {/* User Profile Summary */}
      <div className="text-center space-y-4">
        {/* Avatar */}
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">
            {getInitials(user?.name || 'U')}
          </span>
        </div>
        
        {/* User Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{user?.name || 'Kullanıcı'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email || 'email@example.com'}</p>
          
          {/* Role Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {userType === 'super_admin' ? (
              <>
                <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                Admin
              </>
            ) : (
              <>
                <User className="w-3 h-3 mr-1 text-blue-500" />
                {user?.userTypeLabel || 'Kullanıcı'}
              </>
            )}
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
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={cn(
                    "text-xs transition-colors duration-200",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground group-hover:text-muted-foreground"
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
      <div className="pt-6 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>M2Rehberi Platform</p>
          <p>Hesap Yönetimi</p>
        </div>
      </div>
    </div>
  )
}

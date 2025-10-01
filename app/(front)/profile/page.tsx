'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProfileSidebar } from './components/ProfileSidebar'
import { PersonalInfo } from './components/PersonalInfo'
import { Notifications } from './components/Notifications'
import { MyServers } from './components/MyServers'
import { FavoriteServers } from './components/FavoriteServer/FavoriteServers'
import { MyRequests } from './components/MyRequests'
import { ModeToggle } from '@/components/mode-toggle'
import SupportTicketsSection from './components/Support/SupportTickets'
import { useAuth } from '@/contexts/auth-context'
import { User, Bell, Gamepad2, Heart, FileText, MessageCircle, Settings } from 'lucide-react'

const tabMeta: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  profile: {
    title: 'Kişisel Bilgiler',
    description: 'Profil detaylarını güncelle ve hesabını güçlendir.',
    icon: User
  },
  notifications: {
    title: 'Bildirimler',
    description: 'Bildirim tercihlerini özelleştir, hiçbir güncellemeyi kaçırma.',
    icon: Bell
  },
  servers: {
    title: 'Sunucularım',
    description: 'Yönettiğin sunucuları yönet ve performanslarını takip et.',
    icon: Gamepad2
  },
  favorites: {
    title: 'Favori Sunucular',
    description: 'Takip ettiğin sunucuları tek ekranda görüntüle.',
    icon: Heart
  },
  requests: {
    title: 'Taleplerim',
    description: 'Sunucu ve rol taleplerinin durumunu takip et.',
    icon: FileText
  },
  support: {
    title: 'Destek Taleplerim',
    description: 'Destek kayıtlarını ve yanıtlarını buradan kontrol et.',
    icon: MessageCircle
  },
  settings: {
    title: 'Hesap Ayarları',
    description: 'Hesap ayarlarını yapılandır ve deneyimini kişiselleştir.',
    icon: Settings
  }
}

function ProfileContent() {
  const [activeTab, setActiveTab] = useState('profile')
  const [openNewServer, setOpenNewServer] = useState(false)
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const activeMeta = tabMeta[activeTab] ?? tabMeta.profile

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'notifications', 'servers', 'favorites', 'requests', 'support', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInfo />
      case 'notifications':
        return <Notifications />
      case 'servers':
        return <MyServers openNewServer={openNewServer} setOpenNewServer={setOpenNewServer} />
      case 'favorites':
        return <FavoriteServers />
      case 'requests':
        return <MyRequests />
      case 'support':
        return <SupportTicketsSection />
      case 'settings':
        return (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-10 text-center shadow-xl shadow-black/30">
            <h2 className="text-2xl font-semibold text-slate-100">Hesap Ayarları</h2>
            <p className="mt-2 text-sm text-slate-400">Hesap ayarlarınızı kısa süre içinde buradan yönetebileceksiniz.</p>
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/60 px-5 py-2 text-xs uppercase tracking-[0.35em] text-slate-400">
              Yakında
            </div>
          </div>
        )
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#060913] via-[#050716] to-[#01020b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),transparent_55%)]" />

      <div className="relative flex min-h-screen">
        {/* Left Sidebar */}
        <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
            <div className="mb-10 overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 p-8 shadow-2xl shadow-black/40">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200/70">
                    {(() => {
                      const Icon = activeMeta.icon
                      return <Icon className="h-5 w-5 text-indigo-300" />
                    })()}
                    <span>{activeMeta.title}</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-slate-100">Merhaba, {user?.name || 'Oyuncu'}</h1>
                    <p className="max-w-2xl text-sm text-slate-400">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-200/70">Rol</p>
                    <p className="mt-1 text-lg font-semibold text-slate-100">{user?.userTypeLabel || 'Kullanıcı'}</p>
                  </div>
                  <ModeToggle />
                </div>
              </div>
            </div>

            <section className="space-y-8">
              {renderContent()}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  )
}

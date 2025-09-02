'use client'

import React, { useState } from 'react'
import { LandingNavbar } from '@/components/landing/navbar'
import { ProfileSidebar } from './components/ProfileSidebar'
import { PersonalInfo } from './components/PersonalInfo'
import { Notifications } from './components/Notifications'
import { MyServers } from './components/MyServers'
import { FavoriteServers } from './components/FavoriteServers'
import { MyRequests } from './components/MyRequests'
import { ModeToggle } from '@/components/mode-toggle'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInfo />
      case 'notifications':
        return <Notifications />
      case 'servers':
        return <MyServers />
      case 'favorites':
        return <FavoriteServers />
      case 'requests':
        return <MyRequests />
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Hesap Ayarları</h1>
                <p className="text-muted-foreground">Hesap ayarlarınızı özelleştirin</p>
              </div>
              <ModeToggle />
            </div>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Bu özellik yakında eklenecek...</p>
            </div>
          </div>
        )
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="flex">
        {/* Left Sidebar */}
        <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { User, Mail, Calendar, Shield, CheckCircle, Edit, Save, X } from 'lucide-react'

export function PersonalInfo() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-100">Kişisel Bilgiler</h2>
          <p className="text-sm text-slate-400">Profilini güncelle, bilgilerini her zaman güncel tut.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Düzenle</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ad Soyad */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-3">
              <User className="h-5 w-5 text-indigo-200" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Ad Soyad</p>
                {isEditing ? (
                  <div className="mt-3 flex gap-2">
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ad"
                      className="h-10 rounded-xl border border-indigo-500/20 bg-slate-900/60 text-slate-100 focus:border-indigo-400 focus:ring-indigo-400"
                    />
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Soyad"
                      className="h-10 rounded-xl border border-indigo-500/20 bg-slate-900/60 text-slate-100 focus:border-indigo-400 focus:ring-indigo-400"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-slate-100">{user?.name || 'Ad Soyad'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* E-posta */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-500/20 p-3">
              <Mail className="h-5 w-5 text-amber-200" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">E-posta</p>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-posta adresiniz"
                    className="mt-3 h-10 rounded-xl border border-indigo-500/20 bg-slate-900/60 text-slate-100 focus:border-indigo-400 focus:ring-indigo-400"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-100">{user?.email || 'email@example.com'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Üyelik Tarihi */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-slate-500/20 p-3">
              <Calendar className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Üyelik Tarihi</p>
              <p className="mt-3 text-lg font-semibold text-slate-100">18 Ocak 2025</p>
            </div>
          </div>
        </div>

        {/* Hesap Türü */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-slate-500/20 p-3">
              <Shield className="h-5 w-5 text-purple-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Hesap Türü</p>
              <p className="mt-3 text-lg font-semibold text-slate-100">{user?.userType === 'admin' ? 'Admin Hesabı' : 'Kullanıcı Hesabı'}</p>
            </div>
          </div>
        </div>

        {/* Hesap Durumu */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-slate-500/20 p-3">
              <CheckCircle className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Hesap Durumu</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
                Aktif
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* E-posta Doğrulama */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-slate-500/20 p-3">
              <CheckCircle className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">E-posta Doğrulama</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
                Doğrulanmış
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-200 hover:border-slate-500"
          >
            <X className="h-4 w-4" />
            <span>İptal</span>
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2 rounded-xl">
            <Save className="h-4 w-4" />
            <span>Kaydet</span>
          </Button>
        </div>
      )}
    </div>
  )
}

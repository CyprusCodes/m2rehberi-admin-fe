'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kişisel Bilgiler</h1>
          <p className="text-muted-foreground">Profil bilgilerinizi yönetin ve güncelleyin</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Düzenle</span>
            </Button>
          )}
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ad Soyad */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Ad Soyad</p>
                {isEditing ? (
                  <div className="flex space-x-2 mt-1">
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ad"
                      className="w-24 h-8"
                    />
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Soyad"
                      className="w-24 h-8"
                    />
                  </div>
                ) : (
                  <p className="text-base font-semibold text-foreground">
                    {user?.name || 'Ad Soyad'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E-posta */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">E-posta</p>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-posta adresiniz"
                    className="mt-1 h-8"
                  />
                ) : (
                  <p className="text-base font-semibold text-foreground">
                    {user?.email || 'email@example.com'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Üyelik Tarihi */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Üyelik Tarihi</p>
                <p className="text-base font-semibold text-foreground">
                  18 Ocak 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hesap Türü */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hesap Türü</p>
                <p className="text-base font-semibold text-foreground">
                  {user?.userType === 'admin' ? 'Admin Hesabı' : 'Kullanıcı Hesabı'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hesap Durumu */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hesap Durumu</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                    Aktif
                  </span>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E-posta Doğrulama */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-posta Doğrulama</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                    Doğrulanmış
                  </span>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>İptal</span>
          </Button>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </Button>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, Plus, Edit, Trash2, Eye, Users, Globe, Calendar } from 'lucide-react'

interface ServerData {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  players: number
  maxPlayers: number
  website?: string
  discord?: string
  createdAt: string
  updatedAt: string
}

export function MyServers() {
  const [servers, setServers] = useState<ServerData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch user servers from API
    // fetchUserServers()
    setIsLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default', text: 'Aktif', color: 'bg-green-500' },
      inactive: { variant: 'secondary', text: 'Pasif', color: 'bg-gray-500' },
      pending: { variant: 'outline', text: 'Beklemede', color: 'bg-yellow-500' },
      rejected: { variant: 'destructive', text: 'Reddedildi', color: 'bg-red-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    
    return (
      <Badge variant={config.variant as any} className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const handleCreateServer = () => {
    // TODO: Navigate to server creation form
    console.log('Create server clicked')
  }

  const handleEditServer = (serverId: number) => {
    // TODO: Navigate to server edit form
    console.log('Edit server clicked:', serverId)
  }

  const handleDeleteServer = (serverId: number) => {
    // TODO: Show confirmation dialog and delete server
    console.log('Delete server clicked:', serverId)
  }

  const handleViewServer = (serverId: number) => {
    // TODO: Navigate to server detail page
    console.log('View server clicked:', serverId)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Sunucular yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sunucularım</h1>
          <p className="text-muted-foreground">Yönettiğiniz sunucuları görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-3"> 
          <Button onClick={handleCreateServer} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Sunucu Ekle</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Sunucu</p>
                <p className="text-2xl font-bold text-foreground">{servers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Sunucu</p>
                <p className="text-2xl font-bold text-foreground">
                  {servers.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Oyuncu</p>
                <p className="text-2xl font-bold text-foreground">
                  {servers.reduce((sum, s) => sum + s.players, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold text-foreground">
                  {servers.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servers List */}
      {servers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz sunucunuz yok</h3>
              <p className="text-muted-foreground mb-4">
                İlk sunucunuzu ekleyerek başlayın ve oyuncuları çekmeye başlayın
              </p>
              <Button onClick={handleCreateServer} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Sunucu Ekle</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {servers.map((server) => (
            <Card key={server.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                      {getStatusBadge(server.status)}
                    </div>
                    <p className="text-muted-foreground">{server.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{server.players}/{server.maxPlayers} Oyuncu</span>
                      </div>
                      {server.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </div>
                      )}
                      {server.discord && (
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-500">Discord</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewServer(server.id)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Görüntüle</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditServer(server.id)}
                      className="flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Düzenle</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteServer(server.id)}
                      className="flex items-center space-x-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Sil</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

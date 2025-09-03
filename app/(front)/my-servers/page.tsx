'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { LandingNavbar } from '@/components/landing/navbar'
import { Server, Plus, Edit, Trash2, Eye, Settings, Users, Globe, Calendar } from 'lucide-react'
import { frontendServerEndpoints } from '@/lib/endpoints'

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

export default function MyServersPage() {
  const { user } = useAuth()
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
    console.log('Create server clicked')
  }

  const handleEditServer = (serverId: number) => {
    console.log('Edit server clicked:', serverId)
  }

  const handleDeleteServer = (serverId: number) => {
    console.log('Delete server clicked:', serverId)
  }

  const handleViewServer = (serverId: number) => {
    console.log('View server clicked:', serverId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Sunucular yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Sunucularım</h1>
              <p className="text-muted-foreground">Yönettiğiniz sunucuları görüntüleyin ve yönetin</p>
            </div>
            <Button onClick={handleCreateServer} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Sunucu Ekle</span>
            </Button>
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
                    <p className="text-2xl font-bold">{servers.length}</p>
                    <p className="text-sm text-muted-foreground">Toplam Sunucu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {servers.reduce((acc, server) => acc + server.players, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Toplam Oyuncu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {servers.filter(s => s.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Aktif Sunucu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {servers.filter(s => s.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Bekleyen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Servers List */}
          {servers.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">
                    Henüz sunucunuz yok
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    İlk sunucunuzu ekleyerek M2Rehberi platformunda yerinizi alın. 
                    Sunucunuzu eklemek için yukarıdaki "Sunucu Ekle" butonuna tıklayın.
                  </p>
                  <Button onClick={handleCreateServer} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Sunucunuzu Ekleyin
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {servers.map((server) => (
                <Card key={server.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{server.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {server.description}
                        </CardDescription>
                      </div>
                      {getStatusBadge(server.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Server Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{server.players}/{server.maxPlayers} Oyuncu</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(server.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    {/* Links */}
                    {(server.website || server.discord) && (
                      <div className="flex space-x-2">
                        {server.website && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={server.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4 mr-1" />
                              Website
                            </a>
                          </Button>
                        )}
                        {server.discord && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={server.discord} target="_blank" rel="noopener noreferrer">
                              Discord
                            </a>
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewServer(server.id)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditServer(server.id)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteServer(server.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

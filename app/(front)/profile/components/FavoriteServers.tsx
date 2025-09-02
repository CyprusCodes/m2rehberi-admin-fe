'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Globe, Calendar, Star, Eye, Trash2 } from 'lucide-react'

interface FavoriteServer {
  id: number
  name: string
  description: string
  players: number
  maxPlayers: number
  rating: number
  website?: string
  discord?: string
  addedAt: string
}

export function FavoriteServers() {
  const [favorites, setFavorites] = useState<FavoriteServer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch favorite servers from API
    // fetchFavoriteServers()
    setIsLoading(false)
  }, [])

  const handleRemoveFavorite = (serverId: number) => {
    // TODO: Remove from favorites
    setFavorites(prev => prev.filter(fav => fav.id !== serverId))
  }

  const handleViewServer = (serverId: number) => {
    // TODO: Navigate to server detail page
    console.log('View server clicked:', serverId)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Favoriler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Favori Sunucular</h1>
          <p className="text-muted-foreground">Beğendiğiniz sunucuları takip edin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Favori</p>
                <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Oyuncu</p>
                <p className="text-2xl font-bold text-foreground">
                  {favorites.reduce((acc, server) => acc + server.players, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ortalama Puan</p>
                <p className="text-2xl font-bold text-foreground">
                  {favorites.length > 0 
                    ? (favorites.reduce((acc, server) => acc + server.rating, 0) / favorites.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz favori sunucunuz yok</h3>
              <p className="text-muted-foreground mb-4">
                Beğendiğiniz sunucuları favorilere ekleyerek kolayca takip edin
              </p>
              <Button className="flex items-center space-x-2 mx-auto">
                <Globe className="w-4 h-4" />
                <span>Sunucu Ara</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((server) => (
            <Card key={server.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-foreground">{server.rating}</span>
                      </div>
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
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(server.addedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
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
                      onClick={() => handleRemoveFavorite(server.id)}
                      className="flex items-center space-x-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Favorilerden Çıkar</span>
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

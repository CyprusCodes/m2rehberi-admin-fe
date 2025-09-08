'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Users, Star } from 'lucide-react'

interface FavoriteServer {
  id: number
  name: string
  status: 'online' | 'offline' | 'maintenance'
  coverImageUrl?: string
  rating: number
  likeCount: number
  commentCount: number
  addedAt: string
}

interface StatsProps {
  favorites: FavoriteServer[]
}

export function Stats({ favorites }: StatsProps) {
  const totalLikes = favorites.reduce((acc, server) => acc + server.likeCount, 0)
  const totalComments = favorites.reduce((acc, server) => acc + server.commentCount, 0)
  const averageRating = favorites.length > 0 
    ? (favorites.reduce((acc, server) => acc + server.rating, 0) / favorites.length).toFixed(1)
    : '0'

  return (
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Beğeni</p>
              <p className="text-2xl font-bold text-foreground">{totalLikes}</p>
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
              <p className="text-2xl font-bold text-foreground">{averageRating}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

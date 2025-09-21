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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border border-slate-800/60 bg-slate-900/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Toplam Favori</p>
              <p className="text-2xl font-semibold text-slate-100">{favorites.length}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-rose-500/20 to-slate-500/20 p-3">
              <Heart className="h-5 w-5 text-rose-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-800/60 bg-slate-900/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Toplam Beğeni</p>
              <p className="text-2xl font-semibold text-slate-100">{totalLikes}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-3">
              <Users className="h-5 w-5 text-indigo-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-800/60 bg-slate-900/60">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Ortalama Puan</p>
              <p className="text-2xl font-semibold text-slate-100">{averageRating}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-500/20 p-3">
              <Star className="h-5 w-5 text-amber-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

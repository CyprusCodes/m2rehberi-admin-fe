'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Globe, Search } from 'lucide-react'

interface EmptyStateProps {
  onSearchServers?: () => void
}

export function EmptyState({ onSearchServers }: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border border-slate-800/60 bg-slate-900/50 shadow-xl shadow-black/30">
      <CardContent className="py-16">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-slate-500/20">
            <Heart className="h-10 w-10 text-rose-200" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-100">Henüz favori sunucunuz yok</h3>
            <p className="mx-auto max-w-md text-sm text-slate-400">
              Beğendiğiniz yayınları ve sunucuları favorilere ekleyerek Oyna.gg ana sayfanızda hızlıca erişin.
            </p>
          </div>
          {onSearchServers && (
            <Button
              onClick={onSearchServers}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 px-5 py-2 shadow-lg shadow-indigo-900/40"
            >
              <Search className="h-4 w-4" />
              Sunucuları Keşfet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

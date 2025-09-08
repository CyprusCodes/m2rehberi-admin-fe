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
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Henüz favori sunucunuz yok
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Beğendiğiniz sunucuları favorilere ekleyerek kolayca takip edin ve 
            burada görüntüleyin.
          </p>
          
          
        </div>
      </CardContent>
    </Card>
  )
}

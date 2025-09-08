'use client'

import React from 'react'

interface HeaderProps {
  totalFavorites: number
}

export function Header({ totalFavorites }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favori Sunucular</h1>
        <p className="text-muted-foreground">
          Beğendiğiniz sunucuları takip edin ({totalFavorites} sunucu)
        </p>
      </div>
    </div>
  )
}

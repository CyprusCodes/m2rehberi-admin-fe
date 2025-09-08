'use client'

import React from 'react'

export function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Favoriler yükleniyor...</p>
    </div>
  )
}

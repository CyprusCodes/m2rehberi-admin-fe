'use client'

import React from 'react'

export function LoadingState() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-400" />
        <p className="text-sm text-slate-400">Favoriler yükleniyor...</p>
      </div>
    </div>
  )
}

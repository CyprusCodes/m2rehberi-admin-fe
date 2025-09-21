'use client'

import React from 'react'

interface HeaderProps {
  totalFavorites: number
}

export function Header({ totalFavorites }: HeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-xl shadow-black/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Oyna.gg Favorileri</h1>
          <p className="text-sm text-slate-400">Beğendiğiniz sunucuları tek panelden yönetin</p>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {totalFavorites} sunucu
        </div>
      </div>
    </div>
  )
}

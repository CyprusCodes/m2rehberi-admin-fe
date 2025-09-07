"use client"

import React from "react"

export interface ServerRow {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  players?: number
  maxPlayers?: number
  website?: string
  discord?: string
  createdAt: string
  updatedAt: string
}

export function ServerTable({ servers, onView, onEdit, onDelete }: {
  servers: ServerRow[]
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Ad</th>
            <th className="text-left p-3">Durum</th>
            <th className="text-left p-3">Oluşturma</th>
            <th className="text-left p-3">Güncelleme</th>
            <th className="text-right p-3">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3 font-medium text-foreground">{s.name}</td>
              <td className="p-3 capitalize text-muted-foreground">{s.status}</td>
              <td className="p-3 text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('tr-TR')}</td>
              <td className="p-3 text-muted-foreground">{new Date(s.updatedAt).toLocaleDateString('tr-TR')}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <button className="underline" onClick={() => onView(s.id)}>Görüntüle</button>
                  <button className="underline" onClick={() => onEdit(s.id)}>Düzenle</button>
                  <button className="underline text-destructive" onClick={() => onDelete(s.id)}>Sil</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


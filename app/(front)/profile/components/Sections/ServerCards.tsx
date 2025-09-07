"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Users, Globe } from "lucide-react"

export interface ServerItem {
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

export function ServerCards({ servers, onView, onEdit, onDelete }: {
  servers: ServerItem[]
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  const getStatusClasses = (status: ServerItem['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {servers.map((server) => (
        <Card key={server.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{server.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusClasses(server.status)}`}>{server.status}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{server.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {typeof server.players === 'number' && typeof server.maxPlayers === 'number' && (
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />{server.players}/{server.maxPlayers}</div>
                  )}
                  {server.website && (
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4" />Website</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(server.id)}><Eye className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(server.id)}><Edit className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(server.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


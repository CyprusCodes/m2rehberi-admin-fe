"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Pencil } from "lucide-react"

interface ConnectionsProps {
  server: any
  editingField: string | null
  editValue: string
  saving: boolean
  onStartEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onEditValueChange: (value: string) => void
}

export default function Connections({
  server,
  editingField,
  editValue,
  saving,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onEditValueChange
}: ConnectionsProps) {
  return (
    <Card className="border border-slate-800/60 bg-slate-900/60 shadow-lg shadow-black/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <ExternalLink className="h-5 w-5 text-indigo-200" />
          Bağlantılar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-slate-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Discord</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("discordLink", server.discord_link)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          {editingField === "discordLink" ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="url"
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                placeholder="Discord linki"
                className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving} className="rounded-xl">
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing} className="rounded-xl border border-slate-700/60 text-slate-200">
                  İptal
                </Button>
              </div>
            </div>
          ) : server.discord_link ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3">
              <span className="truncate text-sm text-slate-200">{server.discord_link}</span>
              <Button variant="ghost" size="sm" asChild className="text-indigo-200 hover:text-indigo-100">
                <a href={server.discord_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Discord linki eklenmemiş</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Website</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("websiteLink", server.website_link)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          {editingField === "websiteLink" ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="url"
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                placeholder="Website linki"
                className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving} className="rounded-xl">
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing} className="rounded-xl border border-slate-700/60 text-slate-200">
                  İptal
                </Button>
              </div>
            </div>
          ) : server.website_link ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3">
              <span className="truncate text-sm text-slate-200">{server.website_link}</span>
              <Button variant="ghost" size="sm" asChild className="text-indigo-200 hover:text-indigo-100">
                <a href={server.website_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Website linki eklenmemiş</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

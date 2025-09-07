"use client"

import { Button } from "@/components/ui/button"
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          Bağlantılar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Discord</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("discordLink", server.discord_link)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          {editingField === "discordLink" ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
                placeholder="Discord linki"
              />
              <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                Kaydet
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEditing}>
                İptal
              </Button>
            </div>
          ) : server.discord_link ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm truncate">{server.discord_link}</span>
              <Button variant="ghost" size="sm" asChild>
                <a href={server.discord_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Discord linki eklenmemiş</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Website</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("websiteLink", server.website_link)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          {editingField === "websiteLink" ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
                placeholder="Website linki"
              />
              <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                Kaydet
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEditing}>
                İptal
              </Button>
            </div>
          ) : server.website_link ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm truncate">{server.website_link}</span>
              <Button variant="ghost" size="sm" asChild>
                <a href={server.website_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Website linki eklenmemiş</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

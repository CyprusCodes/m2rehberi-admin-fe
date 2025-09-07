"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Pencil } from "lucide-react"

interface ServerRulesProps {
  server: any
  editingField: string | null
  editValue: string
  saving: boolean
  onStartEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onEditValueChange: (value: string) => void
}

export default function ServerRules({
  server,
  editingField,
  editValue,
  saving,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onEditValueChange
}: ServerRulesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sunucu Kuralları
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartEditing("serverRules", server.server_rules)}
            className="h-6 w-6 p-0"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {editingField === "serverRules" ? (
          <div className="space-y-3">
            <textarea
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm min-h-[120px]"
              placeholder="Sunucu kurallarınızı buraya yazın... (HTML desteklenir)"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                Kaydet
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEditing}>
                İptal
              </Button>
            </div>
          </div>
        ) : server.server_rules ? (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: server.server_rules }}
          />
        ) : (
          <p className="text-muted-foreground text-sm">Henüz sunucu kuralları eklenmemiş</p>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Pencil } from "lucide-react"

interface DescriptionProps {
  server: any
  editingField: string | null
  editValue: string
  saving: boolean
  onStartEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onEditValueChange: (value: string) => void
}

export default function Description({
  server,
  editingField,
  editValue,
  saving,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onEditValueChange
}: DescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Sunucu Açıklaması
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartEditing("description", server.description)}
            className="h-6 w-6 p-0"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {editingField === "description" ? (
          <div className="space-y-3">
            <textarea
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm min-h-[200px]"
              placeholder="Sunucu açıklamanızı buraya yazın... (HTML desteklenir)"
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
        ) : server.description ? (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: server.description }}
          />
        ) : (
          <p className="text-muted-foreground text-sm">Henüz sunucu açıklaması eklenmemiş</p>
        )}
      </CardContent>
    </Card>
  )
}

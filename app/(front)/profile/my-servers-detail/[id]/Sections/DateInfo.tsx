"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Pencil, Timer } from "lucide-react"

interface DateInfoProps {
  server: any
  editingField: string | null
  editValue: string
  editDateTime: string
  saving: boolean
  onStartEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onEditValueChange: (value: string) => void
  onEditDateTimeChange: (value: string) => void
  isScheduledForFuture: (srv: any) => boolean
  getFutureDisplayDate: (srv: any) => string
}

export default function DateInfo({
  server,
  editingField,
  editValue,
  editDateTime,
  saving,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onEditValueChange,
  onEditDateTimeChange,
  isScheduledForFuture,
  getFutureDisplayDate
}: DateInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Tarih Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {server.created_at && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Oluşturulma</p>
              <p className="text-lg">{new Date(server.created_at).toLocaleDateString("tr-TR")}</p>
            </div>
          )}
          {server.updated_at && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Son Güncelleme</p>
              <p className="text-lg">{new Date(server.updated_at).toLocaleDateString("tr-TR")}</p>
            </div>
          )}
          {server.approved_at && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Onaylanma</p>
              <p className="text-lg">{new Date(server.approved_at).toLocaleDateString("tr-TR")}</p>
            </div>
          )}
        </div>
        
        {/* Future Scheduling Information */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">Gelecek Tarih Ayarları</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("showTimeStatus", server.show_time_status === 1)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          
          {editingField === "showTimeStatus" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editValue === "true"}
                  onChange={(e) => onEditValueChange(e.target.checked.toString())}
                  className="rounded"
                />
                <label className="text-sm">Gelecek tarihte göster</label>
              </div>
              {editValue === "true" && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Gösterim Tarihi
                  </label>
                  <input
                    type="datetime-local"
                    value={editDateTime}
                    onChange={(e) => onEditDateTimeChange(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            </div>
          ) : isScheduledForFuture(server) ? (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200">Gelecek Tarihte Gösterilecek</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Bu sunucu <strong>{getFutureDisplayDate(server)}</strong> tarihinde gösterilecektir.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sunucu şu anda aktif olarak gösteriliyor</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

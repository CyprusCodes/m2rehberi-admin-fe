"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Calendar, Pencil } from "lucide-react"
import { OynaGG_SYSTEMS, OynaGG_FEATURES, OynaGG_EVENTS } from "@/lib/helpersConstants"

interface SystemsFeaturesEventsProps {
  server: any
  editingField: string | null
  editArray: string[]
  saving: boolean
  onStartArrayEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onToggleArrayItem: (item: string) => void
  toArray: (items: any) => string[]
}

export default function SystemsFeaturesEvents({
  server,
  editingField,
  editArray,
  saving,
  onStartArrayEditing,
  onSaveEdit,
  onCancelEditing,
  onToggleArrayItem,
  toArray
}: SystemsFeaturesEventsProps) {
  const systems = toArray(server.systems)
  const features = toArray(server.features)
  const events = toArray(server.events)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sistemler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Sistemler
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartArrayEditing("systems", server.systems)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingField === "systems" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {OynaGG_SYSTEMS.map((system) => (
                  <label key={system} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editArray.includes(system)}
                      onChange={() => onToggleArrayItem(system)}
                      className="rounded"
                    />
                    {system}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            </div>
          ) : systems.length > 0 ? (
            <div className="space-y-2">
              {systems.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  {item}
                </div>
              ))}
              {systems.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2">+{systems.length - 6} sistem daha</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Henüz sistem eklenmemiş</p>
          )}
        </CardContent>
      </Card>

      {/* Özellikler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Özellikler
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartArrayEditing("features", server.features)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingField === "features" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {OynaGG_FEATURES.map((feature) => (
                  <label key={feature} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editArray.includes(feature)}
                      onChange={() => onToggleArrayItem(feature)}
                      className="rounded"
                    />
                    {feature}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            </div>
          ) : features.length > 0 ? (
            <div className="space-y-2">
              {features.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                  {item}
                </div>
              ))}
              {features.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2">+{features.length - 6} özellik daha</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Henüz özellik eklenmemiş</p>
          )}
        </CardContent>
      </Card>

      {/* Eventlar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Eventlar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartArrayEditing("events", server.events)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingField === "events" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {OynaGG_EVENTS.map((event) => (
                  <label key={event} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editArray.includes(event)}
                      onChange={() => onToggleArrayItem(event)}
                      className="rounded"
                    />
                    {event}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-2">
              {events.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  {item}
                </div>
              ))}
              {events.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2">+{events.length - 6} event daha</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Henüz event eklenmemiş</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

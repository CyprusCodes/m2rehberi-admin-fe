"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Pencil, Image } from "lucide-react"
import { LEVEL_RANGES, DIFFICULTY_LEVELS, SERVER_TYPES } from "@/lib/helpersConstants"
import { fetchActiveTags, type Tag } from "@/services/tags"

interface GeneralInfoProps {
  server: any
  editingField: string | null
  editValue: string
  saving: boolean
  onStartEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onEditValueChange: (value: string) => void
}

export default function GeneralInfo({
  server,
  editingField,
  editValue,
  saving,
  onStartEditing,
  onSaveEdit,
  onCancelEditing,
  onEditValueChange
}: GeneralInfoProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(false)

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoadingTags(true)
        const res = await fetchActiveTags()
        setTags(res.data || [])
      } catch (e) {
        console.error('Error fetching tags:', e)
      } finally {
        setLoadingTags(false)
      }
    }
    loadTags()
  }, [])

  const getTagColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500'
      case 'blue': return 'bg-blue-500'
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'purple': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Genel Bilgiler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Server Cover Image */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">Sunucu Kapak Resmi</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEditing("serverCoverImageUrl", server.server_cover_image_url)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          {editingField === "serverCoverImageUrl" ? (
            <div className="space-y-3">
              <input
                type="url"
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
              {editValue && (
                <div className="relative w-96 h-32 rounded-lg overflow-hidden border">
                  <img
                    src={editValue}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
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
          ) : server.server_cover_image_url ? (
            <div className="space-y-2">
              <div className="relative w-96 h-32 rounded-lg overflow-hidden border">
                <img
                  src={server.server_cover_image_url}
                  alt="Server Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground/20 break-all">{server.server_cover_image_url}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <Image className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Kapak resmi eklenmemiş</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Level Aralığı</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEditing("serverLevelRange", server.server_level_range)}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {editingField === "serverLevelRange" ? (
              <div className="flex gap-2">
                <select
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                >
                  <option value="">Seçiniz</option>
                  {LEVEL_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            ) : (
              <p className="text-lg">{server.server_level_range || "-"}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Zorluk Seviyesi</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEditing("serverDifficulty", server.server_difficulty)}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {editingField === "serverDifficulty" ? (
              <div className="flex gap-2">
                <select
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                >
                  <option value="">Seçiniz</option>
                  {DIFFICULTY_LEVELS.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            ) : (
              <p className="text-lg">{server.server_difficulty || "-"}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Server Tipi</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEditing("serverType", server.server_type)}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {editingField === "serverType" ? (
              <div className="flex gap-2">
                <select
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                >
                  <option value="">Seçiniz</option>
                  {SERVER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            ) : (
              <p className="text-lg">{server.server_type || "-"}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Tag</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEditing("tagId", server.tag_id)}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {editingField === "tagId" ? (
              <div className="flex gap-2">
                <Select
                  value={editValue || "none"}
                  onValueChange={(value) => onEditValueChange(value === "none" ? "" : value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Tag seçin (opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tag seçmeyin</SelectItem>
                    {loadingTags && (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Tag'ler yükleniyor...
                        </div>
                      </SelectItem>
                    )}
                    {!loadingTags &&
                      tags.map((tag) => (
                        <SelectItem key={tag.tagId} value={String(tag.tagId)}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getTagColor(tag.color)}`} />
                            <span>{tag.name}</span>
                            {tag.description && (
                              <span className="text-xs text-muted-foreground ml-1">
                                - {tag.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                  Kaydet
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEditing}>
                  İptal
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {server.tag_name ? (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTagColor(tags.find(t => t.tagId === server.tag_id)?.color || 'gray')}`} />
                    {server.tag_name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Tag seçilmedi</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

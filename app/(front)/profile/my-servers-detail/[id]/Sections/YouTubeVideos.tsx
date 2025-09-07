"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, ExternalLink, Pencil, Plus, X } from "lucide-react"

interface YouTubeVideosProps {
  server: any
  editingField: string | null
  editArray: string[]
  saving: boolean
  onStartArrayEditing: (field: string, currentValue: any) => void
  onSaveEdit: () => void
  onCancelEditing: () => void
  onToggleArrayItem: (item: string) => void
}

export default function YouTubeVideos({ 
  server, 
  editingField, 
  editArray, 
  saving, 
  onStartArrayEditing, 
  onSaveEdit, 
  onCancelEditing, 
  onToggleArrayItem 
}: YouTubeVideosProps) {
  const [newLink, setNewLink] = useState("")

  const addNewLink = () => {
    if (newLink.trim() && !editArray.includes(newLink.trim())) {
      onToggleArrayItem(newLink.trim())
      setNewLink("")
    }
  }

  const removeLink = (link: string) => {
    onToggleArrayItem(link)
  }

  const isEditing = editingField === "youtubeLinks"
  const displayLinks = isEditing ? editArray : (server.youtube_links || [])

  if (!isEditing && (!server.youtube_links || !Array.isArray(server.youtube_links) || server.youtube_links.length === 0)) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            YouTube Videoları
          </CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartArrayEditing("youtubeLinks", server.youtube_links)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* Add new link */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border rounded text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addNewLink()}
              />
              <Button size="sm" onClick={addNewLink} disabled={!newLink.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Current links */}
            <div className="space-y-2">
              {editArray.map((link: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{link}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeLink(link)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Save/Cancel buttons */}
            <div className="flex gap-2">
              <Button size="sm" onClick={onSaveEdit} disabled={saving}>
                Kaydet
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEditing}>
                İptal
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayLinks.map((link: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm truncate flex-1">{link}</span>
                <Button variant="ghost" size="sm" asChild>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Star, Eye, Trash2, Calendar, Server } from "lucide-react"
import Image from "next/image"

interface FavoriteServer {
  id: number
  name: string
  status: "online" | "offline" | "maintenance"
  coverImageUrl?: string
  rating: number
  likeCount: number
  commentCount: number
  addedAt: string
}

interface ServerListProps {
  favorites: FavoriteServer[]
  onViewServer: (serverId: number) => void
  onRemoveFavorite: (serverId: number) => void
}

const getStatusText = (status: string) => {
  switch (status) {
    case "online":
      return "Çevrimiçi"
    case "offline":
      return "Çevrimdışı"
    case "maintenance":
      return "Bakımda"
    default:
      return "Bilinmiyor"
  }
}

const getStatusDot = (status: string) => {
  switch (status) {
    case "online":
      return "bg-emerald-400"
    case "offline":
      return "bg-rose-400"
    case "maintenance":
      return "bg-amber-300"
    default:
      return "bg-slate-400"
  }
}

export function ServerList({ favorites, onViewServer, onRemoveFavorite }: ServerListProps) {
  return (
    <div className="space-y-4">
      {favorites.map((server) => (
        <Card
          key={server.id}
          className="group overflow-hidden border border-slate-800/60 bg-slate-900/60 shadow-lg shadow-black/30 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/70 hover:-translate-y-1"
        >
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl lg:h-auto lg:w-72 lg:rounded-none">
                {server.coverImageUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={server.coverImageUrl || "/placeholder.svg"}
                      alt={server.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 288px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-slate-700 to-slate-900">
                    <Server className="h-8 w-8 text-slate-100" />
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <Badge className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-100">
                    <span className={`h-2 w-2 rounded-full ${getStatusDot(server.status)} animate-pulse`} />
                    {getStatusText(server.status)}
                  </Badge>
                </div>

                <div className="absolute right-4 top-4">
                  <Badge className="rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-100">
                    <Heart className="mr-1 h-3 w-3 fill-current" />
                    Favori
                  </Badge>
                </div>
              </div>

              <div className="flex-1 p-6 lg:p-8">
                <div className="flex h-full flex-col">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-3 text-2xl font-semibold text-slate-100 transition-colors duration-200 group-hover:text-indigo-200">
                        {server.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1">
                          <Star className="h-4 w-4 text-amber-300" />
                          <span className="font-semibold text-slate-100">{server.rating.toFixed(1)}</span>
                          <span className="text-xs">rating</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1">
                          <Heart className="h-4 w-4 text-rose-300" />
                          <span className="font-semibold text-slate-100">{server.likeCount}</span>
                          <span className="text-xs">beğeni</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1">
                          <MessageCircle className="h-4 w-4 text-indigo-200" />
                          <span className="font-semibold text-slate-100">{server.commentCount}</span>
                          <span className="text-xs">yorum</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4 text-indigo-200" />
                      <span className="font-medium text-slate-100">
                        {new Date(server.addedAt).toLocaleDateString("tr-TR")} tarihinde beğenildi
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => onViewServer(server.id)}
                        className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:border-indigo-400/40 hover:bg-slate-900/70"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Görüntüle</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onRemoveFavorite(server.id)}
                        className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Kaldır</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

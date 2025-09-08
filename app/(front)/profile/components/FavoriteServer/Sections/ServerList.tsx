"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Star, Eye, Trash2, Calendar, Server, Zap } from "lucide-react"
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "offline":
      return "bg-red-500"
    case "maintenance":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
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

export function ServerList({ favorites, onViewServer, onRemoveFavorite }: ServerListProps) {
  return (
    <div className="space-y-4">
      {favorites.map((server) => (
        <Card
          key={server.id}
          className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
        >
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-72 h-48 lg:h-auto overflow-hidden">
                {server.coverImageUrl ? (
                  <div className="relative w-full h-full rounded-lg">
                    <Image
                      src={server.coverImageUrl || "/placeholder.svg"}
                      alt={server.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                      sizes="(max-width: 768px) 100vw, 288px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary to-primary/60 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "60px 60px",
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center space-y-2">
                      <Server className="w-8 h-8 text-white/90" />
                      <div className="text-white text-2xl font-bold tracking-wide">
                        {server.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(server.status)} text-white border-0 shadow-lg backdrop-blur-sm font-medium px-3 py-1`}
                  >
                    <div
                      className={`w-2 h-2 ${server.status === "online" ? "bg-green-300" : server.status === "offline" ? "bg-red-300" : "bg-yellow-300"} rounded-full mr-2 animate-pulse`}
                    ></div>
                    {getStatusText(server.status)}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 shadow-lg backdrop-blur-sm font-medium px-3 py-1">
                    <Heart className="w-3 h-3 mr-1 fill-current" />
                    Favori
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge variant="outline" className="bg-black/20 text-white border-white/20 backdrop-blur-sm">
                    <Zap className="w-3 h-3 mr-1" />
                    Gaming
                  </Badge>
                </div>
              </div>

              <div className="flex-1 p-6 lg:p-8">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                        {server.name}
                      </h3>
                      <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-foreground">{server.rating.toFixed(1)}</span>
                          <span className="text-xs">rating</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                          <span className="font-semibold text-foreground">{server.likeCount}</span>
                          <span className="text-xs">beğeni</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-foreground">{server.commentCount}</span>
                          <span className="text-xs">yorum</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {new Date(server.addedAt).toLocaleDateString("tr-TR")} tarihinde beğenildi
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewServer(server.id)}
                          className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Görüntüle</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveFavorite(server.id)}
                          className="flex items-center space-x-2 text-destructive hover:text-destructive-foreground hover:bg-destructive hover:border-destructive transition-all duration-200 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Kaldır</span>
                        </Button>
                      </div>
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchUserLikedServers, removeServerLike, type LikedServer } from "@/services/servers"
import { Button } from "@/components/ui/button"
import { Header } from "./Sections/Header"
import { Stats } from "./Sections/Stats"
import { EmptyState } from "./Sections/EmptyState"
import { ServerList } from "./Sections/ServerList"
import { LoadingState } from "./Sections/LoadingState"

// Transform LikedServer to FavoriteServer format for compatibility
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

const transformLikedServerToFavorite = (likedServer: LikedServer): FavoriteServer => ({
  id: likedServer.server_id,
  name: likedServer.server_name,
  status: likedServer.status,
  coverImageUrl: likedServer.server_cover_image_url,
  rating:
    typeof likedServer.average_rating === "number"
      ? likedServer.average_rating
      : Number.parseFloat(String(likedServer.average_rating || "0")),
  likeCount:
    typeof likedServer.like_count === "number"
      ? likedServer.like_count
      : Number.parseInt(String(likedServer.like_count || "0")),
  commentCount: likedServer.comment_count,
  addedAt: likedServer.liked_at,
})

export function FavoriteServers() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteServer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFavoriteServers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchUserLikedServers()
      const transformedFavorites = response.data.map(transformLikedServerToFavorite)
      setFavorites(transformedFavorites)
    } catch (error) {
      console.error("Error loading favorite servers:", error)
      setError("Favori sunucular yüklenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFavoriteServers()
  }, [])

  const handleRemoveFavorite = async (serverId: number) => {
    try {
      await removeServerLike(serverId)
      // Remove from local state
      setFavorites((prev) => prev.filter((fav) => fav.id !== serverId))
    } catch (error) {
      console.error("Error removing favorite:", error)
      setError("Favori sunucu kaldırılırken bir hata oluştu.")
    }
  }

  const handleViewServer = (serverId: number) => {
    // Navigate to server detail page
    router.push(`/servers/${serverId}`)
  }

  const handleSearchServers = () => {
    // Navigate to servers page
    router.push("/servers")
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-100 shadow-xl shadow-black/30">
        <p className="font-medium">{error}</p>
        <Button
          variant="outline"
          onClick={loadFavoriteServers}
          className="mt-4 rounded-xl border border-rose-400/40 text-rose-100 hover:bg-rose-500/20"
        >
          Tekrar dene
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Header totalFavorites={favorites.length} />
      <Stats favorites={favorites} />

      {favorites.length === 0 ? (
        <EmptyState onSearchServers={handleSearchServers} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-slate-100">
            <h2 className="text-xl font-semibold">Favori Sunucularım</h2>
            <span className="text-sm text-slate-400">{favorites.length} sunucu</span>
          </div>
          <ServerList favorites={favorites} onViewServer={handleViewServer} onRemoveFavorite={handleRemoveFavorite} />
        </div>
      )}
    </div>
  )
}

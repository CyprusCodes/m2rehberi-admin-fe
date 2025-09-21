"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Search,
  RefreshCw,
  Calendar,
  User
} from "lucide-react"
import { fetchAllStreamerPosts, type StreamerPost } from "@/services/streamers"
import moment from "moment"
import "moment/locale/tr"

export default function StreamerPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<StreamerPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)

  const loadPosts = useCallback(async (direction: 'first' | 'next' | 'prev' = 'first', search = "") => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        pageSize: 20,
        sortBy: "-published_at"
      }

      if (direction === 'next' && nextCursor) {
        params.direction = 'next'
        params.cursor = nextCursor
      } else if (direction === 'prev' && prevCursor) {
        params.direction = 'prev'
        params.cursor = prevCursor
      } else {
        params.page = 'first'
      }

      if (search.trim()) {
        params.filters = JSON.stringify({
          content: { like: `%${search}%` }
        })
      }

      const response = await fetchAllStreamerPosts(params)
      setPosts(response.data)
      setPagination(response.pagination)
      
      if (response.nextCursor) {
        setNextCursor(response.nextCursor)
      }
      if (response.prevCursor) {
        setPrevCursor(response.prevCursor)
      }
    } catch (err: any) {
      console.error("Failed to fetch streamer posts", err)
      setError(err?.message || "Postlar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [nextCursor, prevCursor])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setNextCursor(null)
    setPrevCursor(null)
    loadPosts('first', value)
  }

  const handlePageChange = (direction: 'next' | 'prev') => {
    loadPosts(direction, searchTerm)
  }

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Badge variant="default" className="bg-green-500">Public</Badge>
      case "private":
        return <Badge variant="secondary">Private</Badge>
      case "followers":
        return <Badge variant="outline">Followers</Badge>
      default:
        return <Badge variant="outline">{visibility}</Badge>
    }
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yayıncı Postları</h1>
          <p className="text-muted-foreground">Tüm yayıncı postlarını görüntüleyin ve yönetin</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          setNextCursor(null)
          setPrevCursor(null)
          loadPosts('first', searchTerm)
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Post içeriğinde ara..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yayıncı Postları</CardTitle>
          <CardDescription>
            Toplam {pagination.total} post bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 text-sm text-red-600 mb-4">{error}</div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Yayıncı</TableHead>
                <TableHead>Görünürlük</TableHead>
                <TableHead>İstatistikler</TableHead>
                <TableHead>Yayın Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Henüz post bulunmuyor
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-md">
                      <div className="space-y-2">
                        <p className="text-sm font-medium line-clamp-3">
                          {truncateContent(post.content, 150)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>ID: #{post.id}</span>
                          {post.reply_to_post_id && (
                            <Badge variant="outline" className="text-xs">Reply</Badge>
                          )}
                          {post.repost_of_post_id && (
                            <Badge variant="outline" className="text-xs">Repost</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(post.display_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.display_name}</div>
                          <div className="text-xs text-muted-foreground">@{post.handle}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {post.is_verified && (
                              <Badge variant="secondary" className="text-xs">Doğrulanmış</Badge>
                            )}
                            {post.is_active ? (
                              <Badge variant="default" className="text-xs bg-green-500">Aktif</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Pasif</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getVisibilityBadge(post.visibility)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{post.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MessageCircle className="h-3 w-3 text-blue-500" />
                          <span>{post.comment_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Repeat2 className="h-3 w-3 text-green-500" />
                          <span>{post.repost_count}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{moment(post.published_at).locale('tr').format("DD MMM YYYY")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {moment(post.published_at).locale('tr').format("HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/admin/streamers/posts/${post.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detayları Gör
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Postu Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.total > pagination.pageSize && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {pagination.total} toplam post
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('prev')}
                  disabled={!pagination.hasPreviousPage}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('next')}
                  disabled={!pagination.hasNextPage}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

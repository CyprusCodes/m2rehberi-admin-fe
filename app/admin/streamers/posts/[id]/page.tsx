"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import moment from "moment"
import "moment/locale/tr"
import { 
  Trash2, 
  Heart, 
  MessageCircle, 
  Repeat2,
  User,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Users,
  ThumbsUp
} from "lucide-react"
import { 
  fetchStreamerPostById,
  deleteStreamerPost,
  type StreamerPost 
} from "@/services/streamers"

export default function AdminPostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<StreamerPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchStreamerPostById(postId)
      setPost(res.data)
    } catch (e: any) {
      setError(e?.message || "Post yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      loadPost()
    }
  }, [postId])

  const handleDeletePost = async () => {
    if (!post) return
    
    if (!confirm("Bu postu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }
    
    try {
      setActionLoading(true)
      await deleteStreamerPost(post.id)
      router.push("/admin/streamers/posts")
    } catch (e: any) {
      console.error("Post deletion failed:", e)
      setError(e?.message || "Post silinemedi")
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Post yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p className="text-muted-foreground">{error || "Post bulunamadı"}</p>
          <Button 
            onClick={() => router.push("/admin/streamers/posts")}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </div>
      </div>
    )
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => router.push("/admin/streamers/posts")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Post Detayı</h1>
            <p className="text-muted-foreground">Post ID: #{post.id}</p>
          </div>
        </div>
        <Button 
          onClick={handleDeletePost}
          disabled={actionLoading}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Postu Sil
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Post İçeriği
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.avatar_url || "/placeholder.svg"} alt={post.display_name} />
                    <AvatarFallback>{post.display_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{post.display_name}</span>
                      <span className="text-muted-foreground">@{post.handle}</span>
                      {post.is_verified && (
                        <Badge variant="secondary" className="text-xs">Doğrulanmış</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {moment(post.published_at).locale('tr').format("lll")}
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.like_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comment_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 className="h-4 w-4" />
                    <span>{post.repost_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Görünürlük: {getVisibilityBadge(post.visibility)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Yorumlar ({post.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.answer_user.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm">
                              {comment.answer_user.first_name} {comment.answer_user.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.answer_user.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {moment(comment.created_at).locale('tr').format("lll")}
                            </span>
                          </div>
                          <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                          {comment.parent_comment_id && (
                            <Badge variant="outline" className="text-xs mt-2">
                              Yanıt
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Likes Section */}
          {post.likes && post.likes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" />
                  Beğenenler ({post.likes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {post.likes.map((like: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {like.first_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">
                            {like.first_name} {like.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {like.email}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {moment(like.liked_at).locale('tr').format("lll")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Post (if repost) */}
          {post.original_post_id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat2 className="h-5 w-5" />
                  Orijinal Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.original_streamer_avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{post.original_streamer_display_name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{post.original_streamer_display_name}</span>
                        <span className="text-xs text-muted-foreground">@{post.original_streamer_handle}</span>
                        {post.original_streamer_is_verified && (
                          <Badge variant="secondary" className="text-xs">Doğrulanmış</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {moment(post.original_post_published_at).locale('tr').format("lll")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm whitespace-pre-wrap">{post.original_post_content}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/streamers/posts/${post.original_post_id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Orijinal Postu Gör
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parent Post (if reply) */}
          {post.parent_post_id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Yanıtlanan Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.parent_streamer_avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{post.parent_streamer_display_name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{post.parent_streamer_display_name}</span>
                        <span className="text-xs text-muted-foreground">@{post.parent_streamer_handle}</span>
                        {post.parent_streamer_is_verified && (
                          <Badge variant="secondary" className="text-xs">Doğrulanmış</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {moment(post.parent_post_published_at).locale('tr').format("lll")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm whitespace-pre-wrap">{post.parent_post_content}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/streamers/posts/${post.parent_post_id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Parent Postu Gör
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Post Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Post ID</label>
                <p className="font-semibold">#{post.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Yayın Tarihi</label>
                <p className="text-sm">{moment(post.published_at).locale('tr').format("lll")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Oluşturulma Tarihi</label>
                <p className="text-sm">{moment(post.created_at).locale('tr').format("lll")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Son Güncelleme</label>
                <p className="text-sm">{moment(post.updated_at).locale('tr').format("lll")}</p>
              </div>
              {post.scheduled_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Planlanan Tarih</label>
                  <p className="text-sm">{moment(post.scheduled_at).locale('tr').format("lll")}</p>
                </div>
              )}
              {post.reply_to_post_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Yanıt Post ID</label>
                  <p className="text-sm">#{post.reply_to_post_id}</p>
                </div>
              )}
              {post.repost_of_post_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Repost Post ID</label>
                  <p className="text-sm">#{post.repost_of_post_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streamer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Yayıncı Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.avatar_url || "/placeholder.svg"} alt={post.display_name} />
                  <AvatarFallback>{post.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.display_name}</p>
                  <p className="text-sm text-muted-foreground">@{post.handle}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Streamer ID</label>
                <p className="text-sm">#{post.streamer_id}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={post.is_active ? "default" : "secondary"}>
                  {post.is_active ? "Aktif" : "Pasif"}
                </Badge>
                {post.is_verified && (
                  <Badge variant="secondary">Doğrulanmış</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push(`/admin/streamers/${post.streamer_id}`)}
                className="w-full"
                variant="outline"
              >
                <User className="mr-2 h-4 w-4" />
                Yayıncı Profilini Gör
              </Button>
              
              <Separator />
              
              <Button 
                onClick={handleDeletePost}
                disabled={actionLoading}
                className="w-full"
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Postu Sil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

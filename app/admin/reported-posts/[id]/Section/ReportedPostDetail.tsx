"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import moment from "moment"
import "moment/locale/tr"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Repeat2,
  User,
  Calendar,
  Flag,
  AlertTriangle
} from "lucide-react"
import { 
  fetchStreamerPostReportById, 
  updateStreamerPostReportStatus, 
  deleteStreamerPost,
  type StreamerPostReportDetail 
} from "@/services/streamers"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-green-100 text-green-800", 
  dismissed: "bg-gray-100 text-gray-800"
}

const statusLabels = {
  pending: "Bekliyor",
  reviewed: "İncelendi",
  dismissed: "Reddedildi"
}

interface ReportedPostDetailProps {
  reportId: string
}

export function ReportedPostDetail({ reportId }: ReportedPostDetailProps) {
  const router = useRouter()
  const [report, setReport] = useState<StreamerPostReportDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchStreamerPostReportById(reportId)
      setReport(res.data)
    } catch (e: any) {
      setError(e?.message || "Rapor yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [reportId])

  const handleStatusUpdate = async (status: 'pending' | 'reviewed' | 'dismissed') => {
    if (!report) return
    
    try {
      setActionLoading(true)
      await updateStreamerPostReportStatus(report.id, status)
      await loadReport() // Refresh the report
    } catch (e: any) {
      console.error("Status update failed:", e)
      setError(e?.message || "Durum güncellenemedi")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!report) return
    
    if (!confirm("Bu postu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }
    
    try {
      setActionLoading(true)
      await deleteStreamerPost(report.post_id)
      router.push("/admin/reported-posts")
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
          <p className="text-muted-foreground">Rapor yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p className="text-muted-foreground">{error || "Rapor bulunamadı"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Report Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-500" />
                Rapor Bilgileri
              </CardTitle>
              <Badge className={statusColors[report.status]}>
                {statusLabels[report.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rapor ID</label>
                <p className="text-lg font-semibold">#{report.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rapor Tarihi</label>
                <p className="text-sm">{moment(report.created_at).locale('tr').format("lll")}</p>
              </div>
            </div>
            
            {report.reason && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rapor Sebebi</label>
                <p className="text-sm bg-muted p-3 rounded-md">{report.reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Post Content */}
        <Card>
          <CardHeader>
            <CardTitle>Raporlanan Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={report.streamer_avatar_url || "/placeholder.svg"} alt={report.streamer_display_name} />
                  <AvatarFallback>{report.streamer_display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{report.streamer_display_name}</span>
                    <span className="text-muted-foreground">@{report.streamer_handle}</span>
                    {report.streamer_is_verified && (
                      <Badge variant="secondary" className="text-xs">Doğrulanmış</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {moment(report.post_published_at).locale('tr').format("lll")}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{report.post_content}</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{report.like_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{report.comment_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Repeat2 className="h-4 w-4" />
                  <span>{report.repost_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Görünürlük: {report.visibility}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Reporter Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Rapor Eden Kullanıcı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Kullanıcı Adı</label>
              <p className="font-semibold">{report.reporter_username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">E-posta</label>
              <p className="text-sm">{report.reporter_email}</p>
            </div>
            {report.reporter_first_name && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                <p className="text-sm">{report.reporter_first_name} {report.reporter_last_name}</p>
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
                <AvatarImage src={report.streamer_avatar_url || "/placeholder.svg"} alt={report.streamer_display_name} />
                <AvatarFallback>{report.streamer_display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{report.streamer_display_name}</p>
                <p className="text-sm text-muted-foreground">@{report.streamer_handle}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">E-posta</label>
              <p className="text-sm">{report.streamer_email}</p>
            </div>
            
            {report.streamer_first_name && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                <p className="text-sm">{report.streamer_first_name} {report.streamer_last_name}</p>
              </div>
            )}
            
            {report.streamer_bio && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                <p className="text-sm">{report.streamer_bio}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Badge variant={report.streamer_is_active ? "default" : "secondary"}>
                {report.streamer_is_active ? "Aktif" : "Pasif"}
              </Badge>
              {report.streamer_is_verified && (
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
            {report.status === 'pending' && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate('reviewed')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  İncelendi Olarak İşaretle
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('dismissed')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reddet
                </Button>
              </>
            )}
            
            {report.status === 'reviewed' && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate('pending')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Bekliyor Olarak İşaretle
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('dismissed')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reddet
                </Button>
              </>
            )}
            
            {report.status === 'dismissed' && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate('pending')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="outline"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Bekliyor Olarak İşaretle
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('reviewed')}
                  disabled={actionLoading}
                  className="w-full"
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  İncelendi Olarak İşaretle
                </Button>
              </>
            )}
            
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
  )
}

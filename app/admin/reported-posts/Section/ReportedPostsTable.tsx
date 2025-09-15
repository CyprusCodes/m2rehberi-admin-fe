"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import moment from "moment"
import "moment/locale/tr"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Trash2, Clock } from "lucide-react"
import { 
  fetchStreamerPostReports, 
  updateStreamerPostReportStatus, 
  deleteStreamerPost,
  type StreamerPostReport 
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

export function ReportedPostsTable() {
  const router = useRouter()
  const [rows, setRows] = useState<StreamerPostReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchStreamerPostReports({ 
        page: 1, 
        pageSize: 50, 
        sortBy: 'created_at',
        sortOrder: 'DESC'
      })
      setRows(res.data || [])
    } catch (e: any) {
      setError(e?.message || "Raporlar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleViewDetails = (report: StreamerPostReport) => {
    router.push(`/admin/reported-posts/${report.id}`)
  }

  const handleStatusUpdate = async (reportId: number, status: 'pending' | 'reviewed' | 'dismissed') => {
    try {
      await updateStreamerPostReportStatus(reportId, status)
      await load() // Refresh the table
    } catch (e: any) {
      console.error("Status update failed:", e)
      setError(e?.message || "Durum güncellenemedi")
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Bu postu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return
    }
    
    try {
      await deleteStreamerPost(postId)
      await load() // Refresh the table
    } catch (e: any) {
      console.error("Post deletion failed:", e)
      setError(e?.message || "Post silinemedi")
    }
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="rounded-md border">
      {error && (
        <div className="p-4 text-sm text-red-600">{error}</div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rapor</TableHead>
            <TableHead>Post İçeriği</TableHead>
            <TableHead>Yayıncı</TableHead>
            <TableHead>Rapor Eden</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>İstatistikler</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Yükleniyor...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Henüz rapor bulunmuyor
              </TableCell>
            </TableRow>
          ) : (
            rows.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">#{report.id}</div>
                      {report.reason && (
                        <div className="text-xs text-muted-foreground">
                          {truncateText(report.reason, 50)}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="text-sm">
                      {truncateText(report.post_content, 30)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {moment(report.post_published_at).locale('tr').format("lll")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={report.streamer_avatar_url || "/placeholder.svg"} alt={report.streamer_display_name} />
                      <AvatarFallback>{report.streamer_display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{report.streamer_display_name}</div>
                      <div className="text-xs text-muted-foreground">@{report.streamer_handle}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{report.reporter_username}</div>
                    <div className="text-xs text-muted-foreground">{report.reporter_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[report.status]}>
                    {statusLabels[report.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {moment(report.created_at).locale('tr').format("lll")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div>❤️ {report.like_count}</div>
                    <div>💬 {report.comment_count}</div>
                    <div>🔄 {report.repost_count}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detayları Görüntüle
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {report.status === 'pending' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'reviewed')}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            İncelendi Olarak İşaretle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                            className="text-gray-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reddet
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {report.status === 'reviewed' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'pending')}
                            className="text-yellow-600"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Bekliyor Olarak İşaretle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                            className="text-gray-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reddet
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {report.status === 'dismissed' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'pending')}
                            className="text-yellow-600"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Bekliyor Olarak İşaretle
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(report.id, 'reviewed')}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            İncelendi Olarak İşaretle
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeletePost(report.post_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
    </div>
  )
}

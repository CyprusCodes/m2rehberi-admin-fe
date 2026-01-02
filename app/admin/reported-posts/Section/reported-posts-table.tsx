"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import moment from "moment"
import "moment/locale/tr"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Check, Trash2, RefreshCcw } from "lucide-react"
import {
  deleteStreamerPostByReport,
  fetchStreamerPostReports,
  StreamerPostReportRow,
  StreamerPostReportStatus,
  updateStreamerPostReportStatus,
} from "@/services/streamer-post-reports"

const statusVariant: Record<StreamerPostReportStatus, { label: string; variant: string }> = {
  pending: { label: "Beklemede", variant: "outline" },
  reviewed: { label: "İncelendi", variant: "secondary" },
  dismissed: { label: "Reddedildi", variant: "destructive" },
}

const getInitials = (name?: string | null) => {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ReportedPostsTable() {
  const router = useRouter()
  const [rows, setRows] = useState<StreamerPostReportRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStreamerPostReports()
      setRows(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error("Failed to fetch reported posts", err)
      setError(err?.message || "Raporlar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleView = (id: number) => {
    router.push(`/admin/reported-posts/${id}`)
  }

  const handleUpdateStatus = async (id: number, status: StreamerPostReportStatus) => {
    try {
      await updateStreamerPostReportStatus(id, status)
      await load()
    } catch (err: any) {
      console.error("Failed to update report status", err)
      setError(err?.message || "Durum güncellenemedi")
    }
  }

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm("Bu gönderiyi silmek istediğinize emin misiniz? İşlem geri alınamaz.")
    if (!confirmed) return

    try {
      await deleteStreamerPostByReport(id)
      await load()
    } catch (err: any) {
      console.error("Failed to delete reported post", err)
      setError(err?.message || "Gönderi silinemedi")
    }
  }

  const statusBadges = useMemo(() => statusVariant, [])

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
        <div>
          <p className="text-sm text-muted-foreground">
            Toplam {rows.length} rapor bulundu
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-destructive">{error}</span>}
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Post</TableHead>
            <TableHead>Yayıncı</TableHead>
            <TableHead>Raporlayan</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((report) => {
            const statusInfo = statusBadges[report.status]
            const streamerName = report.streamer_display_name || `Yayıncı #${report.reported_streamer_id}`
            const reporterName = [report.reporter_first_name, report.reporter_last_name]
              .filter(Boolean)
              .join(" ") || `Kullanıcı #${report.reporter_user_id}`
            return (
              <TableRow key={report.id} className={report.status === "pending" ? "bg-muted/30" : undefined}>
                <TableCell className="max-w-md">
                  <p className="text-sm font-medium line-clamp-2">{report.post_content || "(İçerik bulunamadı)"}</p>
                  {report.reason && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Sebep: {report.reason}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={report.streamer_avatar_url || undefined} />
                      <AvatarFallback>{getInitials(streamerName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{streamerName}</div>
                      <div className="text-xs text-muted-foreground">@{report.streamer_handle}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">{reporterName}</div>
                    {report.reporter_email && (
                      <div className="text-xs text-muted-foreground">{report.reporter_email}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {moment(report.created_at).locale("tr").format("LLL")}
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
                      <DropdownMenuItem onClick={() => handleView(report.id)}>
                        <Eye className="h-4 w-4 mr-2" /> Detayları Gör
                      </DropdownMenuItem>
                      {report.status !== "reviewed" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(report.id, "reviewed")}>
                          <Check className="h-4 w-4 mr-2" /> İncelendi İşaretle
                        </DropdownMenuItem>
                      )}
                      {report.status !== "dismissed" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(report.id, "dismissed")}>
                          <Trash2 className="h-4 w-4 mr-2" /> Raporu Reddet
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePost(report.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Gönderiyi Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {rows.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                Gösterilecek rapor bulunmuyor.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {loading && (
        <div className="px-4 py-3 text-sm text-muted-foreground">Yükleniyor...</div>
      )}
    </div>
  )
}

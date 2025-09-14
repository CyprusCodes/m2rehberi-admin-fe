"use client"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useCallback } from "react"
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
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, ExternalLink, CheckCircle2, Ban } from "lucide-react"
import { fetchStreamers, deleteStreamer, approveStreamer, rejectStreamer } from "@/services/streamers"
import { StreamerApprovalModal } from "./StreamerApprovalModal"

type ApiStreamer = {
  id: number
  user_id: number
  handle: string
  display_name: string
  avatar_url?: string | null
  banner_url?: string | null
  bio?: string | null
  main_link_url?: string | null
  kick_url?: string | null
  youtube_url?: string | null
  twitch_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  x_url?: string | null
  website_url?: string | null
  socials_json?: any | null
  is_active: number
  is_verified: number
  approval_status: "pending" | "approved" | "rejected"
  approval_note?: string | null
  rejected_note?: string | null
  approved_at?: string | null
  approved_by?: number | null
  created_at: string
  updated_at: string
}

type TableStreamer = {
  id: string
  slug: string
  status: "active" | "inactive" | "banned" | "pending"
  displayName: string
  realName?: string
  profileImage?: string
  socialLinks: {
    main?: string
    kick?: string
    youtube?: string
    twitch?: string
    instagram?: string
    tiktok?: string
    x?: string
    website?: string
  }
  isVerified: boolean
  approvalStatus: "pending" | "approved" | "rejected"
  approvalNote?: string
  rejectedNote?: string
  createdAt: string
}

const mapToTable = (s: ApiStreamer): TableStreamer => ({
  id: String(s.id),
  slug: s.handle,
  status: s.is_active ? "active" : "inactive",
  displayName: s.display_name || s.handle,
  realName: undefined, // API'de first_name, last_name yok
  profileImage: s.avatar_url || undefined,
  socialLinks: {
    main: s.main_link_url || undefined,
    kick: s.kick_url || undefined,
    youtube: s.youtube_url || undefined,
    twitch: s.twitch_url || undefined,
    instagram: s.instagram_url || undefined,
    tiktok: s.tiktok_url || undefined,
    x: s.x_url || undefined,
    website: s.website_url || undefined,
  },
  isVerified: Boolean(s.is_verified),
  approvalStatus: s.approval_status,
  approvalNote: s.approval_note || undefined,
  rejectedNote: s.rejected_note || undefined,
  createdAt: s.created_at ? moment(s.created_at).locale('tr').format("lll") : "-",
})

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    active: { variant: "default", label: "Aktif" },
    inactive: { variant: "secondary", label: "Pasif" },
    banned: { variant: "destructive", label: "Yasaklı" },
    pending: { variant: "outline", label: "Beklemede" },
  }
  
  const config = variants[status] || variants.pending
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const ApprovalStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className?: string }> = {
    approved: { variant: "default", label: "Onaylandı", className: "bg-green-100 text-green-800 border-green-200" },
    rejected: { variant: "destructive", label: "Reddedildi" },
    pending: { variant: "outline", label: "Beklemede", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  }
  
  const config = variants[status] || variants.pending
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>
}

export function StreamersTable() {
  const router = useRouter()
  const [rows, setRows] = useState<TableStreamer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean
    streamerId: string
    action: 'approve' | 'reject'
  }>({
    open: false,
    streamerId: '',
    action: 'approve'
  })

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchStreamers()
      const list: ApiStreamer[] = Array.isArray(res) ? res : []
      setRows(list.map(mapToTable))
    } catch (e: any) {
      setError(e?.message || "Yayıncılar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const handler = () => load()
    window.addEventListener("streamers:refresh", handler)
    return () => window.removeEventListener("streamers:refresh", handler)
  }, [load])

  const handleViewDetails = (streamer: TableStreamer) => {
    router.push(`/admin/streamers/${streamer.id}`)
  }

  const handleEdit = (streamer: TableStreamer) => {
    router.push(`/admin/streamers/${streamer.id}/edit`)
  }

  const handleDelete = async (streamerId: string) => {
    if (!confirm("Bu yayıncıyı silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      await deleteStreamer(streamerId)
      await load() // Refresh the table
    } catch (e: any) {
      console.error("Delete failed:", e)
      setError(e?.message || "Yayıncı silinemedi")
    }
  }

  const handleApprove = (streamerId: string) => {
    setApprovalModal({
      open: true,
      streamerId,
      action: 'approve'
    })
  }

  const handleReject = (streamerId: string) => {
    setApprovalModal({
      open: true,
      streamerId,
      action: 'reject'
    })
  }

  const handleApprovalSubmit = async (streamerId: string, action: 'approve' | 'reject', reason: string) => {
    try {
      if (action === 'approve') {
        await approveStreamer(streamerId, reason || undefined)
      } else {
        await rejectStreamer(streamerId, reason)
      }
      await load() // Refresh the table
    } catch (e: any) {
      console.error("Approval action failed:", e)
      setError(e?.message || `Yayıncı ${action === 'approve' ? 'onaylanamadı' : 'reddedilemedi'}`)
    }
  }

  const renderSocialLinks = (links: TableStreamer['socialLinks']) => {
    const activeLinks = Object.entries(links).filter(([_, url]) => url)
    
    if (activeLinks.length === 0) {
      return <span className="text-muted-foreground text-sm">-</span>
    }

    return (
      <div className="flex flex-col gap-1 text-xs">
        {activeLinks.slice(0, 3).map(([platform, url]) => (
          <a 
            key={platform}
            className="text-blue-600 hover:underline flex items-center gap-1"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </a>
        ))}
        {activeLinks.length > 3 && (
          <span className="text-muted-foreground">+{activeLinks.length - 3} daha</span>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      {error && (
        <div className="p-4 text-sm text-red-600">{error}</div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Yayıncı</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Onay Durumu</TableHead>
            <TableHead>Gerçek Ad</TableHead>
            <TableHead>Sosyal Medya</TableHead>
            <TableHead>Doğrulanma</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Yükleniyor...
              </TableCell>
            </TableRow>
          )}
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Henüz yayıncı bulunmuyor
              </TableCell>
            </TableRow>
          )}
          {rows.map((streamer) => (
            <TableRow key={streamer.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={streamer.profileImage || "/placeholder.svg"} alt={streamer.displayName} />
                    <AvatarFallback>{streamer.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {streamer.displayName}
                      {streamer.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">@{streamer.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={streamer.status} />
              </TableCell>
              <TableCell>
                <ApprovalStatusBadge status={streamer.approvalStatus} />
              </TableCell>
              <TableCell>
                <span className="text-sm">{streamer.realName || "-"}</span>
              </TableCell>
              <TableCell>
                {renderSocialLinks(streamer.socialLinks)}
              </TableCell>
              <TableCell>
                {streamer.isVerified ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Onaylandı
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="h-3 w-3 mr-1" />
                    Onaylanmadı
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{streamer.createdAt}</span>
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
                    <DropdownMenuItem onClick={() => handleViewDetails(streamer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    {streamer.approvalStatus === 'pending' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleApprove(streamer.id)}
                          className="text-green-600"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Onayla
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleReject(streamer.id)}
                          className="text-red-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Reddet
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(streamer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(streamer.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Approval Modal */}
      <StreamerApprovalModal
        open={approvalModal.open}
        onOpenChange={(open) => setApprovalModal(prev => ({ ...prev, open }))}
        streamerId={approvalModal.streamerId}
        action={approvalModal.action}
        onSubmit={handleApprovalSubmit}
      />
    </div>
  )
}
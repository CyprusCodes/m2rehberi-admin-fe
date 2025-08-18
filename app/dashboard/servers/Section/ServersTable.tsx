"use client"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { MoreHorizontal, Eye, Settings, Play, Power, Ban, Check, X } from "lucide-react"
import { ServerApprovalModal, ServerStatusBadge, ServerApprovalBadge } from "./"
import { fetchServers, approveServer, rejectServer } from "@/services/servers"

type ApiServer = {
  server_id: number
  server_name: string
  status: string | null
  approval_status: "pending" | "approved" | "rejected"
  approved_by: number | null
  created_at: string | null
  server_ip_address: string | null
  server_port: number | null
  server_password: string | null
  max_players: number | null
  location: string | null
  version: string | null
  reject_note?: string | null
  owner_first_name?: string | null
  owner_last_name?: string | null
  approver_first_name?: string | null
  approver_last_name?: string | null
  // non-aliased fallback names (owner join without AS)
  first_name?: string | null
  last_name?: string | null
}

type TableServer = {
  id: string
  name: string
  status: string
  approvalStatus: "pending" | "approved" | "rejected"
  submittedBy: string
  submittedAt: string
  players: number
  maxPlayers: number
  uptime: string
  location: string
  version: string
  banner?: string
  rules?: string[]
  description?: string
  ip: string
  port: string
  password: string
  rating: number
  reviews: number
  rejectionReason?: string
}

const mapToTable = (s: ApiServer): TableServer => ({
  id: String(s.server_id),
  name: s.server_name ?? `Server #${s.server_id}`,
  status: (s.status || "offline") as string,
  approvalStatus: s.approval_status,
  submittedBy: [s.owner_first_name ?? s.first_name, s.owner_last_name ?? s.last_name]
    .filter(Boolean)
    .join(" ") || `user#${String((s as any).user_id ?? "-")}`,
  submittedAt: s.created_at ? moment(s.created_at).locale('tr').format("lll") : "-",
  players: 0,
  maxPlayers: Number(s.max_players || 0),
  uptime: "-",
  location: s.location || "-",
  version: s.version || "-",
  banner: undefined,
  rules: undefined,
  description: undefined,
  ip: s.server_ip_address || "-",
  port: s.server_port ? String(s.server_port) : "-",
  password: s.server_password || "",
  rating: 0,
  reviews: 0,
  rejectionReason: s.reject_note || undefined,
})

export function ServersTable() {
  const router = useRouter()
  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; serverId: string; action: 'approve' | 'reject' }>({ open: false, serverId: '', action: 'approve' })
  const [rows, setRows] = useState<TableServer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchServers({ pageSize: 50, sortBy: "-servers.server_id" })
      const list: ApiServer[] = Array.isArray(res?.data) ? res.data : []
      setRows(list.map(mapToTable))
    } catch (e: any) {
      setError(e?.message || "Sunucular yüklenemedi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const handler = () => load()
    window.addEventListener("servers:refresh", handler)
    return () => window.removeEventListener("servers:refresh", handler)
  }, [load])

  const handleViewDetails = (server: TableServer) => {
    router.push(`/dashboard/servers/${server.id}`)
  }

  const handleServerAction = (serverId: string, action: string) => {
    console.log(`Server ${serverId} action: ${action}`)
  }

  const handleApprovalAction = (serverId: string, action: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, serverId, action })
  }

  const handleApprovalSubmit = async (serverId: string, action: 'approve' | 'reject', reason: string) => {
    try {
      if (action === 'approve') {
        await approveServer(serverId, { approvalNote: reason || undefined })
      } else {
        await rejectServer(serverId, { rejectNote: reason })
      }
      await load()
    } catch (e) {
      console.error(e)
    } finally {
      setApprovalDialog({ open: false, serverId: '', action: 'approve' })
    }
  }

  const renderStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  return (
    <div className="rounded-md border">
      {error && (
        <div className="p-4 text-sm text-red-600">{error}</div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sunucu</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Onay Durumu</TableHead>
            <TableHead>Gönderen</TableHead>
            <TableHead>Oyuncular</TableHead>
            <TableHead>Konum</TableHead>
            <TableHead>IP:Port</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead>Değerlendirme</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((server) => (
            <TableRow key={server.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={server.banner || "/placeholder.svg"} alt={server.name} />
                    <AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{server.name}</div>
                    <div className="text-sm text-muted-foreground">v{server.version}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell><ServerStatusBadge status={server.status} /></TableCell>
              <TableCell><ServerApprovalBadge approvalStatus={server.approvalStatus} /></TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{server.submittedBy}</div>
                  <div className="text-xs text-muted-foreground">{server.submittedAt}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {server.players}/{server.maxPlayers}
                  </div>
                  <Progress value={(server.maxPlayers ? (server.players / server.maxPlayers) * 100 : 0)} className="h-1 w-16" />
                </div>
              </TableCell>
              <TableCell>{server.location}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-mono">
                    {server.ip}:{server.port}
                  </div>
                  {server.password && <div className="text-xs text-muted-foreground">Şifre: {server.password}</div>}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{server.uptime}</span>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="text-yellow-500">{renderStars(server.rating)}</div>
                  <div className="text-xs text-muted-foreground">
                    {server.rating}/5 ({server.reviews} değerlendirme)
                  </div>
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
                    <DropdownMenuItem onClick={() => handleViewDetails(server)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    
                    {server.approvalStatus === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleApprovalAction(server.id, "approve")}
                          className="text-green-600"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Sunucuyu Onayla
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleApprovalAction(server.id, "reject")}
                          className="text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Sunucuyu Reddet
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {server.approvalStatus === "approved" && (
                      <>
                        <DropdownMenuItem onClick={() => handleServerAction(server.id, "settings")}>
                          <Settings className="mr-2 h-4 w-4" />
                          Ayarlar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {server.status === "online" || server.status === "active" ? (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleApprovalAction(server.id, "reject")}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Reddet
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleServerAction(server.id, "close")}
                              className="text-red-600"
                            >
                              <Power className="mr-2 h-4 w-4" />
                              Kapat
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleServerAction(server.id, "activate")}
                            className="text-green-600"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Aktif Et
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    
                    {server.approvalStatus === "rejected" && server.rejectionReason && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                          <div className="font-medium">Red Sebebi:</div>
                          <div className="mt-1">{server.rejectionReason}</div>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Approval Modal */}
      <ServerApprovalModal
        open={approvalDialog.open}
        onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}
        serverId={approvalDialog.serverId}
        action={approvalDialog.action}
        onSubmit={handleApprovalSubmit}
      />
    </div>
  )
}

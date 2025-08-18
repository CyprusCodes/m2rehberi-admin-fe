"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { approveServerOwnerRequest, fetchServerOwnerRequests, rejectServerOwnerRequest, type ServerOwnerRequestRow } from "@/services/users"
import toast from 'react-hot-toast'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ServerOwnerRequestsPage() {
  const [rows, setRows] = useState<ServerOwnerRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchServerOwnerRequests()
      setRows(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (id: number, userId: number) => {
    await toast.promise(approveServerOwnerRequest(id, userId), {
      loading: 'Onaylanıyor...',
      success: 'İstek onaylandı! Kullanıcı server owner yapıldı.',
      error: 'Onay başarısız.'
    })
    await load()
  }

  const openRejectDialog = (id: number, userId: number) => {
    setRejectId(id)
    setRejectReason("")
    setRejectOpen(true)
  }

  const confirmReject = async () => {
    if (rejectId == null) return
    await toast.promise(rejectServerOwnerRequest(rejectId, rejectReason), {
      loading: 'Reddediliyor...',
      success: 'İstek reddedildi.',
      error: 'Reddetme başarısız.'
    })
    setRejectOpen(false)
    setRejectId(null)
    setRejectReason("")
    await load()
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Onaylandı</Badge>
      case 'rejected':
        return <Badge variant="destructive">Reddedildi</Badge>
      default:
        return <Badge variant="secondary">Beklemede</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Server Owner Requests</h1>
        <p className="text-muted-foreground">Kullanıcıların server owner olma taleplerini yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gelen Talepler</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.requestId}>
                  <TableCell>#{r.requestId}</TableCell>
                  <TableCell>{r.firstName} {r.lastName}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={r.message || ''}>{r.message || '-'}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" disabled={loading || r.status !== 'pending'} onClick={() => approve(r.requestId, r.userId)}>Onayla</Button>
                    <Button size="sm" variant="destructive" disabled={loading || r.status !== 'pending'} onClick={() => openRejectDialog(r.requestId, r.userId)}>Reddet</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Talebi Reddet</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reddetme sebebi</Label>
            <textarea
              id="reject-reason"
              className="w-full min-h-[120px] rounded-md border bg-background p-2 text-sm"
              placeholder="Sebebi yazın..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>İptal</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!rejectReason.trim()}>Reddet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



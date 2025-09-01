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
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TestRequestDialog } from "./Sections/TestRequestDialog"
import { FileText, Users } from "lucide-react"

export default function ServerOwnerRequestsPage() {
  const [rows, setRows] = useState<ServerOwnerRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectUserId, setRejectUserId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageText, setMessageText] = useState<string>("")
  const [messageUserName, setMessageUserName] = useState<string>("")
  const [messageRole, setMessageRole] = useState<string>("")
  const [testOpen, setTestOpen] = useState(false)

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
    setRejectUserId(userId)
    setRejectReason("")
    setRejectOpen(true)
  }

  const openMessageDialog = (row: ServerOwnerRequestRow) => {
    setMessageText(row.message || "-")
    setMessageUserName(`${row.firstName} ${row.lastName}`.trim())
    setMessageRole(row.selectedUserType)
    setMessageOpen(true)
  }

  const confirmReject = async () => {
    if (rejectId == null) return
    await toast.promise(rejectServerOwnerRequest(rejectId, rejectReason, rejectUserId ?? undefined), {
      loading: 'Reddediliyor...',
      success: 'İstek reddedildi.',
      error: 'Reddetme başarısız.'
    })
    setRejectOpen(false)
    setRejectId(null)
    setRejectUserId(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Talepleri</h1>
          <p className="text-muted-foreground">Kullanıcıların rol taleplerini yönetin</p>
        </div>
        <Button size="sm" onClick={() => setTestOpen(true)}>Test Et</Button>
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
                <TableHead>İstenen Rol</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32">
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-muted-foreground">Henüz Talep Bulunmuyor</h3>
                        <p className="text-sm text-muted-foreground">
                          Şu anda beklemede olan rol talebi bulunmamaktadır. 
                          Kullanıcılar rol talebi gönderdiğinde burada görüntülenecektir.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Rol talepleri otomatik olarak burada listelenir</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(r => (
                  <TableRow key={r.requestId}>
                    <TableCell>#{r.requestId}</TableCell>
                    <TableCell>{r.firstName} {r.lastName}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{(r as any).selectedUserType === 'server_owner' ? 'Sunucu Sahibi' : 'Yayıncı'}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={r.message || ''}>{r.message || '-'}</TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => openMessageDialog(r)}>Mesajı Gör</Button>
                      <Button size="sm" variant="outline" disabled={loading || r.status !== 'pending'} onClick={() => approve(r.requestId, r.userId)}>Onayla</Button>
                      <Button size="sm" variant="destructive" disabled={loading || r.status !== 'pending'} onClick={() => openRejectDialog(r.requestId, r.userId)}>Reddet</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
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

      <UIDialog open={messageOpen} onOpenChange={setMessageOpen}>
        <UIDialogContent>
          <UIDialogHeader>
            <UIDialogTitle>Mesaj Detayı</UIDialogTitle>
          </UIDialogHeader>
          <div className="space-y-3">
            <Alert>
              <AlertDescription>
                {messageUserName} isimli kullanıcı hesabını {messageRole === 'server_owner' ? 'Sunucu Sahibi' : 'Yayıncı'} rolüne dönüştürmek istiyor. İstek mesajı:
              </AlertDescription>
            </Alert>
            <div className="whitespace-pre-wrap text-sm max-h-[50vh] overflow-auto">
              {messageText || '-'}
            </div>
          </div>
        </UIDialogContent>
      </UIDialog>

      <TestRequestDialog open={testOpen} onOpenChange={setTestOpen} onSuccess={load} />
    </div>
  )
}



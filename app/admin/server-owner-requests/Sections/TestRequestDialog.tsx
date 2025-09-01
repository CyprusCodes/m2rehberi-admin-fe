"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchUsers, type UsersPaginated } from "@/services/users"
import { createServerOwnerRequest } from "@/services/users"
import { fetchRequestableRoles, type Role } from "@/services/roles"
import toast from "react-hot-toast"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess?: () => void
}

export function TestRequestDialog({ open, onOpenChange, onSuccess }: Props) {
  const [users, setUsers] = useState<UsersPaginated["data"]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [message, setMessage] = useState("")
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchUsers("?page_size=100&sort_by=-users.user_id")
        setUsers(res.data || [])
        const rolesRes = await fetchRequestableRoles()
        setRoles(rolesRes.data || [])
      } catch (e: any) {
        toast.error(e?.message || "Kullanıcılar yüklenemedi")
      }
    }
    if (open) load()
  }, [open])

  const canSubmit = useMemo(() => selectedUserId && selectedRoleId && message.trim().length > 0, [selectedUserId, selectedRoleId, message])

  const submit = async () => {
    try {
    setLoading(true)
      await createServerOwnerRequest(Number(selectedUserId), message.trim(), Number(selectedRoleId))
      toast.success("Test talebi oluşturuldu")
      onOpenChange(false)
      setSelectedUserId("")
      setSelectedRoleId("")
      setMessage("")
      onSuccess?.()
    } catch (e: any) {
      toast.error(e?.message || "Talep oluşturulamadı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Server Owner Request Testi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kullanıcı</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Kullanıcı seçin" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.user_id} value={String(u.user_id)}>
                    {u.first_name} {u.last_name} - {u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.userTypeId} value={String(r.userTypeId)}>
                    {r.userTypeLabel} ({r.userType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mesaj</Label>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Talep mesajı" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={submit} disabled={!canSubmit || loading}>Gönder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



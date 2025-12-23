"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDetailsDialog } from "./user-details-dialog"
import moment from "moment"
import "moment/locale/tr"

import { fetchUsers, type UsersPaginated, type UserRow, banUser as banUserSvc, unbanUser as unbanUserSvc, verifyUserEmail, sendPasswordResetEmail, changeUserPassword } from "@/services/users"
import toast from 'react-hot-toast'
import { MoreHorizontal, Eye, UserCheck, UserX, Mail, KeyRound, Smartphone, Lock } from "lucide-react"
import { AdminChangePasswordForUser } from "./AdminChangePasswordForUser"


type ApiUser = UserRow

export function UsersTable() {
  const [rows, setRows] = useState<ApiUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<UsersPaginated["metadata"] | null>(null)
  const [query, setQuery] = useState<string>("?page_size=10&sort_by=-users.user_id")
  
  // Password Change State
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false)
  const [passwordChangeUserId, setPasswordChangeUserId] = useState<number | null>(null)

  const extractQueryFromLink = (link: string | null): string | null => {
    if (!link) return null
    const idx = link.indexOf("?")
    return idx >= 0 ? link.substring(idx) : null
  }

  const load = async (q: string) => {
    setLoading(true)
    try {
      const result = await fetchUsers(q)
      setRows(result.data || [])
      setMeta(result.metadata)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const getStatusBadge = (status: string, emailVerifyStatus: string) => {
    if (status === "inactive" && emailVerifyStatus === "inactive") {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Beklemede</Badge>
    }
    
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
      case "inactive":
        return <Badge variant="destructive">Engellenmiş</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const handleViewDetails = (user: ApiUser) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleApproveUser = async (userId: number) => {
    await toast.promise(
      unbanUserSvc(userId),
      {
        loading: 'Kullanıcı onaylanıyor...',
        success: 'Kullanıcı onaylandı!',
        error: 'Kullanıcı onaylanamadı.'
      }
    )
    await load(query)
  }

  const handleBlockUser = async (userId: number) => {
    await toast.promise(
      banUserSvc(userId),
      {
        loading: 'Kullanıcı engelleniyor...',
        success: 'Kullanıcı engellendi!',
        error: 'Kullanıcı engellenemedi.'
      }
    )
    await load(query)
  }

  const handleSendVerificationEmail = async (userId: number) => {
    await toast.promise(
      verifyUserEmail(userId),
      {
        loading: 'Doğrulanıyor...',
        success: 'Email doğrulandı!',
        error: 'Email doğrulanamadı.'
      }
    )
    await load(query)
  }

  const handleSendPasswordResetEmail = async (email: string) => {
    await toast.promise(
      sendPasswordResetEmail(email),
      {
        loading: 'Şifre sıfırlama gönderiliyor...',
        success: 'Şifre sıfırlama emaili gönderildi!',
        error: 'Şifre sıfırlama emaili gönderilemedi.'
      }
    )
  }

  const openPasswordChangeDialog = (userId: number) => {
    setPasswordChangeUserId(userId)
    setIsPasswordChangeOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Email Onayı</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>IP Adresi</TableHead>
              <TableHead>Cihaz</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((user, index) => (
              <TableRow key={`${user.user_id}-${user.email}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={"/placeholder-user.jpg"} alt={`${user.first_name} ${user.last_name}`} />
                        <AvatarFallback>
                          {(user.first_name[0] || "").concat(user.last_name[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      {index % 2 === 0 && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.first_name} {user.last_name}</div>
                      <div className="text-sm text-muted-foreground">{user.user_type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.phone_number ? (
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{user.phone_number}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(user.user_status, user.email_verify_status)}</TableCell>
                <TableCell>
                  {user.email_verify_status === 'active' ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Onaylandı</Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">Beklemede</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{moment(user.created_at).format('lll')}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">-</code>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground max-w-[120px] truncate" title={user.user_type}>
                    {user.user_type}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menüyü aç</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detayları Görüntüle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.user_status !== "active" && (
                        <DropdownMenuItem onClick={() => handleApproveUser(user.user_id)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Kullanıcıyı Onayla
                        </DropdownMenuItem>
                      )}
                      {user.user_status !== "inactive" && (
                        <DropdownMenuItem onClick={() => handleBlockUser(user.user_id)}>
                          <UserX className="mr-2 h-4 w-4" />
                          Kullanıcıyı Engelle
                        </DropdownMenuItem>
                      )}
                      {user.email_verify_status !== 'active' && (
                        <DropdownMenuItem onClick={() => handleSendVerificationEmail(user.user_id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Şimdi Doğrula
                        </DropdownMenuItem>
                      )}
                      {/* <DropdownMenuItem onClick={() => handleSendPasswordResetEmail(user.email)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Şifre Sıfırlama Emaili
                      </DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => openPasswordChangeDialog(user.user_id)}>
                        <Lock className="mr-2 h-4 w-4" />
                        Şifreyi Değiştir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {meta ? (
            <span>
              Gösterilen: {meta.from}–{meta.to} / {meta.total}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md bg-background border px-2 text-sm"
            value={(() => {
              const params = new URLSearchParams(query.replace(/^\?/, ""))
              return params.get("page_size") || "10"
            })()}
            onChange={(e) => {
              const size = e.target.value
              setQuery(`?page_size=${size}&sort_by=-users.user_id`)
            }}
            disabled={loading}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              const q = extractQueryFromLink(meta?.links.previous ?? null)
              if (q) setQuery(q)
            }}
            disabled={!meta?.links.previous || loading}
          >
            Geri
          </Button>
          <Button
            onClick={() => {
              const q = extractQueryFromLink(meta?.links.next ?? null)
              if (q) setQuery(q)
            }}
            disabled={!meta?.links.next || loading}
          >
            İleri
          </Button>
        </div>
      </div>

      <UserDetailsDialog
        user={selectedUser ? {
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          email: selectedUser.email,
          phoneNumber: selectedUser.phone_number,
          userStatus: selectedUser.user_status,
          emailVerifyStatus: selectedUser.email_verify_status,
          emailVerifyCode: selectedUser.email_verify_code,
          emailVerifyAt: selectedUser.email_verify_at,
          createdAt: selectedUser.created_at,
          userType: selectedUser.user_type,
        } : null}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      
      <AdminChangePasswordForUser
        userId={passwordChangeUserId}
        open={isPasswordChangeOpen}
        onOpenChange={setIsPasswordChangeOpen}
      />
    </>
  )
}

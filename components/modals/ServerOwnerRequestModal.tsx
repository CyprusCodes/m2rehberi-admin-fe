'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Check, Info, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { fetchRequestableRoles, type Role } from '@/services/roles'
import { createServerOwnerRequest } from '@/services/server-owner-requests'
import { useToast } from '@/hooks/use-toast'

interface ServerOwnerRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ServerOwnerRequestModal({ open, onOpenChange, onSuccess }: ServerOwnerRequestModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadRoles()
    }
  }, [open])

  const loadRoles = async () => {
    try {
      setRolesLoading(true)
      const response = await fetchRequestableRoles()
      setRoles(response.data || [])
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error?.message || 'Roller yüklenemedi',
        variant: 'destructive'
      })
    } finally {
      setRolesLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedRoleId) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir rol seçin.',
        variant: 'destructive'
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: 'Hata',
        description: 'Lütfen talep mesajınızı yazın.',
        variant: 'destructive'
      })
      return
    }

    if (message.trim().length < 10) {
      toast({
        title: 'Hata',
        description: 'Mesaj en az 10 karakter olmalıdır.',
        variant: 'destructive'
      })
      return
    }

    if (!user?.id) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı bilgisi bulunamadı.',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      await createServerOwnerRequest(parseInt(user.id), message.trim(), Number(selectedRoleId))

      toast({
        title: 'Başarılı',
        description: 'Server sahipliği talebiniz gönderildi. Yöneticiler tarafından incelenecek ve size bilgi verilecek.',
      })
      
      onOpenChange(false)
      setSelectedRoleId('')
      setMessage('')
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error?.message || 'Talep gönderilemedi',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = selectedRoleId && message.trim().length >= 10 && roles.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Server Sahipliği İste</span>
          </DialogTitle>
          <DialogDescription>
            Server sahipliği yetkisi için başvuru yapın. Yöneticiler tarafından incelenecek ve size bilgi verilecek.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Rol Seçimi</Label>
              <Card>
                <CardContent className="p-0">
                  {rolesLoading ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">Roller yükleniyor...</span>
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="flex items-center justify-center p-6">
                      <span className="text-sm text-muted-foreground">Talep edilebilir rol bulunamadı</span>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {roles.map((role) => (
                        <button
                          key={role.userTypeId}
                          onClick={() => setSelectedRoleId(String(role.userTypeId))}
                          className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                            selectedRoleId === String(role.userTypeId) ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium ${
                                  selectedRoleId === String(role.userTypeId)
                                    ? 'text-primary'
                                    : 'text-foreground'
                                }`}>
                                  {role.userTypeLabel}
                                </span>
                                {selectedRoleId === String(role.userTypeId) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Seçildi
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {role.userType}
                              </p>
                            </div>
                            {selectedRoleId === String(role.userTypeId) && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Input */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-semibold">
                Mesaj
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Talep mesajınızı yazın..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/500 karakter
              </p>
            </div>

            {/* Info Section */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Bilgi
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Server sahipliği talebiniz yöneticiler tarafından incelenecek. Onaylandıktan
                      sonra server oluşturma yetkisine sahip olacaksınız.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Gönder</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

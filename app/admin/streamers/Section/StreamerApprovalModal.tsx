"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X } from "lucide-react"

interface StreamerApprovalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  streamerId: string
  action: 'approve' | 'reject'
  onSubmit: (streamerId: string, action: 'approve' | 'reject', reason: string) => void
}

export function StreamerApprovalModal({
  open,
  onOpenChange,
  streamerId,
  action,
  onSubmit
}: StreamerApprovalModalProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    onSubmit(streamerId, action, reason)
    setReason('')
    onOpenChange(false)
  }

  const handleClose = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Yayıncıyı Onayla' : 'Yayıncıyı Reddet'}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve' 
              ? 'Bu yayıncıyı onaylamak istediğinizden emin misiniz? Onaylanan yayıncılar kullanıcılar tarafından görülebilir olacak.'
              : 'Bu yayıncıyı reddetmek istediğinizden emin misiniz? Lütfen red sebebini belirtin.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              {action === 'approve' ? 'Onay Notu (Opsiyonel)' : 'Red Sebebi *'}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'approve' 
                  ? 'Onay ile ilgili notlarınızı yazabilirsiniz...'
                  : 'Red sebebini detaylı olarak açıklayın...'
              }
              rows={4}
              required={action === 'reject'}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              className={
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
              disabled={action === 'reject' && !reason.trim()}
            >
              {action === 'approve' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Onayla
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reddet
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
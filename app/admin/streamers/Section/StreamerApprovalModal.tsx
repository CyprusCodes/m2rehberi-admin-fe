"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

interface StreamerApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamerId: string;
  action: "approve" | "reject";
  onSubmit: (
    streamerId: string,
    action: "approve" | "reject",
    reason: string,
  ) => void;
}

export function StreamerApprovalModal({
  open,
  onOpenChange,
  streamerId,
  action,
  onSubmit,
}: StreamerApprovalModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(streamerId, action, reason);
    setReason("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {action === "approve" ? "Yayıncıyı Onayla" : "Yayıncıyı Reddet"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {action === "approve"
              ? "Bu yayıncıyı onaylamak istediğinizden emin misiniz? Onaylanan yayıncılar kullanıcılar tarafından görülebilir olacak."
              : "Bu yayıncıyı reddetmek istediğinizden emin misiniz? Lütfen red sebebini belirtin."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white/80">
              {action === "approve" ? "Onay Notu (Opsiyonel)" : "Red Sebebi *"}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === "approve"
                  ? "Onay ile ilgili notlarınızı yazabilirsiniz..."
                  : "Red sebebini detaylı olarak açıklayın..."
              }
              rows={4}
              required={action === "reject"}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              className={
                action === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
              disabled={action === "reject" && !reason.trim()}
            >
              {action === "approve" ? (
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
  );
}

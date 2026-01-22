"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Globe, AlertCircle, CheckCircle } from "lucide-react";
import { PendingNotification } from "@/services/streamers";
import moment from "moment";
import "moment/locale/tr";

interface ApproveRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: PendingNotification | null;
  mode: "approve" | "reject";
  onConfirm: (note: string) => Promise<void>;
}

export const ApproveRejectDialog = ({
  open,
  onOpenChange,
  notification,
  mode,
  onConfirm,
}: ApproveRejectDialogProps) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!notification) return;

    setLoading(true);
    try {
      await onConfirm(note);
      setNote("");
    } catch (error) {
      console.error("Error confirming action:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNote("");
    onOpenChange(false);
  };

  const getAudienceIcon = (audience: string) => {
    return audience === "followers" ? (
      <Users className="h-4 w-4 text-blue-500" />
    ) : (
      <Globe className="h-4 w-4 text-green-500" />
    );
  };

  const getAudienceText = (audience: string) => {
    return audience === "followers" ? "Takipçiler" : "Herkes";
  };

  const dialogTitle =
    mode === "approve" ? "Bildirimi Onayla ve Gönder" : "Bildirimi Reddet";
  const dialogDescription =
    mode === "approve"
      ? "Bu bildirimi onaylayarak yayıncının takipçilerine anında göndereceksiniz. Bu işlem geri alınamaz."
      : "Bu bildirimi reddedeceksiniz. Yayıncıya reddetme nedeninizi açıklayın ki ileride daha iyi bildirimler gönderebilsin.";
  const confirmButtonText = mode === "approve" ? "Onayla ve Gönder" : "Reddet";
  const confirmButtonVariant = mode === "approve" ? "default" : "destructive";
  const noteLabel =
    mode === "approve"
      ? "Onay Notu (İsteğe bağlı)"
      : "Reddetme Nedeni (Zorunlu)";
  const notePlaceholder =
    mode === "approve"
      ? 'Onayınızla ilgili notunuzu yazın (örneğin: "İçerik kurallara uygun")...'
      : 'Reddetme nedeninizi detaylı açıklayın (örneğin: "Uygunsuz içerik nedeniyle reddedildi")...';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {notification && (
          <div className="space-y-4">
            {/* Streamer Info */}
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={notification.streamer_avatar_url || ""} />
                <AvatarFallback>
                  {notification.streamer_display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {notification.streamer_display_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{notification.streamer_handle}
                </div>
              </div>
            </div>

            {/* Notification Details */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Başlık</Label>
                <div className="mt-1 p-3 bg-muted rounded-md font-medium">
                  {notification.headline}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Mesaj</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {notification.message}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAudienceIcon(notification.audience)}
                  <span className="text-sm">
                    {getAudienceText(notification.audience)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {moment(notification.created_at)
                    .locale("tr")
                    .format("DD MMMM YYYY HH:mm")}
                </div>
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="note"
                  className="text-sm font-semibold text-white/80"
                >
                  {noteLabel}
                </Label>
                <Textarea
                  id="note"
                  placeholder={notePlaceholder}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="resize-none bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-blue-400/20 mt-2"
                />
              </div>
              {mode === "reject" && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-200/80 leading-relaxed">
                    Reddetme nedeninizi yayıncıya açıklayın ki ileride daha iyi
                    bildirimler gönderebilsin.
                  </p>
                </div>
              )}
              {mode === "approve" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-200/80 leading-relaxed">
                    Onay notu isteğe bağlıdır. Bildirimin uygunluğu hakkında
                    kısa bir açıklama ekleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            İptal
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={loading || (mode === "reject" && !note.trim())}
            className={
              mode === "approve"
                ? "bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-900/30"
                : "bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-900/30"
            }
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                İşleniyor...
              </>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

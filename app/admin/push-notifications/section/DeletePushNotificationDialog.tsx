"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePushNotification } from "@/services/pushNotifications";
import { PushNotification } from "@/services/pushNotifications";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeletePushNotificationDialogProps {
  notification: PushNotification;
  onSuccess?: () => void;
}

export const DeletePushNotificationDialog = ({
  notification,
  onSuccess,
}: DeletePushNotificationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePushNotification(notification.id);
      toast.success("Bildirim başarıyla silindi");
      setOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response
          ?.data?.error ||
        "Bildirim silinirken bir hata oluştu";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Bildirimi Sil
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Bu bildirimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-gray-800/50 p-3 rounded-lg space-y-2 mt-2">
          <div>
            <span className="text-gray-400 text-xs">
              Başlık:
            </span>
            <p className="text-white text-sm font-medium mt-1">
              {notification.headline}
            </p>
          </div>
          <div>
            <span className="text-gray-400 text-xs">
              Mesaj:
            </span>
            <p className="text-white text-sm mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="text-white border-gray-600"
          >
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Siliniyor
              </div>
            ) : (
              "Sil"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

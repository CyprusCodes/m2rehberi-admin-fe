"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { CustomDialogContent } from "@/components/ui/customDialogContent";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  updatePushNotification,
  sendTestPushNotification,
} from "@/services/pushNotifications";
import { PushNotification } from "@/services/pushNotifications";
import { toast } from "sonner";
import { TestNotificationButtons } from "./CreatePushNotificationDialog/testNotificationButtons";

export const updatePushNotificationSchema = z.object({
  headline: z.string().min(1, "Başlık gereklidir").max(100),
  message: z.string().min(1, "Mesaj gereklidir").max(200),
  linkTo: z.enum(["server", "streamer_post", "streamer", "lottery"]).optional(),
  linkToId: z.string().optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  sendNow: z.boolean(),
});

interface EditPushNotificationDialogProps {
  notification: PushNotification;
  onSuccess?: () => void;
}

export const EditPushNotificationDialog = ({
  notification,
  onSuccess,
}: EditPushNotificationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof updatePushNotificationSchema>>({
    resolver: zodResolver(updatePushNotificationSchema),
    defaultValues: {
      headline: notification.headline,
      message: notification.message,
      linkTo: notification.linkTo || undefined,
      linkToId: notification.linkToId || "",
      scheduledDate: notification.scheduledDate
        ? notification.scheduledDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      scheduledTime: notification.scheduledTime || "00:00",
      sendNow: false,
    },
  });

  const onSubmit = async (
    data: z.infer<typeof updatePushNotificationSchema>
  ) => {
    setIsSubmitting(true);
    try {
      let scheduledAt: string | undefined = undefined;
      if (!data.sendNow && data.scheduledDate && data.scheduledTime) {
        scheduledAt = `${data.scheduledDate} ${data.scheduledTime}:00`;
      } else if (!data.sendNow && data.scheduledDate) {
        scheduledAt = `${data.scheduledDate} 00:00:00`;
      }

      await updatePushNotification(notification.id, {
        headline: data.headline,
        message: data.message,
        linkTo: data.linkTo,
        linkToId: data.linkToId,
        scheduledAt,
        sendNow: data.sendNow,
      });
      toast.success("Bildirim başarıyla güncellendi");
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
          error?.response?.data?.message ||
          "Bir hata oluştu"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestNotification = async (
    platform: "ios" | "android" | "all"
  ) => {
    const data = form.getValues();
    if (!data.headline || !data.message) {
      toast.error("Önce başlık ve mesaj alanlarını doldurun");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendTestPushNotification({
        headline: data.headline,
        message: data.message,
        linkTo: data.linkTo,
        linkToId: data.linkToId,
        platform,
      });
      toast.success("Test bildirimi başarıyla gönderildi");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
          error?.response?.data?.message ||
          "Bir hata oluştu"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLinkToLabel = (linkTo: string | null | undefined) => {
    const labels: Record<string, string> = {
      server: "Sunucu",
      streamer_post: "Yayıncı Gönderisi",
      streamer: "Yayıncı",
      lottery: "Çekiliş",
    };
    return labels[linkTo || ""] || linkTo || "";
  };

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <CustomDialogContent
        wrapperClassName="overflow-y-auto mb-6 max-w-2xl"
        title="Bildirimi Düzenle"
        onConfirm={
          notification.sentAt ? undefined : form.handleSubmit(onSubmit)
        }
        isSubmitting={isSubmitting}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Başlık</Label>
            <Input
              id="headline"
              {...form.register("headline")}
              placeholder="Bildirim başlığını girin"
              maxLength={100}
              disabled={!!notification.sentAt}
            />
            {form.formState.errors.headline && (
              <p className="text-sm text-red-500">
                {form.formState.errors.headline.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <textarea
              id="message"
              {...form.register("message")}
              placeholder="Bildirim mesajını girin"
              maxLength={200}
              disabled={!!notification.sentAt}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-500">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkTo">Bağlantı Tipi</Label>
              <Select
                value={form.watch("linkTo") || ""}
                onValueChange={(value) =>
                  form.setValue(
                    "linkTo",
                    value as "server" | "streamer_post" | "streamer" | "lottery" | undefined
                  )
                }
                disabled={!!notification.sentAt}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Bağlantı tipi seçin"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="server">Sunucu</SelectItem>
                  <SelectItem value="streamer_post">Yayıncı Gönderisi</SelectItem>
                  <SelectItem value="streamer">Yayıncı</SelectItem>
                  <SelectItem value="lottery">Çekiliş</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.watch("linkTo") && (
              <div className="space-y-2">
                <Label htmlFor="linkToId">
                  {getLinkToLabel(form.watch("linkTo"))} ID
                </Label>
                <Input
                  id="linkToId"
                  {...form.register("linkToId")}
                  placeholder="ID girin"
                  type="text"
                  disabled={!!notification.sentAt}
                />
              </div>
            )}
          </div>

          {!notification.sentAt && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sendNow"
                  checked={form.watch("sendNow")}
                  onCheckedChange={(checked) =>
                    form.setValue("sendNow", checked)
                  }
                />
                <Label htmlFor="sendNow" className="cursor-pointer">
                  Hemen Gönder
                </Label>
              </div>

              {!form.watch("sendNow") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">
                      Tarih
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      {...form.register("scheduledDate")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">
                      Saat
                    </Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      {...form.register("scheduledTime")}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {notification.sentAt && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <p className="text-sm text-green-400">
                Zaten gönderildi:{" "}
                {new Date(notification.sentAt).toLocaleString("tr-TR")}
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-sm font-semibold">
                Test Bildirimi
              </Label>
            </div>
            <TestNotificationButtons
              onTest={handleTestNotification}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </CustomDialogContent>
    </Dialog>
  );
};

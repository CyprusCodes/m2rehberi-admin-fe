"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { 
  Plus, 
  Smartphone, 
  Bell, 
  Link2, 
  Clock, 
  Send, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  MessageSquare,
  Zap
} from "lucide-react";
import { CustomDialogContent } from "@/components/ui/customDialogContent";
import { useState, useCallback, useEffect, useRef } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  createPushNotification,
} from "@/services/pushNotifications";
import { toast } from "sonner";
import { TestNotificationButtons } from "./testNotificationButtons";
import AppleFrame from "./apple-frame";
import AndroidFrame from "./android-frame";
import { fetchActiveServers } from "@/services/servers";
import { fetchAllStreamerPosts, fetchStreamers } from "@/services/streamers";
import { fetchActiveLotteries } from "@/services/lottery";
import { apiClient } from "@/lib/apiClient";
import { adminUserEndpoints, pushNotificationEndpoints } from "@/lib/endpoints";

export const createPushNotificationSchema = z.object({
  headline: z.string().min(1, "Başlık gereklidir").max(100),
  message: z.string().min(1, "Mesaj gereklidir").max(200),
  linkTo: z.enum(["server", "streamer_post", "streamer", "lottery"]).optional(),
  linkToId: z.string().optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  sendNow: z.boolean(),
});

interface CreatePushNotificationDialogProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export const CreatePushNotificationDialog = ({
  onSuccess,
  children,
}: CreatePushNotificationDialogProps) => {
  const [open, setOpen] = useState(false);

  // Reset selected user when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedUserId("");
    }
  }, [open]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleActualSubmitRef = useRef<(() => Promise<void>) | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const [isIOSPreview, setIsIOSPreview] = useState(false);
  const [linkToOptions, setLinkToOptions] = useState<
    Array<{ id: string; label: string; [key: string]: any }>
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [users, setUsers] = useState<Array<{ user_id: number; username: string; email: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSelectOpen, setUserSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof createPushNotificationSchema>>({
    resolver: zodResolver(createPushNotificationSchema),
    defaultValues: {
      headline: "",
      message: "",
      linkTo: undefined,
      linkToId: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      scheduledTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
      sendNow: false,
    },
  });

  const handleActualSubmit = useCallback(async () => {
    if (isSubmittingRef.current) {
      return;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    isSubmittingRef.current = true;
    const data = form.getValues();
    setIsSubmitting(true);
    try {
      let scheduledAt: string | undefined = undefined;
      if (!data.sendNow && data.scheduledDate && data.scheduledTime) {
        scheduledAt = `${data.scheduledDate} ${data.scheduledTime}:00`;
      } else if (!data.sendNow && data.scheduledDate) {
        scheduledAt = `${data.scheduledDate} 00:00:00`;
      }

      await createPushNotification({
        headline: data.headline,
        message: data.message,
        linkTo: data.linkTo,
        linkToId: data.linkToId,
        scheduledAt,
        sendNow: data.sendNow,
      });
      toast.success("Bildirim başarıyla oluşturuldu");
      setOpen(false);
      form.reset();
      setShowConfirmation(false);
      setCountdown(5);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: {
              data?: { [0]?: { message?: string }; message?: string };
            };
          }
        )?.response?.data?.[0]?.message ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage);
      setShowConfirmation(false);
      setCountdown(5);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [form, onSuccess]);

  handleActualSubmitRef.current = handleActualSubmit;

  const onSubmit = async (
    data: z.infer<typeof createPushNotificationSchema>
  ) => {
    if (isSubmittingRef.current) {
      return;
    }

    if (data.sendNow) {
      setCountdown(5);
      setShowConfirmation(true);
      return;
    }

    await handleActualSubmit();
  };

  const handleSendImmediately = async () => {
    if (isSubmittingRef.current) {
      return;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setShowConfirmation(false);
    setCountdown(5);
    await handleActualSubmit();
  };

  useEffect(() => {
    if (!showConfirmation || isSubmitting) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      return;
    }

    if (countdownIntervalRef.current) {
      return;
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          if (handleActualSubmitRef.current && !isSubmittingRef.current) {
            handleActualSubmitRef.current().catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [showConfirmation, isSubmitting]);

  useEffect(() => {
    if (!showConfirmation) {
      setCountdown(5);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      isSubmittingRef.current = false;
    }
  }, [showConfirmation]);

  // Fetch users with tokens when dialog opens
  useEffect(() => {
    if (open && users.length === 0) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const response = await apiClient.get(pushNotificationEndpoints.getUsersWithTokens);
          setUsers(response.data.users || []);
        } catch (error) {
          console.error("Failed to fetch users:", error);
          toast.error("Kullanıcılar yüklenirken hata oluştu");
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [open, users.length]);

  const handleTestNotification = async () => {
    const data = form.getValues();
    if (!data.headline || !data.message) {
      toast.error("Önce başlık ve mesaj alanlarını doldurun");
      return;
    }

    if (!selectedUserId) {
      toast.error("Lütfen test için bir kullanıcı seçin");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(pushNotificationEndpoints.create, {
        headline: data.headline,
        message: data.message,
        linkTo: data.linkTo,
        linkToId: data.linkToId,
        sendNow: true,
        targets: [parseInt(selectedUserId)],
      });
      toast.success("Test bildirimi başarıyla gönderildi");
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: {
              data?: { [0]?: { message?: string }; message?: string };
            };
          }
        )?.response?.data?.[0]?.message ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLinkToLabel = (linkTo: string | undefined) => {
    const labels: Record<string, string> = {
      server: "Sunucu",
      streamer_post: "Yayıncı Gönderisi",
      streamer: "Yayıncı",
      lottery: "Çekiliş",
    };
    return labels[linkTo || ""] || linkTo || "";
  };

  // Fetch options based on linkTo type
  const linkTo = useWatch({
    control: form.control,
    name: "linkTo",
  });

  useEffect(() => {
    if (!linkTo) {
      setLinkToOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        switch (linkTo) {
          case "server": {
            const serversRes = await fetchActiveServers({
              pageSize: 100,
            });
            const servers = serversRes.data || [];
            setLinkToOptions(
              servers.map((server: any) => ({
                id: String(server.server_id),
                label: server.server_name,
              }))
            );
            break;
          }
          case "streamer_post": {
            const postsRes = await fetchAllStreamerPosts({
              pageSize: 100,
            });
            const posts = postsRes.data || [];
            // Filter active posts (published and not deleted)
            const activePosts = posts.filter(
              (post: any) =>
                post.published_at &&
                !post.deleted_at &&
                post.is_active !== false
            );
            setLinkToOptions(
              activePosts.map((post: any) => ({
                id: String(post.id),
                label: `${
                  post.display_name || post.handle
                }: ${post.content?.substring(0, 50)}...`,
              }))
            );
            break;
          }
          case "streamer": {
            const streamers = await fetchStreamers();
            // Filter active and approved streamers
            const activeStreamers = streamers.filter(
              (streamer: any) =>
                streamer.is_active === 1 &&
                streamer.approval_status === "approved" &&
                !streamer.deleted_at
            );
            setLinkToOptions(
              activeStreamers.map((streamer: any) => ({
                id: String(streamer.id),
                label: streamer.display_name || streamer.handle,
              }))
            );
            break;
          }
          case "lottery": {
            const lotteriesRes = await fetchActiveLotteries();
            const lotteries = lotteriesRes.data || [];
            // Already filtered for active lotteries (end_date > NOW)
            setLinkToOptions(
              lotteries.map((lottery: any) => ({
                id: String(lottery.lottery_id),
                label: lottery.title,
              }))
            );
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Seçenekler yüklenirken bir hata oluştu");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [linkTo]);

  return (
    <Dialog
      modal={false}
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setShowConfirmation(false);
          isSubmittingRef.current = false;
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        }
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-fit rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Yeni Bildirim Oluştur</span>
          </Button>
        )}
      </DialogTrigger>
      <CustomDialogContent
        wrapperClassName={
          showConfirmation
            ? "overflow-hidden items-center !px-0"
            : "overflow-y-auto items-start justify-center !px-8 !pt-6"
        }
        bodyClassName={
          showConfirmation
            ? "!w-full !mt-0 !max-w-md mx-auto !py-8"
            : "!w-full !mt-0 !max-w-full mx-auto !py-4"
        }
        title={showConfirmation ? undefined : "Yeni Push Bildirimi Oluştur"}
        hideTitle={showConfirmation}
        onConfirm={showConfirmation ? undefined : form.handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      >
        {showConfirmation ? (
          <div className="flex flex-col items-center justify-center w-full space-y-6 py-8 px-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                <Bell className="w-10 h-10 text-purple-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Bildirimi Gönder
              </h3>
              <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                Bu bildirim hemen tüm kullanıcılara gönderilecek. Devam etmek istediğinizden emin misiniz?
              </p>
            </div>

            <Card className="w-full border-purple-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Başlık
                    </span>
                    <p className="text-sm text-white font-semibold mt-1.5 wrap-break-words">
                      {form.watch("headline")}
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Bell className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Mesaj
                    </span>
                    <p className="text-sm text-gray-300 mt-1.5 line-clamp-3 wrap-break-words">
                      {form.watch("message")}
                    </p>
                  </div>
                </div>

                {form.watch("linkTo") && form.watch("linkToId") && (
                  <>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Link2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Bağlantı
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                            {getLinkToLabel(form.watch("linkTo"))}
                          </Badge>
                          <span className="text-sm text-white font-medium truncate">
                            {linkToOptions.find(opt => opt.id === form.watch("linkToId"))?.label || form.watch("linkToId")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Otomatik gönderim: <span className="text-purple-400 font-semibold">{countdown} saniye</span>
                </span>
                <span className="text-gray-400 font-medium">{Math.round(((5 - countdown) / 5) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                  className="h-full bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 transition-all duration-1000 ease-linear rounded-full shadow-lg shadow-purple-500/50"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => {
                  if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                  }
                  setShowConfirmation(false);
                  setCountdown(5);
                }}
                disabled={isSubmitting}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button
                className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25"
                onClick={handleSendImmediately}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gönderiliyor...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Hemen Gönder
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Preview Section */}
            <div className="hidden lg:block order-2 lg:order-1">
              <Card className="h-full border-purple-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Mobil Önizleme
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                      <span
                        className={`text-xs font-medium transition-colors ${
                          !isIOSPreview ? "text-white" : "text-gray-500"
                        }`}
                      >
                        Android
                      </span>
                      <Switch
                        checked={isIOSPreview}
                        onCheckedChange={setIsIOSPreview}
                        className="data-[state=checked]:bg-purple-600"
                      />
                      <span
                        className={`text-xs font-medium transition-colors ${
                          isIOSPreview ? "text-white" : "text-gray-500"
                        }`}
                      >
                        iOS
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-xl border border-gray-700/50 shadow-2xl"
                    style={{
                      backgroundImage: isIOSPreview
                        ? "url('/assets/push-notifications-images/ios-simulator.png')"
                        : "url('/assets/push-notifications-images/android-simulator.png')",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      height: "797px",
                      width: "100%",
                    }}
                  >
                    {isIOSPreview ? (
                      <AppleFrame
                        title={form.watch("headline") || "Başlık"}
                        message={form.watch("message") || "Bildirim mesajı"}
                      />
                    ) : (
                      <AndroidFrame
                        title={form.watch("headline") || "Başlık"}
                        message={form.watch("message") || "Bildirim mesajı"}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Section */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full order-1 lg:order-2"
            >
              {/* Notification Content Card */}
              <Card className="border-purple-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-400" />
                    <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      Bildirim İçeriği
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="headline" className="text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      Başlık
                    </Label>
                    <div className="relative">
                      <Input
                        id="headline"
                        {...form.register("headline")}
                        placeholder="Örn: Yeni sunucu açıldı!"
                        maxLength={100}
                        className="h-11 pr-16 bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                        {form.watch("headline")?.length || 0}/100
                      </div>
                    </div>
                    {form.formState.errors.headline && (
                      <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {form.formState.errors.headline.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      Mesaj
                    </Label>
                    <div className="relative">
                      <textarea
                        id="message"
                        {...form.register("message")}
                        placeholder="Örn: Yeni sunucumuza katıl ve harika ödüller kazan!"
                        maxLength={200}
                        rows={4}
                        className="flex w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2.5 pr-16 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-medium">
                        {form.watch("message")?.length || 0}/200
                      </div>
                    </div>
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Link Selection Card */}
              <Card className="border-indigo-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-indigo-400" />
                    <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Bağlantı Ayarları
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkTo" className="text-sm font-semibold">
                      Bağlantı Tipi
                    </Label>
                    <Select
                      value={form.watch("linkTo") || ""}
                      onValueChange={(value) => {
                        form.setValue(
                          "linkTo",
                          value as
                            | "server"
                            | "streamer_post"
                            | "streamer"
                            | "lottery"
                            | undefined
                        );
                        form.setValue("linkToId", "");
                      }}
                    >
                      <SelectTrigger className="h-11 bg-gray-900/50 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Bağlantı tipi seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="server">Sunucu</SelectItem>
                        <SelectItem value="streamer_post">
                          Yayıncı Gönderisi
                        </SelectItem>
                        <SelectItem value="streamer">Yayıncı</SelectItem>
                        <SelectItem value="lottery">Çekiliş</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.watch("linkTo") && (
                    <div className="space-y-2">
                      <Label htmlFor="linkToId" className="text-sm font-semibold">
                        {getLinkToLabel(form.watch("linkTo"))} Seçin
                      </Label>
                      {loadingOptions ? (
                        <div className="h-11 flex items-center justify-center border border-gray-700 bg-gray-900/50 rounded-md">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-400">
                            Yükleniyor...
                          </span>
                        </div>
                      ) : linkToOptions.length === 0 ? (
                        <div className="h-11 flex items-center justify-center border border-gray-700 bg-gray-900/50 rounded-md">
                          <AlertCircle className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-400">
                            Aktif{" "}
                            {getLinkToLabel(form.watch("linkTo")).toLowerCase()}{" "}
                            bulunamadı
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={form.watch("linkToId") || ""}
                          onValueChange={(value) => {
                            form.setValue("linkToId", value);
                          }}
                        >
                          <SelectTrigger className="h-11 bg-gray-900/50 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20">
                            <SelectValue
                              placeholder={`${getLinkToLabel(
                                form.watch("linkTo")
                              )} seçin`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {linkToOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {form.formState.errors.linkToId && (
                        <p className="text-sm text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {form.formState.errors.linkToId.message}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Schedule Card */}
              <Card className="border-green-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Gönderim Zamanı
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 cursor-pointer transition-colors group">
                      <input
                        type="radio"
                        id="sendNow-true"
                        name="sendNow"
                        checked={form.watch("sendNow") === true}
                        onChange={() => form.setValue("sendNow", true)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
                          <span className="text-sm font-semibold text-white">
                            Hemen Gönder
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Bildirim hemen tüm kullanıcılara gönderilecek
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 cursor-pointer transition-colors group">
                      <input
                        type="radio"
                        id="sendNow-false"
                        name="sendNow"
                        checked={form.watch("sendNow") === false}
                        onChange={() => form.setValue("sendNow", false)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                          <span className="text-sm font-semibold text-white">
                            Zamanlanmış Gönderim
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Bildirim belirlediğiniz tarih ve saatte gönderilecek
                        </p>
                      </div>
                    </label>
                  </div>

                  {!form.watch("sendNow") && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="scheduledDate"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-green-400" />
                          Tarih
                        </Label>
                        <Input
                          id="scheduledDate"
                          type="date"
                          {...form.register("scheduledDate")}
                          className="h-11 bg-gray-900/50 border-gray-700 focus:border-green-500 focus:ring-green-500/20"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="scheduledTime"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-green-400" />
                          Saat
                        </Label>
                        <Input
                          id="scheduledTime"
                          type="time"
                          {...form.register("scheduledTime")}
                          className="h-11 bg-gray-900/50 border-gray-700 focus:border-green-500 focus:ring-green-500/20"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Test Notification Card */}
              <Card className="border-blue-500/20 bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Test Bildirimi
                    </span>
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-1">
                    Bildirimi göndermeden önce test edebilirsiniz
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Selection */}
                  <div className="space-y-4">
                    <Label htmlFor="test-user-select" className="text-sm font-medium">
                      Test İçin Kullanıcı Seçin
                    </Label>

                    {/* Selected User Card */}
                    {selectedUserId && (
                      <Card className="p-4 bg-blue-50 border-blue-200">
                        {(() => {
                          const selectedUser = users.find(u => String(u.user_id) === selectedUserId);
                          if (!selectedUser) return null;

                          return (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {(selectedUser.first_name?.[0] || selectedUser.username?.[0] || selectedUser.email?.[0] || '?').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {selectedUser.first_name && selectedUser.last_name
                                      ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                      : selectedUser.username || selectedUser.email}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {selectedUser.username && selectedUser.username !== selectedUser.email ? `@${selectedUser.username} • ` : ""}
                                    {selectedUser.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {selectedUser.platforms?.split(',').map((platform: string, platformIndex: number) => (
                                  <span
                                    key={`${selectedUser.user_id}-${platform}-${platformIndex}`}
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      platform === 'IOS'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {platform}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </Card>
                    )}

                    <Popover open={userSelectOpen} onOpenChange={setUserSelectOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userSelectOpen}
                          className="w-full justify-between"
                          disabled={loadingUsers}
                        >
                          {selectedUserId ? (() => {
                            const user = users.find(u => String(u.user_id) === selectedUserId);
                            return user ? (
                              user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.username || user.email
                            ) : "Kullanıcı seçin";
                          })() : loadingUsers ? "Kullanıcılar yükleniyor..." : "Test kullanıcısı seçin"}
                          <span className="ml-2 opacity-50">▼</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Kullanıcı ara..." />
                          <CommandList>
                            <CommandEmpty>Kullanıcı bulunamadı.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.user_id}
                                  value={`${user.first_name || ''} ${user.last_name || ''} ${user.username || ''} ${user.email || ''}`}
                                  onSelect={(value) => {
                                    setSelectedUserId(String(user.user_id));
                                    setUserSelectOpen(false);
                                  }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {user.first_name && user.last_name
                                          ? `${user.first_name} ${user.last_name}`
                                          : user.username || user.email}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {user.username && user.username !== user.email ? `@${user.username} • ` : ""}
                                        {user.email}
                                      </span>
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                      {user.platforms?.split(',').map((platform: string, platformIndex: number) => (
                                        <span
                                          key={`${user.user_id}-${platform}-${platformIndex}`}
                                          className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                                            platform === 'IOS'
                                              ? 'bg-purple-100 text-purple-700'
                                              : 'bg-blue-100 text-blue-700'
                                          }`}
                                        >
                                          {platform}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <TestNotificationButtons
                    onTest={handleTestNotification}
                    disabled={isSubmitting}
                    selectedUser={selectedUserId}
                  />
                </CardContent>
              </Card>
            </form>
          </div>
        )}
      </CustomDialogContent>
    </Dialog>
  );
};

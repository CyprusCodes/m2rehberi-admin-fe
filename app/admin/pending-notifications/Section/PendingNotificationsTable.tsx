"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment";
import "moment/locale/tr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Users,
  Globe,
  Clock,
  Bell,
  Inbox,
  CheckCheck,
  X,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  Activity,
  Send,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchPendingNotifications,
  PendingNotification,
  PendingNotificationsResponse,
  approvePendingNotification,
  rejectPendingNotification,
} from "@/services/streamers";
import { useToast } from "@/hooks/use-toast";
import { ApproveRejectDialog } from "./ApproveRejectDialog";

export const PendingNotificationsTable = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<PendingNotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<PendingNotification | null>(null);
  const [dialogMode, setDialogMode] = useState<"approve" | "reject">("approve");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPendingNotifications({
        limit: 50,
        offset: 0,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching pending notifications:", error);
      toast({
        title: "Hata",
        description: "Bildirimler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = useCallback((notification: PendingNotification) => {
    setSelectedNotification(notification);
    setDialogMode("approve");
    setDialogOpen(true);
  }, []);

  const handleReject = useCallback((notification: PendingNotification) => {
    setSelectedNotification(notification);
    setDialogMode("reject");
    setDialogOpen(true);
  }, []);

  const handleDialogConfirm = useCallback(
    async (note: string) => {
      if (!selectedNotification) return;

      try {
        let result;
        if (dialogMode === "approve") {
          result = await approvePendingNotification(
            selectedNotification.id,
            note,
          );
          if (result && result.success) {
            toast({
              title: "✅ Başarılı",
              description: "Bildirim onaylandı ve kullanıcılara gönderildi",
              variant: "default",
            });
          } else {
            throw new Error("API yanıtında hata");
          }
        } else {
          result = await rejectPendingNotification(
            selectedNotification.id,
            note,
          );
          if (result && result.success) {
            toast({
              title: "✅ Başarılı",
              description: "Bildirim reddedildi ve yayıncıya bildirildi",
              variant: "default",
            });
          } else {
            throw new Error("API yanıtında hata");
          }
        }
        await fetchData();
      } catch (error: any) {
        console.error("Error processing notification:", error);
        toast({
          title: "❌ Hata",
          description: error?.message || "İşlem sırasında bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setDialogOpen(false);
        setSelectedNotification(null);
      }
    },
    [selectedNotification, dialogMode, toast, fetchData],
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 font-semibold px-3 py-1"
          >
            <Clock className="h-3 w-3 mr-1.5" />
            Bekliyor
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="bg-linear-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-3 py-1"
          >
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Onaylandı
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="secondary"
            className="bg-linear-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/30 font-semibold px-3 py-1"
          >
            <XCircle className="h-3 w-3 mr-1.5" />
            Reddedildi
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-white/20 text-white/60">
            Bilinmiyor
          </Badge>
        );
    }
  };

  const getAudienceIcon = (audience: string) => {
    return audience === "followers" ? (
      <Users className="h-4 w-4 text-blue-400" />
    ) : (
      <Globe className="h-4 w-4 text-emerald-400" />
    );
  };

  const getAudienceText = (audience: string) => {
    return audience === "followers" ? "Takipçiler" : "Tüm Kullanıcılar";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3.5 rounded-xl h-14 w-14 animate-pulse" />
                  <div className="space-y-2.5 flex-1">
                    <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse" />
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Table Skeleton */}
        <Card className="relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
          <CardContent className="relative p-0">
            <div className="p-6 border-b border-white/10">
              <div className="h-6 w-48 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70 font-bold">
                    Yayıncı
                  </TableHead>
                  <TableHead className="text-white/70 font-bold">
                    Bildirim İçeriği
                  </TableHead>
                  <TableHead className="text-white/70 font-bold">
                    Hedef Kitle
                  </TableHead>
                  <TableHead className="text-white/70 font-bold">
                    Tarih
                  </TableHead>
                  <TableHead className="text-white/70 font-bold">
                    Durum
                  </TableHead>
                  <TableHead className="text-white/70 font-bold text-right">
                    İşlemler
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i} className="border-white/10">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                          <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="h-4 w-36 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-52 bg-white/10 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="h-7 w-24 bg-white/10 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell className="py-5 text-right">
                      <div className="h-9 w-9 bg-white/10 rounded-lg animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.notifications || data.notifications.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <CardContent className="relative flex flex-col items-center justify-center py-24 space-y-8">
          {/* Empty State Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="relative bg-linear-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 p-10 rounded-3xl border border-white/10">
              <Inbox className="h-24 w-24 text-blue-400/80" />
              <div className="absolute -top-3 -right-3 bg-amber-500/20 p-3 rounded-full border border-amber-500/30 animate-pulse">
                <Clock className="h-7 w-7 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Empty State Text */}
          <div className="text-center space-y-4 max-w-lg">
            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
              Henüz Bildirim Yok
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Şu anda bekleyen bildirim bulunmuyor. Yayıncılar yeni bildirim
              talepleri gönderdiğinde buradan yönetebileceksiniz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 px-6 py-6 text-base font-semibold"
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Yenileniyor..." : "Yenile"}
            </Button>
            <Button
              onClick={() => router.push("/admin/streamers")}
              variant="outline"
              size="lg"
              className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300 px-6 py-6 text-base font-semibold"
            >
              <Users className="h-5 w-5 mr-2" />
              Yayıncıları Görüntüle
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const pendingCount = data.notifications.filter(
    (n) => n.status === "pending",
  ).length;
  const approvedCount = data.notifications.filter(
    (n) => n.status === "approved",
  ).length;
  const rejectedCount = data.notifications.filter(
    (n) => n.status === "rejected",
  ).length;
  const totalCount = data.notifications.length;

  return (
    <>
      <div className="space-y-6">
        {/* Corporate Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Notifications */}
          <Card className="group relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl group-hover:bg-white/15 transition-all duration-300">
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-0.5">
                    {totalCount}
                  </div>
                  <div className="text-white/60 text-sm font-semibold tracking-wide">
                    TOPLAM
                  </div>
                  <div className="text-white/40 text-xs font-medium">
                    Bildirim kaydı
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Notifications */}
          <Card className="group relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl group-hover:bg-white/15 transition-all duration-300">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-0.5">
                    {pendingCount}
                  </div>
                  <div className="text-white/60 text-sm font-semibold tracking-wide">
                    BEKLEYEN
                  </div>
                  <div className="text-white/40 text-xs font-medium">
                    Onay gerekiyor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Notifications */}
          <Card className="group relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl group-hover:bg-white/15 transition-all duration-300">
                  <CheckCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-0.5">
                    {approvedCount}
                  </div>
                  <div className="text-white/60 text-sm font-semibold tracking-wide">
                    ONAYLANDI
                  </div>
                  <div className="text-white/40 text-xs font-medium">
                    Gönderildi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected Notifications */}
          <Card className="group relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3.5 rounded-xl group-hover:bg-white/15 transition-all duration-300">
                  <X className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-black text-white mb-0.5">
                    {rejectedCount}
                  </div>
                  <div className="text-white/60 text-sm font-semibold tracking-wide">
                    REDDEDİLDİ
                  </div>
                  <div className="text-white/40 text-xs font-medium">
                    İptal edildi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Table Card */}
        <Card className="relative overflow-hidden bg-white/3 border-white/10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />

          {/* Table Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-blue-500/20 to-purple-500/20 p-2.5 rounded-lg border border-blue-500/20">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Bildirim Listesi
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    {totalCount} toplam kayıt
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Yenile
              </Button>
            </div>
          </div>

          <CardContent className="relative p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide">
                      YAYINCI
                    </TableHead>
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide">
                      BİLDİRİM İÇERİĞİ
                    </TableHead>
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide">
                      HEDEF KİTLE
                    </TableHead>
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide">
                      TARİH
                    </TableHead>
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide">
                      DURUM
                    </TableHead>
                    <TableHead className="text-white/80 font-bold text-sm tracking-wide text-right">
                      İŞLEMLER
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.notifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      className="border-white/10 hover:bg-white/5 transition-colors duration-300 group"
                    >
                      {/* Streamer Info */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
                              <AvatarImage
                                src={notification.streamer_avatar_url || ""}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                                {notification.streamer_display_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {notification.status === "pending" && (
                              <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-2 border-slate-900 animate-pulse" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                              {notification.streamer_display_name}
                            </div>
                            <div className="text-slate-400 text-sm font-medium">
                              @{notification.streamer_handle}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Notification Content */}
                      <TableCell className="py-5 max-w-md">
                        <div className="space-y-1.5">
                          <div className="font-bold text-white text-base truncate flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            {notification.headline}
                          </div>
                          <div className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                            {notification.message}
                          </div>
                        </div>
                      </TableCell>

                      {/* Audience */}
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2.5 px-3 py-2 bg-white/5 rounded-lg border border-white/10 w-fit">
                          {getAudienceIcon(notification.audience)}
                          <span className="text-white/90 font-semibold text-sm">
                            {getAudienceText(notification.audience)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-5">
                        <div className="space-y-1">
                          <div className="text-white/80 font-semibold">
                            {moment(notification.created_at)
                              .locale("tr")
                              .format("DD MMM YYYY")}
                          </div>
                          <div className="text-slate-400 text-xs font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {moment(notification.created_at)
                              .locale("tr")
                              .format("HH:mm")}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-5">
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(notification.status)}
                          {notification.approved_by && (
                            <div className="text-emerald-400/90 text-xs flex items-center gap-1.5 font-medium">
                              <CheckCircle className="h-3 w-3" />
                              <span>
                                {notification.approved_by_first_name}{" "}
                                {notification.approved_by_last_name}
                              </span>
                            </div>
                          )}
                          {notification.rejected_by && (
                            <div className="text-red-400/90 text-xs flex items-center gap-1.5 font-medium">
                              <XCircle className="h-3 w-3" />
                              <span>
                                {notification.rejected_by_first_name}{" "}
                                {notification.rejected_by_last_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-10 w-10 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                            >
                              <span className="sr-only">Menü aç</span>
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900/95 backdrop-blur-xl border-white/20 min-w-[200px]"
                          >
                            <DropdownMenuLabel className="text-white font-bold">
                              İşlemler
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/20" />
                            {notification.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(notification)}
                                  className="text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20 cursor-pointer font-semibold"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Onayla ve Gönder
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReject(notification)}
                                  className="text-red-300 hover:text-red-200 hover:bg-red-500/20 cursor-pointer font-semibold"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reddet
                                </DropdownMenuItem>
                              </>
                            )}
                            {notification.status !== "pending" && (
                              <DropdownMenuItem
                                disabled
                                className="text-white/50 font-medium"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                İşlem Tamamlandı
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ApproveRejectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        notification={selectedNotification}
        mode={dialogMode}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};

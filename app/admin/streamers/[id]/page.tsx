"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  ExternalLink,
  Video,
  Settings,
  CheckCircle,
  XCircle,
  Power,
  AlertTriangle,
  Ban,
  Check,
  Bell,
  Award,
  Wallet,
  Activity,
  Shield,
  History,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  fetchStreamerById,
  toggleStreamerStatus,
  toggleStreamerVerification,
  approveStreamer,
  rejectStreamer,
  updateStreamer,
  fetchStreamerNotificationCredits,
  assignStreamerNotificationCredits,
  getStreamerStreamHistory,
  StreamerNotificationCreditsResponse,
  StreamHistoryResponse,
  StreamHistoryRecord,
  adminStopStreamerLive,
} from "@/services/streamers";
import { StreamerApprovalModal } from "../Section/StreamerApprovalModal";
import { AssignNotificationCreditsModal } from "../Section/AssignNotificationCreditsModal";
import useFetchData from "@/lib/use-fetch-data";
import moment from "moment";
import "moment/locale/tr";
import { cn } from "@/lib/utils";

export default function StreamerDetailPage() {
  const params = useParams();
  const streamerId = params.id as string;
  const [loading, errored, data, refetch] = useFetchData(
    () => fetchStreamerById(streamerId),
    [streamerId],
    { enabled: !!streamerId },
  ) as any;
  const streamer: any = data;
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean;
    action: "approve" | "reject";
  }>({
    open: false,
    action: "approve",
  });
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [notificationLogsOpen, setNotificationLogsOpen] = useState(false);
  const [notificationCredits, setNotificationCredits] =
    useState<StreamerNotificationCreditsResponse | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [badgeUrl, setBadgeUrl] = useState("");
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [streamHistory, setStreamHistory] = useState<StreamHistoryRecord[]>([]);
  const [streamHistoryLoading, setStreamHistoryLoading] = useState(false);
  const DEFAULT_STOP_LIVE_TITLE = "OynaGG Moderasyon";
  const DEFAULT_STOP_LIVE_MESSAGE =
    "Yayının uzun süredir etkileşim almadan açık kaldığı tespit edildi. Moderasyon ekibimiz tarafından kapatılmıştır.";
  const [stopLiveDialogOpen, setStopLiveDialogOpen] = useState(false);
  const [sendStopNotification, setSendStopNotification] = useState(true);
  const [stopLiveLoading, setStopLiveLoading] = useState(false);
  const [stopNotificationTitle, setStopNotificationTitle] = useState(
    DEFAULT_STOP_LIVE_TITLE,
  );
  const [stopNotificationMessage, setStopNotificationMessage] = useState(
    DEFAULT_STOP_LIVE_MESSAGE,
  );

  useEffect(() => {
    if (streamer) {
      setBadgeUrl(streamer.badge_url || "");
    }
  }, [streamer]);

  useEffect(() => {
    if (stopLiveDialogOpen) {
      setSendStopNotification(true);
      setStopNotificationTitle(DEFAULT_STOP_LIVE_TITLE);
      setStopNotificationMessage(DEFAULT_STOP_LIVE_MESSAGE);
    }
  }, [stopLiveDialogOpen]);

  const handleBadgeUpdate = async () => {
    setBadgeLoading(true);
    try {
      await updateStreamer(streamerId, { badge_url: badgeUrl });
      refetch();
    } catch (error) {
      console.error("Error updating badge:", error);
    } finally {
      setBadgeLoading(false);
    }
  };

  // Fetch notification credits
  const fetchCredits = async () => {
    try {
      setCreditsLoading(true);
      const credits = await fetchStreamerNotificationCredits(streamerId);
      setNotificationCredits(credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setCreditsLoading(false);
    }
  };

  const fetchStreamHistory = async () => {
    setStreamHistoryLoading(true);
    try {
      const history = await getStreamerStreamHistory(streamerId);
      setStreamHistory(history.history);
    } catch (error) {
      console.error("Error fetching stream history:", error);
    } finally {
      setStreamHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    if (streamerId) {
      fetchCredits();
      fetchStreamHistory();
    }
  }, [streamerId]);

  const handleAssignCredits = async (data: {
    pushCount: number;
    isPaymentReceived: boolean;
    paymentNote: string;
  }) => {
    await assignStreamerNotificationCredits(streamerId, data);
    await fetchCredits();
  };

  const handleStatusToggle = async (newStatus: "active" | "inactive") => {
    setActionLoading("status");
    try {
      await toggleStreamerStatus(streamerId, newStatus);
      await refetch(); // Refresh the data
    } catch (e: any) {
      console.error("Status update failed:", e);
      alert(e?.message || "Durum güncellenemedi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdminStopLive = async () => {
    setStopLiveLoading(true);
    try {
      const payload: Record<string, any> = {
        sendNotification: sendStopNotification,
      };

      if (sendStopNotification) {
        payload.notificationTitle = stopNotificationTitle;
        payload.notificationMessage = stopNotificationMessage;
      }

      await adminStopStreamerLive(streamerId, payload);
      await Promise.all([refetch(), fetchStreamHistory()]);
      setStopLiveDialogOpen(false);
    } catch (e: any) {
      console.error("Admin stop live failed:", e);
      alert(e?.message || "Yayın sonlandırılamadı");
    } finally {
      setStopLiveLoading(false);
    }
  };

  const handleVerificationToggle = async (verified: boolean) => {
    setActionLoading("verification");
    try {
      await toggleStreamerVerification(streamerId, verified);
      await refetch(); // Refresh the data
    } catch (e: any) {
      console.error("Verification update failed:", e);
      alert(e?.message || "Doğrulama durumu güncellenemedi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproval = () => {
    setApprovalModal({
      open: true,
      action: "approve",
    });
  };

  const handleRejection = () => {
    setApprovalModal({
      open: true,
      action: "reject",
    });
  };

  const handleApprovalSubmit = async (
    streamerId: string,
    action: "approve" | "reject",
    reason: string,
  ) => {
    setActionLoading(action === "approve" ? "approval" : "rejection");

    try {
      if (action === "approve") {
        await approveStreamer(streamerId, reason || undefined);
      } else {
        await rejectStreamer(streamerId, reason);
      }
      await refetch(); // Refresh the data
    } catch (e: any) {
      console.error("Approval action failed:", e);
      alert(
        e?.message ||
          `Yayıncı ${action === "approve" ? "onaylanamadı" : "reddedilemedi"}`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="text-muted-foreground animate-pulse">
            Yayıncı bilgileri yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  if (errored || !streamer) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center space-y-4">
          <div className="bg-red-500/10 p-4 rounded-full w-fit mx-auto">
            <User className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Yayıncı Bulunamadı</h2>
          <p className="text-muted-foreground">
            Aradığınız yayıncı mevcut değil veya bir hata oluştu.
          </p>
          <Link href="/admin/streamers">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Yayıncılara Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20 px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1.5" />
            Aktif
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="secondary"
            className="bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 border-slate-500/20 px-3 py-1"
          >
            Pasif
          </Badge>
        );
      case "banned":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20 px-3 py-1"
          >
            Yasaklı
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20 px-3 py-1">
            <Clock className="w-3 h-3 mr-1.5" />
            Beklemede
          </Badge>
        );
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const createdAtStr = streamer.created_at
    ? moment(streamer.created_at).locale("tr").format("LL")
    : "-";
  const updatedAtStr = streamer.updated_at
    ? moment(streamer.updated_at).locale("tr").format("LL")
    : "-";
  const isLiveActive = Boolean(streamer.is_live_active);
  const liveStartFormatted =
    isLiveActive && streamer.started_at
      ? moment(streamer.started_at).locale("tr").format("LLL")
      : null;

  const socialLinks = [
    {
      label: "Ana Link",
      url: streamer.main_link_url,
      icon: ExternalLink,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Kick",
      url: streamer.kick_url,
      icon: Video,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "YouTube",
      url: streamer.youtube_url,
      icon: Video,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
    {
      label: "Twitch",
      url: streamer.twitch_url,
      icon: Video,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Instagram",
      url: streamer.instagram_url,
      icon: ExternalLink,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "TikTok",
      url: streamer.tiktok_url,
      icon: Video,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "X (Twitter)",
      url: streamer.x_url,
      icon: ExternalLink,
      color: "text-white",
      bg: "bg-white/10",
    },
    {
      label: "Website",
      url: streamer.website_url,
      icon: ExternalLink,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
  ].filter((link) => link.url);

  return (
    <div className="relative min-h-screen bg-black text-foreground pb-20">
      {/* Background Image with Blur Effect */}
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(https://img.freepik.com/free-photo/liquid-marbling-paint-texture-background-fluid-painting_1258-82940.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[30px]" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link href="/admin/streamers">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Listeye Dön
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {getStatusBadge(streamer.is_active ? "active" : "inactive")}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative z-10 bg-slate-900">
                {streamer.avatar_url ? (
                  <img
                    src={streamer.avatar_url}
                    alt={streamer.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <User className="w-12 h-12" />
                  </div>
                )}
                {/* Status Indicator */}
                <div
                  className={cn(
                    "absolute bottom-0 right-0 w-full h-1.5",
                    streamer.is_active ? "bg-emerald-500" : "bg-slate-500",
                  )}
                />
              </div>
              {/* Badge Overlay */}
              {streamer.badge_url && (
                <div className="absolute -top-3 -right-3 z-20 bg-slate-950 rounded-full p-1 border border-white/10 shadow-lg">
                  <img
                    src={streamer.badge_url}
                    alt="Badge"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 mb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {streamer.display_name}
                </h1>
                {streamer.is_verified && (
                  <div
                    className="bg-blue-500/20 p-1.5 rounded-full"
                    title="Doğrulanmış Yayıncı"
                  >
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/50 text-sm md:text-base">
                <span className="flex items-center gap-1.5">
                  <span className="text-blue-400">@</span>
                  {streamer.handle}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Katılma: {createdAtStr}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {streamer.approval_status === "pending" && (
                <Button
                  onClick={handleApproval}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                >
                  <Check className="w-4 h-4 mr-2" /> Onayla
                </Button>
              )}
              <Button
                onClick={() => window.open(streamer.main_link_url, "_blank")}
                variant="outline"
                size="lg"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Profili Görüntüle
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl mb-8 overflow-x-auto flex-nowrap">
            <TabsTrigger
              value="overview"
              className="flex-1 min-w-[120px] py-3 text-base data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-white/50 transition-all"
            >
              <Activity className="w-4 h-4 mr-2" /> Genel Bakış
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex-1 min-w-[120px] py-3 text-base data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-white/50 transition-all"
            >
              <Wallet className="w-4 h-4 mr-2" /> Push Krediler
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 min-w-[120px] py-3 text-base data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-white/50 transition-all"
            >
              <Settings className="w-4 h-4 mr-2" /> Yönetim
            </TabsTrigger>
            <TabsTrigger
              value="stream-history"
              className="flex-1 min-w-[120px] py-3 text-base data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none text-white/50 transition-all"
            >
              <History className="w-4 h-4 mr-2" /> Yayın Geçmişi
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* About Card */}
              <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="w-5 h-5 text-blue-400" />
                    Hakkında
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white/40 uppercase text-xs tracking-wider">
                      Bio
                    </Label>
                    <p className="text-white/80 leading-relaxed text-lg font-light">
                      {streamer.bio || "Henüz bir biyografi eklenmemiş."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <Label className="text-white/40 uppercase text-xs tracking-wider">
                        Ad Soyad
                      </Label>
                      <div className="text-white mt-1 font-medium">
                        {streamer.first_name} {streamer.last_name || "-"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/40 uppercase text-xs tracking-wider">
                        Sistem ID
                      </Label>
                      <div className="text-white mt-1 font-mono text-sm opacity-70">
                        #{streamer.id}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/40 uppercase text-xs tracking-wider">
                        Oluşturulma
                      </Label>
                      <div className="text-white mt-1 text-sm">
                        {createdAtStr}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/40 uppercase text-xs tracking-wider">
                        Son Güncelleme
                      </Label>
                      <div className="text-white mt-1 text-sm">
                        {updatedAtStr}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats or Status */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Durum Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-sm text-white/50">Onay Durumu</div>
                    <div className="flex items-center gap-2">
                      {streamer.approval_status === "approved" ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="font-semibold text-emerald-400">
                            Onaylandı
                          </span>
                        </>
                      ) : streamer.approval_status === "rejected" ? (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="font-semibold text-red-400">
                            Reddedildi
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 text-amber-400" />
                          <span className="font-semibold text-amber-400">
                            Beklemede
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-sm text-white/50">Yayıncı Kimliği</div>
                    <div className="flex items-center gap-2">
                      {streamer.is_verified ? (
                        <>
                          <Shield className="w-5 h-5 text-blue-400" />
                          <span className="font-semibold text-blue-400">
                            Doğrulanmış Hesap
                          </span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-400">
                            Doğrulanmamış
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl mb-3 transition-colors",
                      link.bg,
                    )}
                  >
                    <link.icon className={cn("w-6 h-6", link.color)} />
                  </div>
                  <span className="text-white font-medium">{link.label}</span>
                  <span className="text-white/30 text-xs mt-1 group-hover:text-blue-400 transition-colors">
                    Görüntüle
                  </span>
                </a>
              ))}
            </div>

            {/* Additional JSON Data */}
            {streamer.socials_json &&
              Object.keys(streamer.socials_json).length > 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-white/50 uppercase">
                      Ham Sosyal Medya Verisi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-white/70">
                      {JSON.stringify(streamer.socials_json, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent
            value="wallet"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Credit Stats */}
              <Card className="bg-linear-to-br from-blue-900/40 to-slate-900/40 border-blue-500/20 backdrop-blur-sm text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">
                    Kalan Kredi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold tracking-tighter text-white">
                    {loading || creditsLoading
                      ? "..."
                      : notificationCredits?.remainingCredits}
                  </div>
                  <p className="text-blue-300/60 text-sm mt-1">
                    Bildirim gönderme hakkı
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/50">
                    Toplam Tanımlanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-white">
                    {loading || creditsLoading
                      ? "-"
                      : notificationCredits?.totalCredits}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/50">
                    Kullanılan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-white">
                    {loading || creditsLoading
                      ? "-"
                      : notificationCredits?.usedCredits}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setCreditsModalOpen(true)}
                className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
              >
                <Bell className="w-5 h-5 mr-2" />
                Yeni Kredi Tanımla
              </Button>
              <Button
                onClick={() => setNotificationLogsOpen(true)}
                variant="outline"
                className="flex-1 h-12 text-lg bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <History className="w-5 h-5 mr-2" />
                Bildirim Geçmişi
              </Button>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-white/70" />
                  Kredi Geçmişi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationCredits?.history &&
                  notificationCredits.history.length > 0 ? (
                    notificationCredits.history.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-emerald-400 font-bold">
                              +{item.push_count}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              Kredi Yüklendi
                            </div>
                            <div className="text-white/40 text-sm">
                              Tarafından: {item.admin_first_name}{" "}
                              {item.admin_last_name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-sm">
                            {moment(item.created_at).fromNow()}
                          </div>
                          <div className="text-white/30 text-xs">
                            {moment(item.created_at).format("LLL")}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/30">
                      Henüz kredi geçmişi bulunmuyor.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent
            value="settings"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badge Settings */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Rozet Ayarları
                  </CardTitle>
                  <CardDescription className="text-white/50">
                    Yayıncının avatarında görünecek özel rozeti ayarla.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0">
                      {badgeUrl ? (
                        <img
                          src={badgeUrl}
                          alt="Badge"
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <Award className="w-8 h-8 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="badgeUrl" className="text-white">
                        Rozet Görsel URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="badgeUrl"
                          placeholder="https://..."
                          value={badgeUrl}
                          onChange={(e) => setBadgeUrl(e.target.value)}
                          className="bg-black/20 border-white/10 text-white"
                        />
                        <Button
                          onClick={handleBadgeUpdate}
                          disabled={badgeLoading}
                          className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
                        >
                          {badgeLoading ? "..." : "Kaydet"}
                        </Button>
                      </div>
                      <p className="text-xs text-white/30">
                        PNG formatında ve şeffaf arkaplanlı olması önerilir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status & Verification */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-white/70" />
                    Hesap Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Verification Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="space-y-1">
                      <div className="font-medium text-white">
                        Doğrulanmış Hesap
                      </div>
                      <div className="text-sm text-white/50">
                        Yayıncıya mavi tik rozeti ver.
                      </div>
                    </div>
                    <Switch
                      checked={streamer.is_verified}
                      onCheckedChange={handleVerificationToggle}
                      disabled={actionLoading === "verification"}
                    />
                  </div>

                  {/* Active/Inactive Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="space-y-1">
                      <div className="font-medium text-white">
                        Hesap Aktifliği
                      </div>
                      <div className="text-sm text-white/50">
                        Yayıncının sisteme erişimini yönet.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {streamer.is_active ? (
                        <Button
                          onClick={() => handleStatusToggle("inactive")}
                          variant="destructive"
                          size="sm"
                          disabled={actionLoading === "status"}
                        >
                          Pasife Al
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStatusToggle("active")}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          size="sm"
                          disabled={actionLoading === "status"}
                        >
                          Aktif Yap
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Stream Control */}
              <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Power className="w-5 h-5 text-red-400" />
                    Canlı Yayın Kontrolü
                  </CardTitle>
                  <CardDescription className="text-white/50">
                    Yayıncı yayını kapatmayı unuttuysa buradan müdahale edin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLiveActive ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="text-sm text-emerald-200">
                          Yayın Durumu
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Yayında
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-sm text-white/50">Platform</div>
                        <div className="text-white font-semibold capitalize">
                          {streamer.platform || "Bilinmiyor"}
                        </div>
                        {streamer.platform_url && (
                          <a
                            href={streamer.platform_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 underline mt-1 inline-block"
                          >
                            Yayına Git
                          </a>
                        )}
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-sm text-white/50">Başlangıç</div>
                        <div className="text-white font-semibold">
                          {liveStartFormatted || "-"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/60">
                      Şu anda aktif bir canlı yayın bulunmuyor.
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-white/60">
                      Admin onayıyla yayını sonlandırabilir ve yayıncıya
                      bilgilendirme push bildirimi gönderebilirsiniz.
                    </div>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={!isLiveActive || stopLiveLoading}
                      onClick={() => setStopLiveDialogOpen(true)}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Yayını Admin Yetkisiyle Kapat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              <Card className="md:col-span-2 bg-red-900/10 border-red-500/20 backdrop-blur-sm text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <Ban className="w-5 h-5" />
                    Kritik İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 text-sm text-white/60">
                    Bu yayıncıyı tamamen reddedebilir veya engelleyebilirsiniz.
                    Bu işlem geri alınamayabilir.
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRejection}
                      variant="destructive"
                      disabled={actionLoading === "rejection"}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Yayıncıyı Reddet / Yasakla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stream History Tab */}
          <TabsContent
            value="stream-history"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid gap-6">
              <Card className="bg-linear-to-br from-gray-900/50 to-gray-800/50 border border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <History className="w-5 h-5 mr-2 text-blue-400" />
                    Yayın Geçmişi
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Bu yayıncının tüm yayın geçmişini görüntüleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {streamHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">Henüz yayın geçmişi bulunmuyor</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {streamHistory.map((stream) => (
                        <div
                          key={stream.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Video className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">
                                {stream.stream_title || 'Başlıksız Yayın'}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {stream.platform.toUpperCase()} • {formatDateTime(stream.started_at)}
                              </p>
                              {stream.stopped_at && (
                                <p className="text-gray-500 text-xs">
                                  Süre: {calculateDuration(stream.started_at, stream.stopped_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={stream.stopped_at ? "secondary" : "default"}
                              className={`${
                                stream.stopped_at
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}
                            >
                              {stream.stopped_at ? "Tamamlandı" : "Devam Ediyor"}
                            </Badge>
                            {stream.platform_url && (
                              <a
                                href={stream.platform_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
                              >
                                Platform Linki
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Modal */}
      <StreamerApprovalModal
        open={approvalModal.open}
        onOpenChange={(open) => setApprovalModal((prev) => ({ ...prev, open }))}
        streamerId={streamerId}
        action={approvalModal.action}
        onSubmit={handleApprovalSubmit}
      />

      {/* Admin Stop Live Dialog */}
      <Dialog open={stopLiveDialogOpen} onOpenChange={setStopLiveDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Yayını Admin Yetkisiyle Kapat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Bu işlem yayını anında sonlandırır. İsterseniz yayıncıya sebebi
              açıklayan bir bildirim gönderebilirsiniz.
            </p>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
              <div>
                <div className="font-medium text-white">Bildirim Gönder</div>
                <p className="text-xs text-white/50">
                  Yayının neden kapandığını yayıncıya ilet.
                </p>
              </div>
              <Switch
                checked={sendStopNotification}
                onCheckedChange={setSendStopNotification}
              />
            </div>
            {sendStopNotification && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-white/80">Bildirim Başlığı</Label>
                  <Input
                    value={stopNotificationTitle}
                    onChange={(e) => setStopNotificationTitle(e.target.value)}
                    className="bg-black/30 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Bildirim Mesajı</Label>
                  <Textarea
                    value={stopNotificationMessage}
                    onChange={(e) => setStopNotificationMessage(e.target.value)}
                    className="bg-black/30 border-white/10 text-white min-h-[100px]"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStopLiveDialogOpen(false)}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                disabled={stopLiveLoading}
              >
                Vazgeç
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleAdminStopLive}
                disabled={stopLiveLoading}
                className="bg-red-600 hover:bg-red-700 min-w-[160px]"
              >
                {stopLiveLoading ? "İşleniyor..." : "Yayını Kapat"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Credits Modal */}
      <AssignNotificationCreditsModal
        open={creditsModalOpen}
        onOpenChange={setCreditsModalOpen}
        streamerId={streamerId}
        onSubmit={handleAssignCredits}
      />

      {/* Notification Logs Modal */}
      <Dialog
        open={notificationLogsOpen}
        onOpenChange={setNotificationLogsOpen}
      >
        <DialogContent className="sm:max-w-2xl bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bildirim Geçmişi</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-2">
            {notificationCredits?.notificationLogs &&
            notificationCredits.notificationLogs.length > 0 ? (
              <div className="space-y-3">
                {notificationCredits.notificationLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-white/5 p-4 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-white">
                          {log.headline}
                        </div>
                        <div className="text-sm text-white/60 whitespace-pre-wrap wrap-break-word mt-1">
                          {log.message}
                        </div>
                      </div>
                      <div className="text-xs text-white/40 shrink-0 text-right space-y-1">
                        <div>
                          {moment(log.sent_at)
                            .locale("tr")
                            .format("YYYY-MM-DD HH:mm")}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-white/5 border-white/10 text-white/50"
                        >
                          {log.audience}
                        </Badge>
                        <div className="pt-1">{log.recipients_count} alıcı</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/40 text-center py-8">
                Bildirim geçmişi bulunamadı.
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Utility functions
const formatDateTime = (dateString: string) => {
  return moment(dateString).locale("tr").format("DD MMM YYYY, HH:mm");
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);
  const duration = moment.duration(end.diff(start));

  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.minutes());
  const seconds = Math.floor(duration.seconds());

  if (hours > 0) {
    return `${hours}s ${minutes}d`;
  } else if (minutes > 0) {
    return `${minutes}d ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

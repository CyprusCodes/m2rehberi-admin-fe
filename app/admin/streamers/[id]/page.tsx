"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import Link from "next/link";
import {
  fetchStreamerById,
  toggleStreamerStatus,
  toggleStreamerVerification,
  approveStreamer,
  rejectStreamer,
} from "@/services/streamers";
import { StreamerApprovalModal } from "../Section/StreamerApprovalModal";
import useFetchData from "@/lib/use-fetch-data";
import moment from "moment";
import "moment/locale/tr";

export default function StreamerDetailPage() {
  const params = useParams();
  const streamerId = params.id as string;
  const [loading, errored, data, refetch] = useFetchData(
    () => fetchStreamerById(streamerId),
    [streamerId],
    { enabled: !!streamerId }
  ) as any;
  const streamer: any = data;
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean
    action: 'approve' | 'reject'
  }>({
    open: false,
    action: 'approve'
  });

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
      action: 'approve'
    });
  };

  const handleRejection = () => {
    setApprovalModal({
      open: true,
      action: 'reject'
    });
  };

  const handleApprovalSubmit = async (streamerId: string, action: 'approve' | 'reject', reason: string) => {
    setActionLoading(action === 'approve' ? "approval" : "rejection");
    
    try {
      if (action === 'approve') {
        await approveStreamer(streamerId, reason || undefined);
      } else {
        await rejectStreamer(streamerId, reason);
      }
      await refetch(); // Refresh the data
    } catch (e: any) {
      console.error("Approval action failed:", e);
      alert(e?.message || `Yayıncı ${action === 'approve' ? 'onaylanamadı' : 'reddedilemedi'}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  if (errored || !streamer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Yayıncı Bulunamadı</h2>
          <p className="text-muted-foreground mb-4">
            Aradığınız yayıncı mevcut değil veya bir hata oluştu.
          </p>
          <Link href="/admin/streamers">
            <Button>
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
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            Aktif
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Pasif</Badge>;
      case "banned":
        return <Badge variant="destructive">Yasaklı</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
            Beklemede
          </Badge>
        );
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const realName = [streamer.first_name, streamer.last_name]
    .filter(Boolean)
    .join(" ") || "-";

  const createdAtStr = streamer.created_at
    ? moment(streamer.created_at).locale("tr").format("lll")
    : "-";
  const updatedAtStr = streamer.updated_at
    ? moment(streamer.updated_at).locale("tr").format("lll")
    : "-";

  const socialLinks = [
    { label: "Ana Link", url: streamer.main_link_url, icon: ExternalLink },
    { label: "Kick", url: streamer.kick_url, icon: Video },
    { label: "YouTube", url: streamer.youtube_url, icon: Video },
    { label: "Twitch", url: streamer.twitch_url, icon: Video },
    { label: "Instagram", url: streamer.instagram_url, icon: ExternalLink },
    { label: "TikTok", url: streamer.tiktok_url, icon: Video },
    { label: "X (Twitter)", url: streamer.x_url, icon: ExternalLink },
    { label: "Website", url: streamer.website_url, icon: ExternalLink },
  ].filter(link => link.url);

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-120px)]">
      {/* Background Image with Blur Effect */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url(https://img.freepik.com/free-photo/liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper_1258-82940.jpg?semt=ais_hybrid&w=740&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(20px)',
          transform: 'scale(1.1)', // Prevent white edges from blur
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Main Content */}
      <div className="relative z-20 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-4">
            <Link href="/admin/streamers">
              <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 text-white drop-shadow-lg">
                {streamer.display_name || streamer.handle}
                {streamer.is_verified && (
                  <CheckCircle className="h-6 w-6 text-blue-400 drop-shadow-md" />
                )}
              </h1>
              <p className="text-white/80 drop-shadow-md">@{streamer.handle}</p>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/20 rounded-lg p-2 border border-white/30">
            {getStatusBadge(streamer.is_active ? "active" : "inactive")}
          </div>
        </div>

        {/* Profile Image */}
        {streamer.avatar_url && (
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/30 backdrop-blur-md bg-white/10 shadow-2xl">
            <img
              src={streamer.avatar_url}
              alt={`${streamer.display_name || streamer.handle} profil resmi`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-full h-full flex items-center justify-center text-white/70 bg-black/20 backdrop-blur-sm">Profil resmi yüklenemedi</div>';
                }
              }}
            />
          </div>
        )}

      {/* Streamer Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <User className="h-5 w-5" />
              Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/70">Yayıncı ID</div>
                <div className="font-medium text-white">#{streamer.id}</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Slug</div>
                <div className="font-medium text-white">@{streamer.handle}</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Görünen Ad</div>
                <div className="font-medium text-white">{streamer.display_name || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Durum</div>
                <div className="mt-1">{getStatusBadge(streamer.is_active ? "active" : "inactive")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Calendar className="h-5 w-5" />
              Tarihler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/70">Oluşturulma</div>
                <div className="text-sm flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4 text-white/70" />
                  {createdAtStr}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/70">
                  Son Güncelleme
                </div>
                <div className="text-sm flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-white/70" />
                  {updatedAtStr}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Controls */}
        <Card className="bg-black/30 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Settings className="h-5 w-5" />
              Yönetim Kontrolleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Admin Controls */}
            <div className="pt-4 border-t border-white/20">
              <div className="text-sm font-medium text-white/70 mb-3">
                Admin Kontrolleri
              </div>

              {/* Approval Controls */}
              {streamer.approval_status === "pending" && (
                <div className="space-y-2">
                  <Button
                    onClick={handleApproval}
                    disabled={actionLoading === "approval"}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    {actionLoading === "approval" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Yayıncıyı Onayla
                  </Button>
                  <Button
                    onClick={handleRejection}
                    disabled={actionLoading === "rejection"}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    {actionLoading === "rejection" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Ban className="h-4 w-4 mr-2" />
                    )}
                    Yayıncıyı Reddet
                  </Button>
                </div>
              )}

              {/* Status Controls for Approved Streamers */}
              {streamer.approval_status === "approved" && (
                <div className="space-y-2">
                  <div className="text-xs text-white/70 mb-2">
                    Yayıncı Durumu
                  </div>

                  {streamer.status === "active" ? (
                    <Button
                      onClick={() => handleStatusToggle("inactive")}
                      disabled={actionLoading === "status"}
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {actionLoading === "status" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Power className="h-4 w-4 mr-2" />
                      )}
                      Pasif Yap
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStatusToggle("active")}
                      disabled={actionLoading === "status"}
                      variant="outline"
                      size="sm"
                      className="w-full text-green-600 border-green-600 hover:bg-green-50"
                    >
                      {actionLoading === "status" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Aktif Yap
                    </Button>
                  )}

                  {/* Reject approved streamer */}
                  <div className="pt-2 border-t border-white/20">
                    <Button
                      onClick={handleRejection}
                      disabled={actionLoading === "rejection"}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      {actionLoading === "rejection" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Ban className="h-4 w-4 mr-2" />
                      )}
                      Yayıncıyı Reddet
                    </Button>
                  </div>
                </div>
              )}

              {/* Rejected streamer - can only approve */}
              {streamer.approval_status === "rejected" && (
                <div className="space-y-2">
                  <Button
                    onClick={handleApproval}
                    disabled={actionLoading === "approval"}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    {actionLoading === "approval" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Yayıncıyı Onayla
                  </Button>
                </div>
              )}

              {/* Verification Controls */}
              <div className="pt-3 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-white">Doğrulanmış</div>
                    <div className="text-xs text-white/70">
                      Yayıncının doğrulanma durumunu kontrol edin
                    </div>
                  </div>
                  <Switch
                    checked={streamer.is_verified}
                    onCheckedChange={handleVerificationToggle}
                    disabled={actionLoading === "verification"}
                  />
                </div>
              </div>

              {/* Status indicators */}
              <div className="pt-3 border-t border-white/20">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {streamer.is_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white/70" />
                    )}
                    <span className="text-white/70">
                      {streamer.is_verified ? "Doğrulanmış" : "Doğrulanmamış"} yayıncı
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {streamer.approval_status === 'approved' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : streamer.approval_status === 'rejected' ? (
                      <XCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-white/70">
                      {streamer.approval_status === 'approved' ? 'Onaylanmış' : 
                       streamer.approval_status === 'rejected' ? 'Reddedilmiş' : 'Onay Bekliyor'} başvuru
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Links */}
      {socialLinks.length > 0 && (
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Video className="h-5 w-5" />
              Sosyal Medya Bağlantıları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-white/20 rounded-lg backdrop-blur-sm bg-white/5">
                  <div className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 text-white/70" />
                    <span className="text-sm font-medium text-white">{link.label}</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 hover:underline text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Social Data (JSON) */}
      {streamer.socials_json && Object.keys(streamer.socials_json).length > 0 && (
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <ExternalLink className="h-5 w-5" />
              Ek Sosyal Medya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <pre className="text-sm font-mono text-white/90">
                {JSON.stringify(streamer.socials_json, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Approval Modal */}
      <StreamerApprovalModal
        open={approvalModal.open}
        onOpenChange={(open) => setApprovalModal(prev => ({ ...prev, open }))}
        streamerId={streamerId}
        action={approvalModal.action}
        onSubmit={handleApprovalSubmit}
      />
    </div>
  );
}

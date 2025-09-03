"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Clock,
  Server,
  Star,
  Reply,
  Send,
  X,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Users,
  Gamepad2,
  Settings,
  Check,
  Ban,
  Power,
  Play,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  fetchServerById,
  fetchServerFeedback,
  answerServerFeedback,
  approveServer,
  rejectServer,
  updateServerStatus,
} from "@/services/servers";
import useFetchData from "@/lib/use-fetch-data";
import moment from "moment";
import "moment/locale/tr";

export default function ServerDetailPage() {
  const params = useParams();
  const serverId = params.id as string;
  const [loading, errored, data] = useFetchData(
    () => fetchServerById(serverId),
    [serverId],
    { enabled: !!serverId }
  ) as any;
  const server: any = data;
  const [segment, setSegment] = useState<"overview" | "feedback">("overview");
  const [fbLoading, fbErrored, fbData, refetchFeedback] = useFetchData(
    () => fetchServerFeedback(serverId),
    [serverId, segment],
    { enabled: segment === "feedback" }
  ) as any;
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [replyValue, setReplyValue] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; action: 'approve' | 'reject'; reason: string }>({ open: false, action: 'approve', reason: '' });

  // Feedback mapping
  const feedbackItems = Array.isArray(fbData) ? fbData : [];
  const comments = feedbackItems.map((f: any) => ({
    id: f.feedbackId || f.feedback_id,
    user:
      `${f.firstName || f.first_name || ""} ${
        f.lastName || f.last_name || ""
      }`.trim() || `user#${f.userId || f.user_id}`,
    stars: Number(f.rating) || 0,
    comment: f.message,
    date: f.createdAt || f.created_at,
    replies:
      f.adminResponse || f.admin_response
        ? [
            {
              user: "Admin",
              comment: f.adminResponse || f.admin_response,
              date:
                f.respondedAt ||
                f.responded_at ||
                f.updatedAt ||
                f.updated_at ||
                f.createdAt ||
                f.created_at,
            },
          ]
        : [],
  }));

  const averageRating = comments.length
    ? comments.reduce((sum, c) => sum + (Number(c.stars) || 0), 0) /
      comments.length
    : 0;

  const toggleReply = (idx: number) => {
    setActiveReplyIndex((current) => (current === idx ? null : idx));
    setReplyValue("");
  };

  const submitReply = async (idx: number) => {
    const text = replyValue.trim();
    if (!text) return;
    const target = comments[idx];
    if (!target?.id) return;
    try {
      await answerServerFeedback(serverId, {
        feedbackId: target.id,
        response: text,
      });
      await refetchFeedback();
      setReplyValue("");
      setActiveReplyIndex(null);
    } catch (e) {
      // Optionally handle error UI
    }
  };

  // Server management functions
  const handleServerAction = async (action: string) => {
    setActionLoading(action);
    try {
      if (action === "approve") {
        await approveServer(serverId, { approvalNote: approvalDialog.reason || undefined });
      } else if (action === "reject") {
        await rejectServer(serverId, { rejectNote: approvalDialog.reason });
      } else if (action === "online") {
        await updateServerStatus(serverId, { status: "online" });
      } else if (action === "offline") {
        await updateServerStatus(serverId, { status: "offline" });
      } else if (action === "maintenance") {
        await updateServerStatus(serverId, { status: "maintenance" });
      }
      
      // Refresh the page data
      window.location.reload();
    } catch (e: any) {
      console.error("Server action failed:", e);
      alert(e?.message || "İşlem başarısız oldu");
    } finally {
      setActionLoading(null);
      setApprovalDialog({ open: false, action: 'approve', reason: '' });
    }
  };

  const openApprovalDialog = (action: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, action, reason: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  const Detail = ({
    label,
    value,
    mono,
  }: {
    label: string;
    value: any;
    mono?: boolean;
  }) => {
    const display =
      value === null || value === undefined || value === ""
        ? "-"
        : String(value);
    return (
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div
          className={
            "mt-1 p-2 rounded-md " + (mono ? "bg-muted font-mono text-sm" : "")
          }
        >
          {display}
        </div>
      </div>
    );
  };

  if (errored || !server) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sunucu Bulunamadı</h2>
          <p className="text-muted-foreground mb-4">
            Aradığınız sunucu mevcut değil veya bir hata oluştu.
          </p>
          <Link href="/dashboard/servers">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sunuculara Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            Çevrimiçi
          </Badge>
        );
      case "offline":
        return <Badge variant="destructive">Çevrimdışı</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
            Bakım
          </Badge>
        );
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            Onaylandı
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>;
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

  const ownerName = (() => {
    const first = server.owner_first_name ?? server.first_name;
    const last = server.owner_last_name ?? server.last_name;
    return [first, last].filter(Boolean).join(" ") || `user#${server.user_id}`;
  })();

  const createdAtStr = server.created_at
    ? moment(server.created_at).locale("tr").format("lll")
    : "-";
  const approvedAtStr = server.approved_at
    ? moment(server.approved_at).locale("tr").format("lll")
    : "-";

  const PillList = ({ items }: { items?: any }) => {
    const arr = Array.isArray(items)
      ? items
      : typeof items === "string" && items.trim().length
      ? items.split("\n")
      : [];
    if (!arr.length)
      return <span className="text-sm text-muted-foreground">Belirtilmemiş</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((it: any, idx: number) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {String(it)}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/servers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{server.server_name}</h1>
          <p className="text-muted-foreground">{server.description}</p>
        </div>
        {getStatusBadge(server.status)}
      </div>

      {/* Segment Buttons */}
      <div className="inline-flex items-center rounded-lg border bg-muted p-1">
        <button
          className={`px-3 py-1.5 text-sm rounded-md transition ${
            segment === "overview"
              ? "bg-background shadow"
              : "text-muted-foreground"
          }`}
          onClick={() => setSegment("overview")}
        >
          Genel Bakış
        </button>
        <button
          className={`ml-1 px-3 py-1.5 text-sm rounded-md transition ${
            segment === "feedback"
              ? "bg-background shadow"
              : "text-muted-foreground"
          }`}
          onClick={() => setSegment("feedback")}
        >
          FeedBack
        </button>
      </div>

      {segment === "overview" && (
        <>
          {/* Server Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Temel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Sunucu ID</div>
                    <div className="font-medium">#{server.server_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Oyun Türü</div>
                    <div className="font-medium capitalize">{server.game_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Durum</div>
                    <div className="mt-1">{getStatusBadge(server.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Maksimum Oyuncu</div>
                    <div className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {server.max_players}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner & Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sahip & Tarihler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Sunucu Sahibi</div>
                    <div className="font-medium">{ownerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Oluşturulma</div>
                    <div className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {createdAtStr}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Son Güncelleme</div>
                    <div className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {server.updated_at ? moment(server.updated_at).locale("tr").format("lll") : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Onay Durumu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Durum</div>
                    <div className="mt-1">{getApprovalBadge(server.approval_status)}</div>
                  </div>
                  {server.approved_at && (
                    <div>
                      <div className="text-sm text-muted-foreground">Onay Tarihi</div>
                      <div className="text-sm">{approvedAtStr}</div>
                    </div>
                  )}
                  {server.approval_note && (
                    <div>
                      <div className="text-sm text-muted-foreground">Onay Notu</div>
                      <div className="text-sm bg-muted p-2 rounded">{server.approval_note}</div>
                    </div>
                  )}
                  {server.reject_note && (
                    <div>
                      <div className="text-sm text-muted-foreground">Reddetme Notu</div>
                      <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">{server.reject_note}</div>
                    </div>
                  )}
                </div>

                {/* Admin Controls */}
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-3">Admin Kontrolleri</div>
                  
                  {/* Approval Controls */}
                  {server.approval_status === "pending" && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => openApprovalDialog('approve')}
                        disabled={actionLoading === 'approve'}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {actionLoading === 'approve' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Sunucuyu Onayla
                      </Button>
                      <Button
                        onClick={() => openApprovalDialog('reject')}
                        disabled={actionLoading === 'reject'}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        {actionLoading === 'reject' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Ban className="h-4 w-4 mr-2" />
                        )}
                        Sunucuyu Reddet
                      </Button>
                    </div>
                  )}

                  {/* Status Controls for Approved Servers */}
                  {server.approval_status === "approved" && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-2">Sunucu Durumu</div>
                      
                      {server.status === "online" ? (
                        <>
                          <Button
                            onClick={() => handleServerAction('offline')}
                            disabled={actionLoading === 'offline'}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {actionLoading === 'offline' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Power className="h-4 w-4 mr-2" />
                            )}
                            Offline Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction('maintenance')}
                            disabled={actionLoading === 'maintenance'}
                            variant="outline"
                            size="sm"
                            className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                          >
                            {actionLoading === 'maintenance' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                            ) : (
                              <AlertTriangle className="h-4 w-4 mr-2" />
                            )}
                            Bakım Modu
                          </Button>
                        </>
                      ) : server.status === "offline" ? (
                        <>
                          <Button
                            onClick={() => handleServerAction('online')}
                            disabled={actionLoading === 'online'}
                            variant="outline"
                            size="sm"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {actionLoading === 'online' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Online Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction('maintenance')}
                            disabled={actionLoading === 'maintenance'}
                            variant="outline"
                            size="sm"
                            className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                          >
                            {actionLoading === 'maintenance' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                            ) : (
                              <AlertTriangle className="h-4 w-4 mr-2" />
                            )}
                            Bakım Modu
                          </Button>
                        </>
                      ) : server.status === "maintenance" ? (
                        <>
                          <Button
                            onClick={() => handleServerAction('online')}
                            disabled={actionLoading === 'online'}
                            variant="outline"
                            size="sm"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {actionLoading === 'online' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Online Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction('offline')}
                            disabled={actionLoading === 'offline'}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {actionLoading === 'offline' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Power className="h-4 w-4 mr-2" />
                            )}
                            Offline Yap
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleServerAction('online')}
                          disabled={actionLoading === 'online'}
                          variant="outline"
                          size="sm"
                          className="w-full text-green-600 border-green-600 hover:bg-green-50"
                        >
                          {actionLoading === 'online' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Online Yap
                        </Button>
                      )}

                      {/* Reject approved server */}
                      <div className="pt-2 border-t">
                        <Button
                          onClick={() => openApprovalDialog('reject')}
                          disabled={actionLoading === 'reject'}
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          {actionLoading === 'reject' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Ban className="h-4 w-4 mr-2" />
                          )}
                          Sunucuyu Reddet
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Rejected server - can only approve */}
                  {server.approval_status === "rejected" && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => openApprovalDialog('approve')}
                        disabled={actionLoading === 'approve'}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {actionLoading === 'approve' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Sunucuyu Onayla
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Server Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sunucu Detayları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Zorluk Seviyesi</div>
                    <div className="font-medium">{server.server_difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Seviye Aralığı</div>
                    <div className="font-medium">{server.server_level_range}</div>
                  </div>
                  {server.tag_name && (
                    <div>
                      <div className="text-sm text-muted-foreground">Kategori</div>
                      <div className="mt-1">
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Tag className="h-3 w-3" />
                          {server.tag_name}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {server.discord_link && (
                    <div>
                      <div className="text-sm text-muted-foreground">Discord</div>
                      <a 
                        href={server.discord_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Discord Sunucusu
                      </a>
                    </div>
                  )}
                  {server.website_link && (
                    <div>
                      <div className="text-sm text-muted-foreground">Website</div>
                      <a 
                        href={server.website_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Web Sitesi
                      </a>
                    </div>
                  )}
                  {server.youtube_links && server.youtube_links.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground">YouTube</div>
                      <div className="space-y-1">
                        {server.youtube_links.map((link: string, idx: number) => (
                          <a 
                            key={idx}
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Video {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Features */}
          <div className="grid gap-6 md:grid-cols-3">
            {server.features && server.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5" />
                    Özellikler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PillList items={server.features} />
                </CardContent>
              </Card>
            )}

            {server.events && server.events.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Etkinlikler</CardTitle>
                </CardHeader>
                <CardContent>
                  <PillList items={server.events} />
                </CardContent>
              </Card>
            )}

            {server.systems && server.systems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sistemler</CardTitle>
                </CardHeader>
                <CardContent>
                  <PillList items={server.systems} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Server Rules */}
          {server.server_rules && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sunucu Kuralları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="whitespace-pre-wrap text-sm">{server.server_rules}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {segment === "feedback" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Geri Bildirim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Average Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(averageRating)
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }
                      size={18}
                      fill={
                        i < Math.round(averageRating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} / 5 ({comments.length}{" "}
                  değerlendirme)
                </div>
              </div>

              {/* Reviews List (stateful with admin actions) */}
              <div className="space-y-4">
                {fbLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Yükleniyor...
                  </div>
                ) : fbErrored ? (
                  <div className="text-sm text-red-500">
                    Geri bildirimler yüklenemedi.
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Henüz geri bildirim yok.
                  </div>
                ) : (
                  comments.map((r, idx) => (
                    <div key={idx} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.user}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {moment(r.date).locale("tr").format("ll")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={
                                  i < r.stars
                                    ? "text-yellow-500"
                                    : "text-muted-foreground"
                                }
                                size={16}
                                fill={i < r.stars ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleReply(idx)}
                            title="Yanıtla"
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          {/* Delete is not available in current API */}
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{r.comment}</p>

                      {/* Existing replies */}
                      {r.replies && r.replies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {r.replies.map((rep, ridx) => (
                            <div key={ridx} className="pl-3 border-l text-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{rep.user}</div>
                                <div className="text-xs text-muted-foreground">
                                  {moment(rep.date).locale("tr").format("lll")}
                                </div>
                              </div>
                              <div className="mt-1">{rep.comment}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply form */}
                      {activeReplyIndex === idx && (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
                            placeholder="Yanıt yazın..."
                            value={replyValue}
                            onChange={(e) => setReplyValue(e.target.value)}
                          />
                          <Button
                            variant="secondary"
                            onClick={() => submitReply(idx)}
                          >
                            <Send className="h-4 w-4 mr-1" /> Gönder
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setActiveReplyIndex(null);
                              setReplyValue("");
                            }}
                          >
                            <X className="h-4 w-4 mr-1" /> İptal
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Approval/Rejection Dialog */}
      {approvalDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {approvalDialog.action === 'approve' ? 'Sunucuyu Onayla' : 'Sunucuyu Reddet'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {approvalDialog.action === 'approve' ? 'Onay Notu (İsteğe bağlı)' : 'Red Sebebi (Gerekli)'}
                </label>
                <textarea
                  value={approvalDialog.reason}
                  onChange={(e) => setApprovalDialog({ ...approvalDialog, reason: e.target.value })}
                  placeholder={approvalDialog.action === 'approve' ? 'Onay notu ekleyebilirsiniz...' : 'Red sebebini belirtin...'}
                  className="w-full p-3 border rounded-md resize-none h-24"
                  required={approvalDialog.action === 'reject'}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setApprovalDialog({ open: false, action: 'approve', reason: '' })}
                  disabled={actionLoading === approvalDialog.action}
                >
                  İptal
                </Button>
                <Button
                  onClick={() => handleServerAction(approvalDialog.action)}
                  disabled={actionLoading === approvalDialog.action || (approvalDialog.action === 'reject' && !approvalDialog.reason.trim())}
                  className={approvalDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {actionLoading === approvalDialog.action ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    approvalDialog.action === 'approve' ? 'Onayla' : 'Reddet'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
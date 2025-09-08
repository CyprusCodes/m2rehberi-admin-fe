"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Trash,
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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  fetchServerById,
  fetchServerFeedback,
  answerServerFeedback,
  deleteServerFeedback,
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
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: "approve" | "reject";
    reason: string;
  }>({ open: false, action: "approve", reason: "" });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    feedbackId: number | null;
    loading: boolean;
  }>({ open: false, feedbackId: null, loading: false });
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  // Feedback mapping (supports { data: { feedback, stats } } and raw array)
  const feedbackContainer: any = fbData?.data ?? fbData ?? {};
  const feedbackItems = Array.isArray(feedbackContainer)
    ? feedbackContainer
    : Array.isArray(feedbackContainer.feedback)
    ? feedbackContainer.feedback
    : [];
  const feedbackStats = feedbackContainer.stats ?? null;

  // Group feedback by user ID (memoized)
  const groupedFeedbackArray = useMemo(() => {
    const groupedFeedback = feedbackItems.reduce((acc: any, f: any) => {
      const userId = f.userId || f.user_id;
      const userName = `${f.firstName || f.first_name || ""} ${
        f.lastName || f.last_name || ""
      }`.trim() || `user#${userId}`;
      
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName,
          feedbacks: []
        };
      }
      
      acc[userId].feedbacks.push({
        id: f.feedbackId || f.feedback_id,
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
      });
      
      return acc;
    }, {});

    return Object.values(groupedFeedback).map((group: any) => ({
      ...group,
      feedbacks: group.feedbacks.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    })).sort((a: any, b: any) => 
      new Date(b.feedbacks[0].date).getTime() - new Date(a.feedbacks[0].date).getTime()
    );
  }, [feedbackItems]);

  useEffect(() => {
    if (groupedFeedbackArray.length === 0) return;
    
    const singleFeedbackUsers = groupedFeedbackArray
      .filter((group: any) => group.feedbacks.length === 1)
      .map((group: any) => group.userId);
    
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      singleFeedbackUsers.forEach((userId: number) => {
        newSet.add(userId);
      });
      return newSet;
    });
  }, [groupedFeedbackArray]); 

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

  const averageRating =
    typeof feedbackStats?.averageRating === "number"
      ? Number(feedbackStats.averageRating)
      : comments.length
      ? comments.reduce(
          (sum: number, c: any) => sum + (Number(c.stars) || 0),
          0
        ) / comments.length
      : 0;

  const toggleReply = (idx: number) => {
    setActiveReplyIndex((current) => (current === idx ? null : idx));
    setReplyValue("");
  };

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const submitReply = async (feedbackId: number) => {
    const text = replyValue.trim();
    if (!text) return;
    try {
      await answerServerFeedback(serverId, {
        feedbackId: feedbackId,
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
        await approveServer(serverId, {
          approvalNote: approvalDialog.reason || undefined,
        });
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
      setApprovalDialog({ open: false, action: "approve", reason: "" });
    }
  };

  const openApprovalDialog = (action: "approve" | "reject") => {
    setApprovalDialog({ open: true, action, reason: "" });
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
      return (
        <span className="text-sm text-muted-foreground">Belirtilmemiş</span>
      );
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/servers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{server.server_name}</h1>
          </div>
        </div>
        {getStatusBadge(server.status)}
      </div>

      {/* Server Cover Image */}
      {server.server_cover_image_url && (
        <div className="relative w-96 h-48 rounded-lg overflow-hidden border border-border/30">
          <img
            src={server.server_cover_image_url}
            alt={`${server.server_name} kapak resmi`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30">Kapak resmi yüklenemedi</div>';
              }
            }}
          />
        </div>
      )}

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
                    <div className="text-sm text-muted-foreground">
                      Sunucu ID
                    </div>
                    <div className="font-medium">#{server.server_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Oyun Türü
                    </div>
                    <div className="font-medium capitalize">
                      {server.game_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Durum</div>
                    <div className="mt-1">{getStatusBadge(server.status)}</div>
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
                    <div className="text-sm text-muted-foreground">
                      Sunucu Sahibi
                    </div>
                    <div className="font-medium">{ownerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Oluşturulma
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {createdAtStr}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Son Güncelleme
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {server.updated_at
                        ? moment(server.updated_at).locale("tr").format("lll")
                        : "-"}
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
                    <div className="mt-1">
                      {getApprovalBadge(server.approval_status)}
                    </div>
                  </div>
                  {server.approved_at && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Onay Tarihi
                      </div>
                      <div className="text-sm">{approvedAtStr}</div>
                    </div>
                  )}
                  {server.approval_note && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Onay Notu
                      </div>
                      <div className="text-sm bg-muted p-2 rounded">
                        {server.approval_note}
                      </div>
                    </div>
                  )}
                  {server.reject_note && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Reddetme Notu
                      </div>
                      <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
                        {server.reject_note}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Controls */}
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    Admin Kontrolleri
                  </div>

                  {/* Approval Controls */}
                  {server.approval_status === "pending" && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => openApprovalDialog("approve")}
                        disabled={actionLoading === "approve"}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {actionLoading === "approve" ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Sunucuyu Onayla
                      </Button>
                      <Button
                        onClick={() => openApprovalDialog("reject")}
                        disabled={actionLoading === "reject"}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        {actionLoading === "reject" ? (
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
                      <div className="text-xs text-muted-foreground mb-2">
                        Sunucu Durumu
                      </div>

                      {server.status === "online" ? (
                        <>
                          <Button
                            onClick={() => handleServerAction("offline")}
                            disabled={actionLoading === "offline"}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {actionLoading === "offline" ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Power className="h-4 w-4 mr-2" />
                            )}
                            Offline Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction("maintenance")}
                            disabled={actionLoading === "maintenance"}
                            variant="outline"
                            size="sm"
                            className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                          >
                            {actionLoading === "maintenance" ? (
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
                            onClick={() => handleServerAction("online")}
                            disabled={actionLoading === "online"}
                            variant="outline"
                            size="sm"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {actionLoading === "online" ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Online Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction("maintenance")}
                            disabled={actionLoading === "maintenance"}
                            variant="outline"
                            size="sm"
                            className="w-full text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                          >
                            {actionLoading === "maintenance" ? (
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
                            onClick={() => handleServerAction("online")}
                            disabled={actionLoading === "online"}
                            variant="outline"
                            size="sm"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {actionLoading === "online" ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Online Yap
                          </Button>
                          <Button
                            onClick={() => handleServerAction("offline")}
                            disabled={actionLoading === "offline"}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {actionLoading === "offline" ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Power className="h-4 w-4 mr-2" />
                            )}
                            Offline Yap
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleServerAction("online")}
                          disabled={actionLoading === "online"}
                          variant="outline"
                          size="sm"
                          className="w-full text-green-600 border-green-600 hover:bg-green-50"
                        >
                          {actionLoading === "online" ? (
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
                          onClick={() => openApprovalDialog("reject")}
                          disabled={actionLoading === "reject"}
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          {actionLoading === "reject" ? (
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
                        onClick={() => openApprovalDialog("approve")}
                        disabled={actionLoading === "approve"}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {actionLoading === "approve" ? (
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
                    <div className="text-sm text-muted-foreground">
                      Zorluk Seviyesi
                    </div>
                    <div className="font-medium">
                      {server.server_difficulty}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Seviye Aralığı
                    </div>
                    <div className="font-medium">
                      {server.server_level_range}
                    </div>
                  </div>
                  {server.tag_name && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Kategori
                      </div>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
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
                      <div className="text-sm text-muted-foreground">
                        Discord
                      </div>
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
                      <div className="text-sm text-muted-foreground">
                        Website
                      </div>
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
                      <div className="text-sm text-muted-foreground">
                        YouTube
                      </div>
                      <div className="space-y-1">
                        {server.youtube_links.map(
                          (link: string, idx: number) => (
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
                          )
                        )}
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

          {/* Server Description */}
          {server.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Sunucu Açıklaması
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: server.description }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

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
                  <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: server.server_rules }}
                  />
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

              {/* Reviews List (grouped by user with accordion) */}
              <div className="space-y-4">
                {fbLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Yükleniyor...
                  </div>
                ) : fbErrored ? (
                  <div className="text-sm text-red-500">
                    Geri bildirimler yüklenemedi.
                  </div>
                ) : groupedFeedbackArray.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Henüz geri bildirim yok.
                  </div>
                ) : (
                  groupedFeedbackArray.map((userGroup: any) => {
                    const isExpanded = expandedUsers.has(userGroup.userId);
                    const latestFeedback = userGroup.feedbacks[0];
                    const totalFeedbacks = userGroup.feedbacks.length;
                    
                    return (
                      <div key={userGroup.userId} className="border rounded-lg">
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleUserExpansion(userGroup.userId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{userGroup.userName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {totalFeedbacks} yorum • Son yorum: {moment(latestFeedback.date).locale("tr").format("ll")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={
                                      i < latestFeedback.stars
                                        ? "text-yellow-500"
                                        : "text-muted-foreground"
                                    }
                                    size={16}
                                    fill={i < latestFeedback.stars ? "currentColor" : "none"}
                                  />
                                ))}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {totalFeedbacks} yorum
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t bg-muted/20">
                            {userGroup.feedbacks.map((feedback: any, feedbackIdx: number) => (
                              <div key={feedback.id} className="p-4 border-b last:border-b-0">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={
                                            i < feedback.stars
                                              ? "text-yellow-500"
                                              : "text-muted-foreground"
                                          }
                                          size={14}
                                          fill={i < feedback.stars ? "currentColor" : "none"}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {moment(feedback.date).locale("tr").format("lll")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => toggleReply(feedback.id)}
                                      title="Yanıtla"
                                    >
                                      <Reply className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        setDeleteDialog({
                                          open: true,
                                          feedbackId: feedback.id,
                                          loading: false,
                                        })
                                      }
                                      title="Sil"
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <p className="text-sm mb-3">{feedback.comment}</p>

                                {/* Existing replies */}
                                {feedback.replies && feedback.replies.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {feedback.replies.map((rep: any, ridx: number) => (
                                      <div key={ridx} className="pl-3 border-l-2 border-blue-200 dark:border-blue-800 text-sm">
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium text-blue-600 dark:text-blue-400">{rep.user}</div>
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
                                {activeReplyIndex === feedback.id && (
                                  <div className="mt-3 flex items-center gap-2">
                                    <input
                                      className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
                                      placeholder="Yanıt yazın..."
                                      value={replyValue}
                                      onChange={(e) => setReplyValue(e.target.value)}
                                    />
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => submitReply(feedback.id)}
                                    >
                                      <Send className="h-4 w-4 mr-1" /> Gönder
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
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
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
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
              {approvalDialog.action === "approve"
                ? "Sunucuyu Onayla"
                : "Sunucuyu Reddet"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {approvalDialog.action === "approve"
                    ? "Onay Notu (İsteğe bağlı)"
                    : "Red Sebebi (Gerekli)"}
                </label>
                <textarea
                  value={approvalDialog.reason}
                  onChange={(e) =>
                    setApprovalDialog({
                      ...approvalDialog,
                      reason: e.target.value,
                    })
                  }
                  placeholder={
                    approvalDialog.action === "approve"
                      ? "Onay notu ekleyebilirsiniz..."
                      : "Red sebebini belirtin..."
                  }
                  className="w-full p-3 border rounded-md resize-none h-24"
                  required={approvalDialog.action === "reject"}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setApprovalDialog({
                      open: false,
                      action: "approve",
                      reason: "",
                    })
                  }
                  disabled={actionLoading === approvalDialog.action}
                >
                  İptal
                </Button>
                <Button
                  onClick={() => handleServerAction(approvalDialog.action)}
                  disabled={
                    actionLoading === approvalDialog.action ||
                    (approvalDialog.action === "reject" &&
                      !approvalDialog.reason.trim())
                  }
                  className={
                    approvalDialog.action === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {actionLoading === approvalDialog.action ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : approvalDialog.action === "approve" ? (
                    "Onayla"
                  ) : (
                    "Reddet"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Feedback Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Yorumu sil</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Bu işlemi geri alamazsınız. Emin misiniz?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteDialog({
                    open: false,
                    feedbackId: null,
                    loading: false,
                  })
                }
                disabled={deleteDialog.loading}
              >
                İptal
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteDialog.loading}
                onClick={async () => {
                  if (!deleteDialog.feedbackId) return;
                  setDeleteDialog((prev) => ({ ...prev, loading: true }));
                  try {
                    await deleteServerFeedback(
                      serverId,
                      deleteDialog.feedbackId
                    );
                    await refetchFeedback();
                  } catch (e) {
                    alert("Yorum silinemedi");
                  } finally {
                    setDeleteDialog({
                      open: false,
                      feedbackId: null,
                      loading: false,
                    });
                  }
                }}
              >
                {deleteDialog.loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Sil"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

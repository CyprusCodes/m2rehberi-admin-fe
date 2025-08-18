"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Globe,
  Shield,
  Clock,
  Server,
  Key,
  Star,
  Reply,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  fetchServerById,
  fetchServerFeedback,
  answerServerFeedback,
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
          <Badge className="bg-green-500 hover:bg-green-600">Çevrimiçi</Badge>
        );
      case "offline":
        return <Badge variant="destructive">Çevrimdışı</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Bakım</Badge>
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
      return <span className="text-sm text-muted-foreground">-</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((it: any, idx: number) => (
          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-muted">
            {String(it)}
          </span>
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
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Özet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm text-muted-foreground">Sahip</div>
                  <div className="text-base font-medium">{ownerName}</div>
                  <div className="text-xs text-muted-foreground">
                    Eklenme: {createdAtStr}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Onay Durumu
                  </div>
                  <div className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />{" "}
                    {server.approval_status}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Onay Tarihi: {approvedAtStr}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Konum</div>
                  <div className="text-base font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />{" "}
                    {server.location || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Versiyon</div>
                  <div className="text-base font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />{" "}
                    {server.version || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detaylar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Detail label="Sunucu ID" value={server.server_id} />
                <Detail label="Oyun Tipi" value={server.game_type} />
                <Detail label="Sunucu Tipi" value={server.server_type} />
                <Detail label="Zorluk" value={server.server_difficulty} />
                <Detail
                  label="Seviye Aralığı"
                  value={server.server_level_range}
                />
                <Detail label="Maks. Oyuncu" value={server.max_players} />
                <Detail label="Durum" value={server.status} />
              </div>
            </CardContent>
          </Card>

          {/* Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" /> Bağlantı Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Detail
                  label="IP Adresi"
                  value={server.server_ip_address}
                  mono
                />
                <Detail label="Port" value={server.server_port} mono />
                <Detail
                  label="Şifre"
                  value={server.server_password || "-"}
                  mono
                />
              </div>
            </CardContent>
          </Card>

          {/* Features / Events / Systems */}
          <Card>
            <CardHeader>
              <CardTitle>Özellikler</CardTitle>
            </CardHeader>
            <CardContent>
              <PillList items={server.features} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <PillList items={server.events} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistemler</CardTitle>
            </CardHeader>
            <CardContent>
              <PillList items={server.systems} />
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Sunucu Kuralları
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(server.server_rules
                ? String(server.server_rules).split("\n")
                : []
              ).length ? (
                <div className="space-y-2">
                  {String(server.server_rules)
                    .split("\n")
                    .map((rule: string, idx: number) => (
                      <div key={idx} className="text-sm">
                        • {rule}
                      </div>
                    ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </CardContent>
          </Card>

          {/* Approval Info */}
          <Card>
            <CardHeader>
              <CardTitle>Onay Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Detail label="Onay Durumu" value={server.approval_status} />
                <Detail label="Onaylayan" value={server.approved_by ?? "-"} />
                <Detail label="Onay Tarihi" value={approvedAtStr} />
                <Detail label="Onay Notu" value={server.approval_note ?? "-"} />
                <Detail
                  label="Reddetme Notu"
                  value={server.reject_note ?? "-"}
                />
                <Detail
                  label="Güncellenme"
                  value={
                    server.updated_at
                      ? moment(server.updated_at).locale("tr").format("lll")
                      : "-"
                  }
                />
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Reply, Send, X } from "lucide-react";
import { answerServerFeedback, fetchServerFeedback } from "@/services/servers";
import useFetchData from "@/lib/use-fetch-data";
import moment from "moment";
import "moment/locale/tr";

interface FeedbackSectionProps {
  serverId: string;
}

export default function FeedbackSection({ serverId }: FeedbackSectionProps) {
  const [fbLoading, fbErrored, fbData, refetchFeedback] = useFetchData(
    () => fetchServerFeedback(serverId),
    [serverId],
    { enabled: true }
  ) as any;
  
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);
  const [replyValue, setReplyValue] = useState<string>("");

  // Feedback mapping
  const feedbackItems = fbData?.feedback || [];
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
    ? comments.reduce((sum: number, c: any) => sum + (Number(c.stars) || 0), 0) /
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

  return (
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
            comments.map((r: any, idx: number) => (
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
                  </div>
                </div>
                <p className="mt-3 text-sm">{r.comment}</p>

                {/* Existing replies */}
                {r.replies && r.replies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {r.replies.map((rep: any, ridx: number) => (
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
  );
}

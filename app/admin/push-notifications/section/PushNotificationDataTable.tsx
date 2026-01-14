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
import {
  Pencil,
  Trash2,
  RefreshCw,
  Send,
  Calendar,
  Link as LinkIcon,
  Bell,
  InboxIcon,
} from "lucide-react";
import {
  getPushNotifications,
  PushNotification,
} from "@/services/pushNotifications";
import { EditPushNotificationDialog } from "./EditPushNotificationDialog";
import { DeletePushNotificationDialog } from "./DeletePushNotificationDialog";
import moment from "moment";
import "moment/locale/tr";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

moment.locale("tr");

export function PushNotificationDataTable() {
  const router = useRouter();
  const [rows, setRows] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  const load = useCallback(
    async (direction: "first" | "next" | "prev" = "first") => {
      try {
        setLoading(true);
        setError(null);

        let queryParams = "";
        if (direction === "next" && nextCursor) {
          queryParams = `page=first&page_size=15&sort_by=-push_notifications.created_at&direction=next&cursor=${encodeURIComponent(
            nextCursor
          )}`;
        } else if (direction === "prev" && prevCursor) {
          queryParams = `page=first&page_size=15&sort_by=-push_notifications.created_at&direction=prev&cursor=${encodeURIComponent(
            prevCursor
          )}`;
        } else {
          queryParams = `page=first&page_size=15&sort_by=-push_notifications.created_at`;
        }

        const res = await getPushNotifications(queryParams);
        const list: PushNotification[] = Array.isArray(res?.data)
          ? res.data
          : [];
        setRows(list);
        setPagination(res?.metadata || null);

        // Cursor'ları güncelle
        if (res?.metadata?.endCursor) {
          setNextCursor(res.metadata.endCursor);
        }
        if (res?.metadata?.startCursor) {
          setPrevCursor(res.metadata.startCursor);
        }
      } catch (e: any) {
        setError(e?.message || "Bildirimler yüklenemedi");
      } finally {
        setLoading(false);
      }
    },
    [nextCursor, prevCursor]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setNextCursor(null);
    setPrevCursor(null);
    load("first");
  };

  const getStatusBadge = (sentAt: string | null) => {
    if (sentAt) {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20 px-3 py-1"
        >
          <Send className="w-3 h-3 mr-1.5" />
          Gönderildi
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20 px-3 py-1"
      >
        <Calendar className="w-3 h-3 mr-1.5" />
        Zamanlanmış
      </Badge>
    );
  };

  const formatLinkTo = (linkTo: string | null, linkToId: string | null) => {
    if (!linkTo) return <span className="text-muted-foreground">-</span>;
    const linkToLabels: Record<string, string> = {
      server: "Sunucu",
      streamer_post: "Yayıncı Gönderisi",
      streamer: "Yayıncı",
      lottery: "Çekiliş",
    };
    const label = linkToLabels[linkTo] || linkTo;

    return (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-purple-500/10">
          <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <span className="text-sm font-medium text-foreground/80">
          {label}{" "}
          {linkToId && (
            <span className="opacity-50 text-xs ml-1">#{linkToId}</span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-0">
      <div className="p-6 border-b border-border/50 bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Info className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-medium">
              Bilgilendirme:
            </strong>{" "}
            Bildirimleriniz zamanlanmış olarak kaydedildiğinde belirtilen
            tarihte otomatik gönderilir. Gönderilmiş bildirimleri
            düzenleyemezsiniz ancak silebilirsiniz.
          </div>
        </div>
      </div>

      <div className="relative">
        {error && (
          <div className="p-8 text-center bg-red-500/5 text-red-500 border-b">
            {error}
          </div>
        )}

        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-4 pl-6 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 w-[20%]">
                Başlık
              </TableHead>
              <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 w-[25%]">
                Mesaj
              </TableHead>
              <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 w-[20%]">
                Hedef
              </TableHead>
              <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 w-[15%]">
                Tarih / Saat
              </TableHead>
              <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 w-[10%]">
                Durum
              </TableHead>
              <TableHead className="py-4 pr-6 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70 text-right w-[10%]">
                İşlemler
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[400px]">
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <InboxIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        Henüz bildirim yok
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Yeni bir kampanya veya duyuru oluşturmak için yukarıdaki
                        "Yeni Kampanya Oluştur" butonunu kullanın.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((notification) => (
                <TableRow
                  key={notification.id}
                  className="group hover:bg-muted/30 transition-colors border-border/50"
                >
                  <TableCell className="pl-6 font-medium text-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-purple-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {notification.headline}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="line-clamp-2 text-muted-foreground text-sm leading-relaxed max-w-[300px]"
                      title={notification.message}
                    >
                      {notification.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatLinkTo(notification.linkTo, notification.linkToId)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">
                        {notification.scheduledDate
                          ? moment(notification.scheduledDate).format(
                              "DD MMM YYYY"
                            )
                          : "-"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {notification.scheduledTime || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.sentAt)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.sentAt && (
                        <EditPushNotificationDialog
                          notification={notification}
                          onSuccess={handleRefresh}
                        />
                      )}
                      <DeletePushNotificationDialog
                        notification={notification}
                        onSuccess={handleRefresh}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {pagination && (
          <div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Toplam{" "}
              <strong className="text-foreground">
                {pagination.total || 0}
              </strong>{" "}
              bildirim gösteriliyor
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => load("prev")}
                disabled={!prevCursor || loading}
                className="h-8 px-3 border-border/50 bg-background/50 hover:bg-background"
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => load("next")}
                disabled={!nextCursor || loading}
                className="h-8 px-3 border-border/50 bg-background/50 hover:bg-background"
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-10">
            <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

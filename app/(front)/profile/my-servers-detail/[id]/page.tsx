"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchFrontendUserServerById,
  updateFrontendUserServerStatus,
  updateFrontendUserServerDetails,
} from "@/services/servers";
import toast from "react-hot-toast";
import {
  Server,
  Settings,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Import components
import ServerHeader from "./Sections/ServerHeader";
import GeneralInfo from "./Sections/GeneralInfo";
import Connections from "./Sections/Connections";
import YouTubeVideos from "./Sections/YouTubeVideos";
import SystemsFeaturesEvents from "./Sections/SystemsFeaturesEvents";
import Description from "./Sections/Description";
import ServerRules from "./Sections/ServerRules";
import DateInfo from "./Sections/DateInfo";
import StatusManagement from "./Sections/StatusManagement";

export default function MyServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = Number(params?.id);

  const [server, setServer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "settings">("info");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<
    "online" | "offline" | "maintenance" | null
  >(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editDateTime, setEditDateTime] = useState<string>("");
  const [editArray, setEditArray] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!serverId) return;
    try {
      setLoading(true);
      const res = await fetchFrontendUserServerById(serverId);
      setServer(res.data);
    } catch (e) {
      toast.error("Sunucu detayları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const statusText = (srv: any) => {
    if (srv?.approval_status === "pending") return "Onay Bekliyor";
    if (srv?.approval_status === "rejected") return "Reddedildi";
    switch (srv?.status) {
      case "online":
        return "Aktif";
      case "maintenance":
        return "Bakımda";
      case "offline":
        return "Çevrimdışı";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusIcon = (srv: any) => {
    if (srv?.approval_status === "pending")
      return <Clock className="w-4 h-4" />;
    if (srv?.approval_status === "rejected")
      return <XCircle className="w-4 h-4" />;
    switch (srv?.status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />;
      case "offline":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (srv: any) => {
    if (srv?.approval_status === "pending") return "secondary";
    if (srv?.approval_status === "rejected") return "destructive";
    switch (srv?.status) {
      case "online":
        return "default";
      case "maintenance":
        return "secondary";
      case "offline":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusBgColor = (srv: any) => {
    if (srv?.approval_status === "pending") return "border border-amber-400/40 bg-amber-500/10";
    if (srv?.approval_status === "rejected") return "border border-rose-400/40 bg-rose-500/10";
    switch (srv?.status) {
      case "online":
        return "border border-emerald-400/40 bg-emerald-500/10";
      case "maintenance":
        return "border border-indigo-400/40 bg-indigo-500/10";
      case "offline":
        return "border border-rose-400/40 bg-rose-500/10";
      default:
        return "border border-slate-500/40 bg-slate-500/10";
    }
  };

  const getStatusTextColor = (srv: any) => {
    if (srv?.approval_status === "pending") return "text-amber-100";
    if (srv?.approval_status === "rejected") return "text-rose-100";
    switch (srv?.status) {
      case "online":
        return "text-emerald-100";
      case "maintenance":
        return "text-indigo-100";
      case "offline":
        return "text-rose-100";
      default:
        return "text-slate-200";
    }
  };

  const toArray = (items: any): string[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === "object") {
      return Object.entries(items)
        .filter(([_, v]) => v === true)
        .map(([k]) => String(k));
    }
    return [];
  };

  const isScheduledForFuture = (srv: any): boolean => {
    if (!srv || srv.show_time_status !== 1 || !srv.show_date_time) return false;

    const showDateTime = new Date(srv.show_date_time);
    const now = new Date();

    return showDateTime > now;
  };

  const getFutureDisplayDate = (srv: any): string => {
    if (!srv || srv.show_time_status !== 1 || !srv.show_date_time) return "";

    const showDateTime = new Date(srv.show_date_time);
    return showDateTime.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowConfirmation = (srv: any): boolean => {
    return srv && srv.show_time_status === 1 && isScheduledForFuture(srv);
  };

  const updateStatus = async (
    newStatus: "online" | "offline" | "maintenance"
  ) => {
    if (!server) return;

    if (shouldShowConfirmation(server)) {
      setPendingStatusChange(newStatus);
      setShowConfirmModal(true);
      return;
    }

    await performStatusUpdate(newStatus);
  };

  const performStatusUpdate = async (
    newStatus: "online" | "offline" | "maintenance"
  ) => {
    if (!server) return;
    try {
      setUpdating(true);

      if (shouldShowConfirmation(server) && newStatus === "online") {
        await updateFrontendUserServerDetails(serverId, {
          serverName: server.server_name,
          description: server.description,
          serverDifficulty: server.server_difficulty,
          serverLevelRange: server.server_level_range,
          serverType: server.server_type,
          tagId: server.tag_id,
          discordLink: server.discord_link,
          websiteLink: server.website_link,
          youtubeLinks: server.youtube_links,
          serverRules: server.server_rules,
          serverCoverImageUrl: server.server_cover_image_url,
          systems: server.systems,
          features: server.features,
          events: server.events,
          showTimeStatus: false,
          showDateTime: null,
        });

        await updateFrontendUserServerStatus(serverId, { status: newStatus });
        toast.success(
          "Sunucu durumu güncellendi ve gelecek tarih ayarları sıfırlandı"
        );
      } else {
        await updateFrontendUserServerStatus(serverId, { status: newStatus });
        toast.success("Sunucu durumu güncellendi");
      }

      await load();
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("servers:refresh"));
    } catch (e) {
      toast.error("Durum güncellenemedi");
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (pendingStatusChange) {
      await performStatusUpdate(pendingStatusChange);
      setShowConfirmModal(false);
      setPendingStatusChange(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  const startEditing = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue || "");
    
    if (field === "showTimeStatus") {
      const currentDateTime = server?.show_date_time 
        ? new Date(server.show_date_time).toISOString().slice(0, 16)
        : "";
      setEditDateTime(currentDateTime);
    }
  };

  const startArrayEditing = (field: string, currentValue: any) => {
    setEditingField(field);
    const currentArray = toArray(currentValue);
    setEditArray(currentArray);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
    setEditDateTime("");
    setEditArray([]);
  };

  const toggleArrayItem = (item: string) => {
    setEditArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const saveEdit = async () => {
    if (!server || !editingField) return;

    try {
      setSaving(true);

      const updatePayload: any = {
        serverName: server.server_name,
        description: server.description,
        serverDifficulty: server.server_difficulty,
        serverLevelRange: server.server_level_range,
        serverType: server.server_type,
        tagId: server.tag_id,
        discordLink: server.discord_link,
        websiteLink: server.website_link,
        youtubeLinks: server.youtube_links,
        serverRules: server.server_rules,
        serverCoverImageUrl: server.server_cover_image_url,
        systems: server.systems,
        features: server.features,
        events: server.events,
        showTimeStatus: server.show_time_status === 1,
        showDateTime: server.show_date_time,
      };

      if (
        editingField === "systems" ||
        editingField === "features" ||
        editingField === "events"
      ) {
        updatePayload[editingField] = editArray;
      } else if (editingField === "tagId") {
        updatePayload.tagId = editValue ? Number(editValue) : null;
      } else {
        updatePayload[editingField] = editValue;
      }

      if (editingField === "showTimeStatus" && editValue === "true") {
        updatePayload.showTimeStatus = true;
        updatePayload.showDateTime = editDateTime ? new Date(editDateTime).toISOString().slice(0, 19).replace('T', ' ') : null;
        await updateFrontendUserServerStatus(serverId, { status: "offline" });
        toast.success("Sunucu bilgileri güncellendi ve gelecek tarih ayarı nedeniyle durum offline yapıldı");
      } else if (editingField === "showTimeStatus" && editValue === "false") {
        updatePayload.showTimeStatus = false;
        updatePayload.showDateTime = null;
        toast.success("Sunucu bilgileri güncellendi ve gelecek tarih ayarı kaldırıldı");
      } else {
        toast.success("Sunucu bilgileri güncellendi");
      }

      await updateFrontendUserServerDetails(serverId, updatePayload);
      await load();
      setEditingField(null);
      setEditValue("");
      setEditDateTime("");
      setEditArray([]);
    } catch (e) {
      toast.error("Güncelleme sırasında bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Sunucu bilgileri yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <Server className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Sunucu Bulunamadı</h3>
              <p className="text-muted-foreground">
                Aradığınız sunucu mevcut değil.
              </p>
            </div>
            <Button
              onClick={() => router.push("/profile?tab=servers")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sunucularıma Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ServerHeader
        server={server}
        onBack={() => router.push("/profile?tab=servers")}
        getStatusIcon={getStatusIcon}
        getStatusBgColor={getStatusBgColor}
        getStatusTextColor={getStatusTextColor}
        statusText={statusText}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "info"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Server className="w-4 h-4" />
            Sunucu Bilgileri
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "settings"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            Ayarlar
          </button>
        </div>

        {activeTab === "info" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GeneralInfo
                server={server}
                editingField={editingField}
                editValue={editValue}
                saving={saving}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEditing={cancelEditing}
                onEditValueChange={setEditValue}
              />

              <Connections
                server={server}
                editingField={editingField}
                editValue={editValue}
                saving={saving}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEditing={cancelEditing}
                onEditValueChange={setEditValue}
              />
            </div>

            <YouTubeVideos 
              server={server}
              editingField={editingField}
              editArray={editArray}
              saving={saving}
              onStartArrayEditing={startArrayEditing}
              onSaveEdit={saveEdit}
              onCancelEditing={cancelEditing}
              onToggleArrayItem={toggleArrayItem}
            />

            <SystemsFeaturesEvents
              server={server}
              editingField={editingField}
              editArray={editArray}
              saving={saving}
              onStartArrayEditing={startArrayEditing}
              onSaveEdit={saveEdit}
              onCancelEditing={cancelEditing}
              onToggleArrayItem={toggleArrayItem}
              toArray={toArray}
            />

            <Description
              server={server}
              editingField={editingField}
              editValue={editValue}
              saving={saving}
              onStartEditing={startEditing}
              onSaveEdit={saveEdit}
              onCancelEditing={cancelEditing}
              onEditValueChange={setEditValue}
            />

            <ServerRules
              server={server}
              editingField={editingField}
              editValue={editValue}
              saving={saving}
              onStartEditing={startEditing}
              onSaveEdit={saveEdit}
              onCancelEditing={cancelEditing}
              onEditValueChange={setEditValue}
            />

            <DateInfo
              server={server}
              editingField={editingField}
              editValue={editValue}
              editDateTime={editDateTime}
              saving={saving}
              onStartEditing={startEditing}
              onSaveEdit={saveEdit}
              onCancelEditing={cancelEditing}
              onEditValueChange={setEditValue}
              onEditDateTimeChange={setEditDateTime}
              isScheduledForFuture={isScheduledForFuture}
              getFutureDisplayDate={getFutureDisplayDate}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <StatusManagement
              server={server}
              updating={updating}
              onUpdateStatus={updateStatus}
              getStatusIcon={getStatusIcon}
              getStatusBgColor={getStatusBgColor}
              getStatusTextColor={getStatusTextColor}
              statusText={statusText}
            />
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Durum Değişikliği Onayı
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Bu sunucu gelecek bir tarihte gösterilecek şekilde
                  planlanmıştır.
                </p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Planlanan Gösterim Tarihi:
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {getFutureDisplayDate(server)}
                  </p>
                </div>
                <p>
                  Durumu şimdi değiştirmek istediğinizden emin misiniz?
                  {pendingStatusChange === "online" && (
                    <span className="block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      Sunucuyu "Aktif" yaparsanız, gelecek tarih ayarları
                      sıfırlanacak ve sunucu hemen gösterilecektir.
                    </span>
                  )}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Evet, Değiştir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

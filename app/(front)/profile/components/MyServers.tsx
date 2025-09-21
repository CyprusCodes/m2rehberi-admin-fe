"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Plus,
  Calendar,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Activity,
  TrendingUp,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { fetchFrontendUserServers } from "@/services/servers";
import { CreateServerModal } from "./Sections/CreateServerModal";
import toast from "react-hot-toast";

interface ServerData {
  id: number;
  name: string;
  description: string;
  status: "online" | "offline" | "maintenance" | "unknown";
  approvalStatus?: "pending" | "approved" | "rejected";
  rejectNote?: string | null;
  players?: number;
  maxPlayers?: number;
  website?: string;
  discord?: string;
  createdAt: string;
  updatedAt: string;
}

interface MyServersProps {
  openNewServer: boolean;
  setOpenNewServer: (open: boolean) => void;
}

export function MyServers({ openNewServer, setOpenNewServer }: MyServersProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // detail uses page navigation now

  // Check if user can add servers
  const canAddServer =
    user?.role === "server_owner" || user?.role === "super_admin";

  const loadServers = async () => {
    try {
      setIsLoading(true);
      const res = await fetchFrontendUserServers();
      const list = (res.data || []).map((s: any) => ({
        id: Number(s.server_id ?? s.id),
        name: String(s.server_name ?? s.name ?? ""),
        description: String(s.description ?? ""),
        status: (s.status ?? "unknown") as ServerData["status"],
        approvalStatus: (s.approval_status ??
          s.approvalStatus ??
          "approved") as ServerData["approvalStatus"],
        rejectNote: s.reject_note ?? s.rejectNote ?? null,
        players: 0,
        maxPlayers: 0,
        website: s.website_link ?? s.websiteLink ?? undefined,
        discord: s.discord_link ?? s.discordLink ?? undefined,
        createdAt: s.created_at ?? s.createdAt ?? new Date().toISOString(),
        updatedAt: s.updated_at ?? s.updatedAt ?? new Date().toISOString(),
      })) as ServerData[];
      setServers(list);
    } catch (e) {
      console.error("Failed to load user servers", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServers();

    const onRefresh = () => loadServers();
    // window.addEventListener("servers:refresh", onRefresh);
    
    // window.addEventListener("focus", onRefresh);
    
    return () => {
    //  window.removeEventListener("servers:refresh", onRefresh);
      // window.removeEventListener("focus", onRefresh);
    };
  }, []);

  // status badges handled in child components if needed

  const handleCreateServer = () => {
    if (!canAddServer) return;
    setOpenNewServer(true);
  };

  const handleRequestRoleUpgrade = () => {
    router.push("/profile?tab=requests");
  };

  const handleViewServer = (serverId: number) => {
    const srv = servers.find((s) => s.id === serverId);
    if (!srv) return;
    if (srv.approvalStatus === "pending") {
      toast.error(
        "Sunucunuz moderatör onayında. Onaylanınca burada yönetebileceksiniz."
      );
      return;
    }
    if (srv.approvalStatus === "rejected") {
      toast.error(
        `Sunucunuz reddedildi${srv.rejectNote ? `: ${srv.rejectNote}` : ""}`
      );
      return;
    }
    router.push(`/profile/my-servers-detail/${serverId}`);
  };

  const getStatusIcon = (server: ServerData) => {
    if (server.approvalStatus === "pending") return <Clock className="w-4 h-4" />
    if (server.approvalStatus === "rejected") return <XCircle className="w-4 h-4" />
    switch (server.status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />
      case "maintenance":
        return <AlertCircle className="w-4 h-4" />
      case "offline":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (server: ServerData) => {
    if (server.approvalStatus === "pending") return "text-purple-200"
    if (server.approvalStatus === "rejected") return "text-rose-200"
    switch (server.status) {
      case "online":
        return "text-emerald-200"
      case "maintenance":
        return "text-purple-200"
      case "offline":
        return "text-rose-200"
      default:
        return "text-slate-300"
    }
  }

  const getStatusPulse = (server: ServerData) => {
    if (server.approvalStatus !== "approved") return ""
    return server.status === "online" ? "animate-pulse" : ""
  }

  // Create handled in CreateServerModal

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="relative">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-400" />
            <Gamepad2 className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-indigo-200" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-100">Sunucular yükleniyor...</p>
            <p className="text-xs text-slate-400">Sunucu bilgileriniz getiriliyor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-8 shadow-xl shadow-black/30">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-3">
                <Gamepad2 className="h-8 w-8 text-indigo-200" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-100">Sunucularım</h1>
                <p className="text-sm text-slate-400">
                  Yönettiğiniz sunucuları görüntüleyin ve yönetin
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canAddServer ? (
              <Button
                onClick={handleCreateServer}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 px-6 py-3 shadow-lg shadow-indigo-900/40"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                <span>Sunucu Ekle</span>
              </Button>
            ) : (
              <Button
                onClick={handleRequestRoleUpgrade}
                variant="outline"
                className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:border-indigo-400/40"
                size="lg"
              >
                <Shield className="h-5 w-5" />
                <span>Rol Değiştir</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border border-slate-800/60 bg-slate-900/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Toplam Sunucu
                </p>
                <p className="text-3xl font-semibold text-slate-100">
                  {servers.length}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-4">
                <Server className="h-8 w-8 text-indigo-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="h-4 w-4 text-indigo-200" />
              <span>Toplam sunucu sayınız</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/60 bg-slate-900/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Aktif Sunucu
                </p>
                <p className="text-3xl font-semibold text-slate-100">
                  {
                    servers.filter(
                      (s) =>
                        s.approvalStatus === "approved" && s.status === "online"
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-500/20 p-4">
                <Activity className="h-8 w-8 text-emerald-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle className="h-4 w-4 text-emerald-200" />
              <span>Çevrimiçi sunucular</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/60 bg-slate-900/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Bekleyen
                </p>
                <p className="text-3xl font-semibold text-slate-100">
                  {servers.filter((s) => s.approvalStatus === "pending").length}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-slate-500/20 p-4">
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-4 w-4 text-purple-200" />
              <span>Onay bekleyen sunucular</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servers List */}
      {servers.length === 0 ? (
        <Card className="rounded-3xl border border-slate-800/60 bg-slate-900/50 shadow-xl shadow-black/30">
          <CardContent className="py-16">
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/70">
                <Server className="h-10 w-10 text-slate-400" />
              </div>
              
              {canAddServer ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Henüz sunucunuz yok
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      İlk sunucunuzu ekleyerek başlayın
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateServer}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                    Sunucu Ekle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Sunucu eklemek için yetkiniz yok
                    </h3>
                    <p className="mt-2 max-w-md mx-auto text-sm text-slate-400">
                      Sunucu ekleyebilmek için "Sunucu Sahibi" rolüne sahip olmanız gerekiyor.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={handleRequestRoleUpgrade}
                      variant="outline"
                      className="rounded-xl border border-slate-700/60 text-slate-200 hover:border-indigo-400/40"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Rol Değiştir
                    </Button>
                    <Button
                      onClick={() => router.push("/profile?tab=requests")}
                      variant="ghost"
                      className="rounded-xl text-indigo-200 hover:bg-indigo-500/10"
                    >
                      Taleplerim
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {servers.map((server) => (
            <Card
              key={server.id}
              className="group cursor-pointer border border-slate-800/60 bg-slate-900/50 shadow-lg shadow-black/30 transition-all duration-200 hover:border-indigo-500/40"
              onClick={() => handleViewServer(server.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Server Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/70 ${getStatusPulse(server)}`}>
                        <Server className={`h-6 w-6 ${getStatusColor(server)}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="truncate text-lg font-semibold text-slate-100">
                          {server.name}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-200">
                          {getStatusIcon(server)}
                          {server.approvalStatus === "approved"
                            ? server.status === "online" ? "Çevrimiçi" : 
                              server.status === "offline" ? "Çevrimdışı" :
                              server.status === "maintenance" ? "Bakımda" : "Bilinmiyor"
                            : server.approvalStatus === "pending" ? "Onay Bekliyor" : "Reddedildi"}
                        </div>
                      </div>
                      
                      <div className="mb-2 line-clamp-1 text-sm text-slate-400">
                        {server.description ? <div dangerouslySetInnerHTML={{ __html: server.description }} /> : 'Açıklama bulunmuyor'}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(server.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                        
                        {server.website && (
                          <div className="flex items-center gap-1.5 text-emerald-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>Website</span>
                          </div>
                        )}
                        
                        {server.discord && (
                          <div className="flex items-center gap-1.5 text-indigo-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            <span>Discord</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl px-4 py-2 text-slate-200 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Yönet
                    </Button>
                  </div>
                </div>

                {/* Status Messages */}
                {server.approvalStatus === "pending" && (
                  <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
                    <div className="flex items-center gap-2 text-sm text-purple-200">
                      <Clock className="h-4 w-4" />
                      <p>
                        Admin onayı bekleniyor - Sunucunuz inceleniyor
                      </p>
                    </div>
                  </div>
                )}
                
                {server.approvalStatus === "rejected" && server.rejectNote && (
                  <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-200" />
                      <div>
                        <p className="text-sm font-medium text-rose-100">
                          Sunucunuz reddedildi
                        </p>
                        <p className="mt-0.5 text-xs text-rose-200/80">
                          Sebep: {server.rejectNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateServerModal
        open={openNewServer}
        onOpenChange={setOpenNewServer}
        onCreated={loadServers}
      />
    </div>
  );
}

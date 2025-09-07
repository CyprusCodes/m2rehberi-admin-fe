"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Plus,
  Users,
  Calendar,
  Shield,
  ArrowRight,
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
    if (server.approvalStatus === "pending") return "text-purple-600 dark:text-purple-400"
    if (server.approvalStatus === "rejected") return "text-red-600 dark:text-red-400"
    switch (server.status) {
      case "online":
        return "text-emerald-600 dark:text-emerald-400"
      case "maintenance":
        return "text-purple-600 dark:text-purple-400"
      case "offline":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  const getStatusBgColor = (server: ServerData) => {
    if (server.approvalStatus === "pending") return "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
    if (server.approvalStatus === "rejected") return "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
    switch (server.status) {
      case "online":
        return "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20"
      case "maintenance":
        return "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
      case "offline":
        return "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20"
    }
  }

  const getStatusPulse = (server: ServerData) => {
    if (server.approvalStatus !== "approved") return ""
    return server.status === "online" ? "animate-pulse" : ""
  }

  // Create handled in CreateServerModal

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <Gamepad2 className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Sunucular yükleniyor...</p>
            <p className="text-sm text-muted-foreground">Sunucu bilgileriniz getiriliyor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-black/5 via-background to-secondary/5 rounded-2xl p-8 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-6 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sunucularım</h1>
                <p className="text-muted-foreground text-lg">
                  Yönettiğiniz sunucuları görüntüleyin ve yönetin
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {canAddServer ? (
              <Button
                onClick={handleCreateServer}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                <span>Sunucu Ekle</span>
              </Button>
            ) : (
              <Button
                onClick={handleRequestRoleUpgrade}
                variant="outline"
                className="flex items-center space-x-2 border-2 hover:bg-primary/5"
                size="lg"
              >
                <Shield className="w-5 h-5" />
                <span>Rol Değiştir</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Toplam Sunucu
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {servers.length}
                </p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
              <span>Toplam sunucu sayınız</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Aktif Sunucu
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {
                    servers.filter(
                      (s) =>
                        s.approvalStatus === "approved" && s.status === "online"
                    ).length
                  }
                </p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Çevrimiçi sunucular</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Bekleyen
                </p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {servers.filter((s) => s.approvalStatus === "pending").length}
                </p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
              <span>Onay bekleyen sunucular</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servers List */}
      {servers.length === 0 ? (
        <Card className="border border-dashed border-muted-foreground/25">
          <CardContent className="pt-16 pb-16">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                <Server className="w-10 h-10 text-muted-foreground" />
              </div>
              
              {canAddServer ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Henüz sunucunuz yok
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      İlk sunucunuzu ekleyerek başlayın
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateServer}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Sunucu Ekle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Sunucu eklemek için yetkiniz yok
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Sunucu ekleyebilmek için "Sunucu Sahibi" rolüne sahip olmanız gerekiyor.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleRequestRoleUpgrade}
                      variant="outline"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Rol Değiştir
                    </Button>
                    <Button
                      onClick={() => router.push("/profile?tab=requests")}
                      variant="ghost"
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
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary"
              onClick={() => handleViewServer(server.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Server Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        server.approvalStatus === "approved" && server.status === "online"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : server.approvalStatus === "pending"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                          : server.approvalStatus === "rejected"
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Server className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {server.name}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          server.approvalStatus === "approved"
                            ? server.status === "online" 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : server.status === "offline"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : server.status === "maintenance"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
                            : server.approvalStatus === "pending"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                          {getStatusIcon(server)}
                          {server.approvalStatus === "approved"
                            ? server.status === "online" ? "Çevrimiçi" : 
                              server.status === "offline" ? "Çevrimdışı" :
                              server.status === "maintenance" ? "Bakımda" : "Bilinmiyor"
                            : server.approvalStatus === "pending" ? "Onay Bekliyor" : "Reddedildi"}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {server.description || "Açıklama bulunmuyor"}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(server.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                        
                        {server.website && (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>Website</span>
                          </div>
                        )}
                        
                        {server.discord && (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Yönet
                    </Button>
                  </div>
                </div>

                {/* Status Messages */}
                {server.approvalStatus === "pending" && (
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Admin onayı bekleniyor - Sunucunuz inceleniyor
                      </p>
                    </div>
                  </div>
                )}
                
                {server.approvalStatus === "rejected" && server.rejectNote && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Sunucunuz reddedildi
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
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

      <div className="">
      <CreateServerModal
        open={openNewServer}
        onOpenChange={setOpenNewServer}
        onCreated={loadServers}
      />
      </div>
    </div>
  );
}

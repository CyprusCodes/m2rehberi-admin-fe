"use client";

import { useState, useEffect } from "react";
import { PushNotificationDataTable } from "./section/PushNotificationDataTable";
import { CreatePushNotificationDialog } from "./section/CreatePushNotificationDialog";
import { Button } from "@/components/ui/button";
import { Plus, BellRing, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import { pushNotificationEndpoints } from "@/lib/endpoints";
import { toast } from "sonner";

interface NotificationStats {
  totalActiveTokens: number;
  androidUsers: number;
  iosUsers: number;
}

export default function PushNotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await apiClient.get(pushNotificationEndpoints.getStats);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
      toast.error("İstatistikler yüklenirken hata oluştu");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleNotificationCreated = () => {
    setRefreshKey((prev) => prev + 1);
    // Refresh stats after creating a notification
    fetchStats();
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-purple-900/20 to-purple-600/10 p-6 rounded-2xl border border-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/20">
            <BellRing className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              Push Bildirim Merkezi
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Kullanıcılarınıza anlık bildirimler gönderin, kampanyalarınızı
              yönetin ve etkileşimi artırın.
            </p>
          </div>
        </div>

        <CreatePushNotificationDialog onSuccess={handleNotificationCreated}>
          <Button className="h-12 px-6 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20 transition-all hover:scale-105 rounded-xl text-base font-medium">
            <Plus className="h-5 w-5 mr-2 text-white" />
            Yeni Kampanya Oluştur
          </Button>
        </CreatePushNotificationDialog>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-linear-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Aktif Token</p>
              <p className="text-2xl font-bold text-green-400">
                {statsLoading ? "..." : stats?.totalActiveTokens || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-center space-x-4">
            <div className="shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Image
                src="https://pbs.twimg.com/profile_images/2001450248942858240/PlkdmK0p.jpg"
                alt="Android Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Android Kullanıcıları</p>
              <p className="text-2xl font-bold text-blue-400">
                {statsLoading ? "..." : stats?.androidUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center space-x-4">
            <div className="shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Image
                src="https://www.irismostore.com/idea/hb/67/myassets/blogs/t0hhxicy-400x400.png?revision=1726491795"
                alt="iOS Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">iOS Kullanıcıları</p>
              <p className="text-2xl font-bold text-purple-400">
                {statsLoading ? "..." : stats?.iosUsers || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent pointer-events-none rounded-3xl" />
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-1 rounded-2xl overflow-hidden shadow-sm">
          <PushNotificationDataTable key={refreshKey} />
        </Card>
      </div>
    </div>
  );
}

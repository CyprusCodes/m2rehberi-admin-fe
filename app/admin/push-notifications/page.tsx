"use client";

import { useState } from "react";
import { PushNotificationDataTable } from "./section/PushNotificationDataTable";
import { CreatePushNotificationDialog } from "./section/CreatePushNotificationDialog";
import { Button } from "@/components/ui/button";
import { Plus, BellRing } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PushNotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNotificationCreated = () => {
    setRefreshKey((prev) => prev + 1);
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

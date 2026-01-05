"use client";

import { useState } from "react";
import Link from "next/link";
import { LotteryStats } from "@/components/lottery/lottery-stats";
import { LotteryTable } from "@/components/lottery/lottery-table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

export default function LotteryPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Çekiliş Yönetimi</h1>
          <p className="text-muted-foreground">
            Sistem çekilişlerini yönetin ve izleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/lottery/create">
            <Button className=" bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2 text-white" />
             <span className="text-white">Yeni Çekiliş Oluştur</span>
            </Button>
          </Link>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>

      <LotteryStats />
      <LotteryTable key={refreshKey} />
    </div>
  );
}

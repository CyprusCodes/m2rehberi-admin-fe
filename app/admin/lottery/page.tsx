"use client"

import { useState } from "react"
import { LotteryStats } from "@/components/lottery/lottery-stats"
import { LotteryTable } from "@/components/lottery/lottery-table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function LotteryPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Çekiliş Yönetimi</h1>
          <p className="text-muted-foreground">Sistem çekilişlerini yönetin ve izleyin</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      <LotteryStats />
      <LotteryTable key={refreshKey} />
    </div>
  )
}
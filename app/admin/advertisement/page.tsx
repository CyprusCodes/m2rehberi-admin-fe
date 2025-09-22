"use client"

import { useState } from "react"
import { AdvertisementStats } from "@/components/advertisement/advertisement-stats"
import { AdvertisementTable } from "@/components/advertisement/advertisement-table"
import { AddAdvertisementDialog } from "@/components/advertisement/add-advertisement-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdvertisementPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reklam Yönetimi</h1>
          <p className="text-muted-foreground">Sistem reklamlarını yönetin ve onaylayın</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Reklam
        </Button>
      </div>

      <AdvertisementStats />
      <AdvertisementTable key={refreshKey} />

      <AddAdvertisementDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  )
}

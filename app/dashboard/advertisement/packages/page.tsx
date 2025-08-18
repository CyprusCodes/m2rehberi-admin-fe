"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { PackagesStats } from "@/components/advertisement/packages-stats"
import { PackagesTable } from "@/components/advertisement/packages-table"
import { AddPackageDialog } from "@/components/advertisement/add-package-dialog"

export default function PackagesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reklam Paketleri</h1>
          <p className="text-muted-foreground">Reklam alanlarını yönetin ve paket fiyatlarını belirleyin</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Paket Oluştur
        </Button>
      </div>

      <PackagesStats />

      <Card>
        <CardHeader>
          <CardTitle>Reklam Paketleri</CardTitle>
          <CardDescription>Tüm reklam paketlerini görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <PackagesTable />
        </CardContent>
      </Card>

      <AddPackageDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}

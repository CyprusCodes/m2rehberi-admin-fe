"use client"

import { SecuritySettings } from "./sections/security-settings"
import { DatabaseSettings } from "./sections/database-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
        <p className="text-muted-foreground">MetinPort admin paneli ayarlarını yönetin</p>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="database">Veritabanı</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        <TabsContent value="database">
        <DatabaseSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

      </Tabs>
    </div>
  )
}

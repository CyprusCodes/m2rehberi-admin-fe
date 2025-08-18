import { ThemeSettings } from "@/components/settings/theme-settings"
import { SystemSettings } from "@/components/settings/system-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
        <p className="text-muted-foreground">MetinPort admin paneli ayarlarını yönetin</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

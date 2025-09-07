"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StatusManagementProps {
  server: any
  updating: boolean
  onUpdateStatus: (status: "online" | "offline" | "maintenance") => void
  getStatusIcon: (srv: any) => React.ReactNode
  getStatusBgColor: (srv: any) => string
  getStatusTextColor: (srv: any) => string
  statusText: (srv: any) => string
}

export default function StatusManagement({
  server,
  updating,
  onUpdateStatus,
  getStatusIcon,
  getStatusBgColor,
  getStatusTextColor,
  statusText
}: StatusManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Sunucu Durumu Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border">
          <div className="space-y-2">
            <p className="font-semibold text-lg">Mevcut Durum</p>
            <p className="text-sm text-muted-foreground">Sunucunuzun şu anki durumu</p>
          </div>
          <div className={`px-4 py-3 rounded-xl flex items-center gap-3 ${getStatusBgColor(server)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(server)}
              <span className={`font-semibold text-sm ${getStatusTextColor(server)}`}>
                {statusText(server)}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              server?.status === "online" ? "bg-green-500" : 
              server?.status === "offline" ? "bg-red-500" : 
              server?.status === "maintenance" ? "bg-yellow-500" : "bg-gray-500"
            }`}></div>
          </div>
        </div>

        {server.approval_status === "approved" ? (
          <div className="space-y-6">
            <Separator />
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-4">Sunucu Durumu</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Aktif (Online)</p>
                        <p className="text-sm text-muted-foreground">Sunucu oyuncular tarafından erişilebilir</p>
                      </div>
                    </div>
                    <Switch
                      checked={server.status === "online"}
                      onCheckedChange={(checked) => {
                        if (checked) onUpdateStatus("online")
                      }}
                      disabled={updating}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Bakımda</p>
                        <p className="text-sm text-muted-foreground">Geçici olarak erişim kısıtlı</p>
                      </div>
                    </div>
                    <Switch
                      checked={server.status === "maintenance"}
                      onCheckedChange={(checked) => {
                        if (checked) onUpdateStatus("maintenance")
                      }}
                      disabled={updating}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium">Çevrimdışı</p>
                        <p className="text-sm text-muted-foreground">Sunucu erişilemez durumda</p>
                      </div>
                    </div>
                    <Switch
                      checked={server.status === "offline"}
                      onCheckedChange={(checked) => {
                        if (checked) onUpdateStatus("offline")
                      }}
                      disabled={updating}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-lg text-yellow-800 dark:text-yellow-200">Onay Bekleniyor</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Durum güncelleme özellikleri admin onayı sonrası kullanılabilir olacaktır.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

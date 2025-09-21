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
    <Card className="border border-slate-800/60 bg-slate-900/60 shadow-lg shadow-black/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Activity className="h-5 w-5 text-indigo-200" />
          Sunucu Durumu Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-slate-200">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-100">Mevcut Durum</p>
            <p className="text-xs text-slate-400">Sunucunuzun şu anki durumu</p>
          </div>
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${getStatusBgColor(server)}`}>
            <div className="flex items-center gap-2 text-slate-100">
              {getStatusIcon(server)}
              <span className={`text-sm font-semibold ${getStatusTextColor(server)}`}>
                {statusText(server)}
              </span>
            </div>
          </div>
        </div>

        {server.approval_status === "approved" ? (
          <div className="space-y-6">
            <Separator />
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-lg font-semibold text-slate-100">Sunucu Durumu</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-200" />
                      <div>
                        <p className="font-medium text-slate-100">Aktif (Online)</p>
                        <p className="text-sm text-slate-400">Sunucu oyuncular tarafından erişilebilir</p>
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

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-indigo-200" />
                      <div>
                        <p className="font-medium text-slate-100">Bakımda</p>
                        <p className="text-sm text-slate-400">Geçici olarak erişim kısıtlı</p>
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

                  <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-rose-200" />
                      <div>
                        <p className="font-medium text-slate-100">Çevrimdışı</p>
                        <p className="text-sm text-slate-400">Sunucu erişilemez durumda</p>
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
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-6 text-amber-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6" />
              <div>
                <p className="text-sm font-semibold">Onay bekleniyor</p>
                <p className="text-xs text-amber-200/80">
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

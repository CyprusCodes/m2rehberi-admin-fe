"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Gamepad2, Server, Activity } from "lucide-react"

interface ServerHeaderProps {
  server: any
  onBack: () => void
  getStatusIcon: (srv: any) => React.ReactNode
  getStatusBgColor: (srv: any) => string
  getStatusTextColor: (srv: any) => string
  statusText: (srv: any) => string
}

export default function ServerHeader({
  server,
  onBack,
  getStatusIcon,
  getStatusBgColor,
  getStatusTextColor,
  statusText
}: ServerHeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-xl shadow-black/30">
      <div className="mb-6 flex items-start justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-300 hover:bg-slate-900/60">
          <ArrowLeft className="h-4 w-4" />
          Geri dön
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-3">
              <Gamepad2 className="h-8 w-8 text-indigo-200" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-100 lg:text-4xl">
                {server.server_name || server.name}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                <Server className="h-4 w-4" />
                {server.game_type || 'Metin2'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${getStatusBgColor(server)}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon(server)}
              <span className={`text-sm font-semibold ${getStatusTextColor(server)}`}>
                {statusText(server)}
              </span>
            </div>
          </div>

          {server.approval_status === 'approved' && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <Activity className="h-4 w-4 text-emerald-200" />
              Sunucu aktif
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-balance">
                  {server.server_name || server.name}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                  <Server className="w-4 h-4" />
                  {server.game_type || "Metin2"}
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col items-end gap-4">
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

            {server.approval_status === "approved" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                Sunucu Aktif
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, X, Check } from "lucide-react"

interface ServerStatusBadgeProps {
  status: string
}

export function ServerStatusBadge({ status }: ServerStatusBadgeProps) {
  switch (status) {
    case "online":
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Çevrimiçi</Badge>
    case "offline":
    case "closed":
      return <Badge variant="destructive">Kapalı</Badge>
    case "pending":
      return <Badge className="bg-orange-500 hover:bg-orange-600"><Clock className="w-3 h-3 mr-1" />Onay Bekliyor</Badge>
    case "rejected":
      return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Reddedildi</Badge>
    default:
      return <Badge variant="secondary">Bilinmiyor</Badge>
  }
}

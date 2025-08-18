"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, X, Check } from "lucide-react"

interface ServerApprovalBadgeProps {
  approvalStatus: string
}

export function ServerApprovalBadge({ approvalStatus }: ServerApprovalBadgeProps) {
  switch (approvalStatus) {
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600"><Check className="w-3 h-3 mr-1" />Onaylandı</Badge>
    case "pending":
      return <Badge className="bg-orange-500 hover:bg-orange-600"><Clock className="w-3 h-3 mr-1" />Beklemede</Badge>
    case "rejected":
      return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Reddedildi</Badge>
    default:
      return <Badge variant="secondary">Bilinmiyor</Badge>
  }
}

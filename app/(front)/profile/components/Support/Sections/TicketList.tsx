"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, AlertTriangle, CheckCircle2, XCircle, Pause } from "lucide-react"

interface Ticket {
  ticket_id: number
  title: string
  status: string
  priority: string
  last_message_text?: string
}

interface TicketListProps {
  tickets: Ticket[]
  statusFilter: string
  priorityFilter: string
  onStatusFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onOpenChat: (ticket: Ticket) => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <Clock className="w-4 h-4" />
    case "pending":
      return <Pause className="w-4 h-4" />
    case "in_progress":
      return <AlertTriangle className="w-4 h-4" />
    case "resolved":
      return <CheckCircle2 className="w-4 h-4" />
    case "closed":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    case "pending":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    case "in_progress":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "resolved":
      return "bg-green-500/20 text-green-300 border-green-500/30"
    case "closed":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-500/20 text-green-300 border-green-500/30"
    case "normal":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    case "high":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "urgent":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "open":
      return "Açık"
    case "pending":
      return "Beklemede"
    case "in_progress":
      return "İşlemde"
    case "resolved":
      return "Çözüldü"
    case "closed":
      return "Kapatıldı"
    default:
      return status
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "low":
      return "Düşük"
    case "normal":
      return "Normal"
    case "high":
      return "Yüksek"
    case "urgent":
      return "Acil"
    default:
      return priority
  }
}

export default function TicketList({
  tickets,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onOpenChat,
}: TicketListProps) {
  const filteredTickets = tickets
    .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
    .filter((t) => (priorityFilter === "all" ? true : t.priority === priorityFilter))

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl font-semibold">Taleplerim</CardTitle>
        <div className="flex items-center gap-3 pt-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white w-[180px]">
              <SelectValue placeholder="Durum Filtresi" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-white/20">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="open">Açık</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="in_progress">İşlemde</SelectItem>
              <SelectItem value="resolved">Çözüldü</SelectItem>
              <SelectItem value="closed">Kapatıldı</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white w-[180px]">
              <SelectValue placeholder="Öncelik Filtresi" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-white/20">
              <SelectItem value="all">Tüm Öncelikler</SelectItem>
              <SelectItem value="low">Düşük</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Yüksek</SelectItem>
              <SelectItem value="urgent">Acil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="group p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/60 text-sm font-mono">#{ticket.ticket_id}</span>
                    <h3 className="text-white font-medium truncate">{ticket.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${getStatusColor(ticket.status)} text-xs font-medium`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{getStatusText(ticket.status)}</span>
                    </Badge>
                    <Badge className={`${getPriorityColor(ticket.priority)} text-xs font-medium`}>
                      {getPriorityText(ticket.priority)}
                    </Badge>
                  </div>
                  {ticket.last_message_text && (
                    <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">{ticket.last_message_text}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onOpenChat(ticket)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 shrink-0"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Yanıt
                </Button>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/40 text-lg mb-2">{tickets.length === 0 ? "📝" : "🔍"}</div>
              <p className="text-white/70 text-base">
                {tickets.length === 0 ? "Henüz talebiniz yok." : "Filtreye uygun talep bulunamadı."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

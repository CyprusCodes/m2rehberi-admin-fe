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
      return "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
    case "pending":
      return "border-amber-400/40 bg-amber-500/10 text-amber-200"
    case "in_progress":
      return "border-orange-400/40 bg-orange-500/10 text-orange-200"
    case "resolved":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    case "closed":
      return "border-slate-500/40 bg-slate-500/10 text-slate-200"
    default:
      return "border-slate-500/40 bg-slate-500/10 text-slate-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    case "normal":
      return "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
    case "high":
      return "border-orange-400/40 bg-orange-500/10 text-orange-200"
    case "urgent":
      return "border-rose-400/40 bg-rose-500/10 text-rose-200"
    default:
      return "border-slate-500/40 bg-slate-500/10 text-slate-200"
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
    <Card className="border border-slate-800/60 bg-slate-900/60 shadow-lg shadow-black/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-100 text-xl font-semibold">Taleplerim</CardTitle>
        <div className="flex items-center gap-3 pt-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] rounded-xl border border-slate-700/60 bg-slate-900/70 text-slate-200">
              <SelectValue placeholder="Durum Filtresi" />
            </SelectTrigger>
            <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="open">Açık</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="in_progress">İşlemde</SelectItem>
              <SelectItem value="resolved">Çözüldü</SelectItem>
              <SelectItem value="closed">Kapatıldı</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
            <SelectTrigger className="w-[180px] rounded-xl border border-slate-700/60 bg-slate-900/70 text-slate-200">
              <SelectValue placeholder="Öncelik Filtresi" />
            </SelectTrigger>
            <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
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
              className="group rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-900/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">#{ticket.ticket_id}</span>
                    <h3 className="truncate text-slate-100 font-medium">{ticket.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${getStatusColor(ticket.status)} text-xs font-medium rounded-full px-3 py-1`}> 
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{getStatusText(ticket.status)}</span>
                    </Badge>
                    <Badge className={`${getPriorityColor(ticket.priority)} text-xs font-medium rounded-full px-3 py-1`}>
                      {getPriorityText(ticket.priority)}
                    </Badge>
                  </div>
                  {ticket.last_message_text && (
                    <p className="text-sm leading-relaxed text-slate-400 line-clamp-2">{ticket.last_message_text}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenChat(ticket)}
                  className="shrink-0 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-100 hover:border-indigo-400/50 hover:bg-indigo-500/20"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Yanıt
                </Button>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-2 text-lg text-slate-500">{tickets.length === 0 ? '📝' : '🔍'}</div>
              <p className="text-sm text-slate-400">
                {tickets.length === 0 ? "Henüz talebiniz yok." : "Filtreye uygun talep bulunamadı."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

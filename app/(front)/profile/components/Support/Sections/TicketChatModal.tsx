"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, Clock, AlertTriangle, CheckCircle2, XCircle, Pause, X } from "lucide-react"

interface Message {
  message_id: number
  message: string
  author_id: number
  created_at: string
  is_seen: boolean
}

interface Ticket {
  ticket_id: number
  title: string
  status: string
}

interface TicketChatModalProps {
  isOpen: boolean
  onClose: () => void
  activeTicket: Ticket | null
  messages: Message[]
  newMessage: string
  onNewMessageChange: (message: string) => void
  onSendMessage: () => void
  currentUserId?: number
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <Clock className="h-4 w-4" />
    case "pending":
      return <Pause className="h-4 w-4" />
    case "in_progress":
      return <AlertTriangle className="h-4 w-4" />
    case "resolved":
      return <CheckCircle2 className="h-4 w-4" />
    case "closed":
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
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

export default function TicketChatModal({
  isOpen,
  onClose,
  activeTicket,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  currentUserId,
}: TicketChatModalProps) {
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex min-w-[600px] flex-col border-l border-slate-800/60 bg-slate-950/95 p-0 sm:w-[940px]"
      >
        <SheetHeader className="border-b border-slate-800/60 bg-gradient-to-r from-indigo-500/10 to-transparent px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-2">
                <MessageSquare className="h-5 w-5 text-indigo-100" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-slate-100 tracking-tight">
                  #{activeTicket?.ticket_id} • {activeTicket?.title}
                </SheetTitle>
                <p className="mt-1 text-sm text-slate-400">Destek Sohbeti</p>
              </div>
            </div>
            {activeTicket && (
              <Badge className={`${getStatusColor(activeTicket.status)} flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold`}>
                {getStatusIcon(activeTicket.status)}
                <span>{getStatusText(activeTicket.status)}</span>
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-transparent to-slate-900/70">
          <div
            ref={messagesRef}
            className="flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500/20"
          >
            {messages.map((message) => {
              const isMine = message.author_id === currentUserId
              return (
                <div key={message.message_id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${isMine ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-2xl px-5 py-3 transition-all duration-200 ${
                        isMine
                          ? "rounded-br-md bg-gradient-to-br from-indigo-600 to-indigo-700 text-slate-50 shadow-lg shadow-indigo-900/30"
                          : "rounded-bl-md border border-slate-700/60 bg-slate-900/70 text-slate-200 shadow-lg shadow-black/20"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{message.message}</div>
                    </div>
                    <div
                      className={`mt-2 flex items-center gap-2 px-2 text-xs text-slate-500 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {new Date(message.created_at).toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMine && (
                        <span className="flex items-center text-xs">
                          {message.is_seen ? (
                            <span className="text-indigo-200">✓✓</span>
                          ) : (
                            <span className="text-slate-500">✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-6 rounded-full bg-slate-800/70 p-4">
                  <MessageSquare className="h-8 w-8 text-slate-500" />
                </div>
                <p className="mb-2 text-lg font-medium text-slate-100">Henüz mesaj yok</p>
                <p className="text-sm text-slate-400">İlk mesajı göndererek konuşmaya başlayın</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/60 bg-slate-950/80 p-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => onNewMessageChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                />
                <button
                  type="button"
                  onClick={() => onNewMessageChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label="Temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 px-4 py-3 text-slate-100 shadow-lg shadow-indigo-900/30 disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="mr-2 h-4 w-4" />
                Gönder
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

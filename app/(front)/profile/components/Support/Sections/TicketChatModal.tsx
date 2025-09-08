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
        className="bg-nature-900 border-l border-white/10 backdrop-blur-xl min-w-[600px] sm:w-[940px]  p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-white text-lg font-semibold tracking-tight">
                  #{activeTicket?.ticket_id} • {activeTicket?.title}
                </SheetTitle>
                <p className="text-white/60 text-sm mt-1">Destek Sohbeti</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeTicket && (
                <Badge className={`${getStatusColor(activeTicket.status)} text-xs font-medium px-3 py-1 rounded-full`}>
                  {getStatusIcon(activeTicket.status)}
                  <span className="ml-1">{getStatusText(activeTicket.status)}</span>
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-transparent to-white/5">
          <div
            ref={messagesRef}
            className="flex-1 space-y-6 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {messages.map((message) => {
              const isMine = message.author_id === currentUserId
              return (
                <div key={message.message_id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${isMine ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-5 py-3 rounded-2xl backdrop-blur-sm transition-all duration-200 ${
                        isMine
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg shadow-blue-600/20"
                          : "bg-white/15 text-white rounded-bl-md border border-white/20 shadow-lg shadow-black/10"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.message}</div>
                    </div>
                    <div
                      className={`text-xs text-white/50 mt-2 px-2 flex items-center gap-2 ${isMine ? "justify-end" : "justify-start"}`}
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
                        <span className="flex items-center">
                          {message.is_seen ? (
                            <span className="text-blue-400 text-base">✓✓</span>
                          ) : (
                            <span className="text-white/30 text-base">✓</span>
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
                <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                  <MessageSquare className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/70 text-lg font-medium mb-2">Henüz mesaj yok</p>
                <p className="text-white/50 text-sm">İlk mesajı göndererek konuşmaya başlayın</p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-6 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-sm">
            {activeTicket?.status === "closed" ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-red-500/20 backdrop-blur-sm mb-4 mx-auto w-fit">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-white/70 text-lg font-medium mb-2">Bu talep kapatılmış</p>
                  <p className="text-white/50 text-sm">Kapatılan taleplere mesaj gönderemezsiniz</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-3 pr-12 backdrop-blur-sm focus:bg-white/15 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                    <kbd className="text-xs">Enter</kbd>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

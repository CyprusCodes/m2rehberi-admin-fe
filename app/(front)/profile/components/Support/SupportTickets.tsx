"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  fetchMyFrontSupportTickets,
  fetchFrontSupportCategories,
  createFrontSupportTicket,
  fetchFrontSupportMessages,
  createFrontSupportMessage,
} from "@/services/support/front"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Headphones } from "lucide-react"

// Import updated components
import TicketList from "./Sections/TicketList"
import CreateTicketModal from "./Sections/CreateTicketModal"
import TicketChatModal from "./Sections/TicketChatModal"

export default function SupportTicketsSection() {
  const [tickets, setTickets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeTicket, setActiveTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [form, setForm] = useState({
    categoryId: 0,
    title: "",
    description: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  })
  const [newMessage, setNewMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const { user } = useAuth()

  const loadTickets = async () => {
    try {
      const res = await fetchMyFrontSupportTickets()
      setTickets(res.data || [])
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Ticketlar yüklenemedi")
    }
  }

  const loadCategories = async () => {
    const res = await fetchFrontSupportCategories()
    setCategories(res.data || [])
    if (res.data?.length) setForm((f) => ({ ...f, categoryId: res.data[0].category_id }))
  }

  useEffect(() => {
    loadTickets()
    loadCategories()
  }, [])

  const openChat = async (ticket: any) => {
    setActiveTicket(ticket)
    const res = await fetchFrontSupportMessages(ticket.ticket_id)
    setMessages(res.data || [])
    setChatOpen(true)
  }

  const sendMessage = async () => {
    if (!activeTicket || !newMessage) return
    await createFrontSupportMessage(activeTicket.ticket_id, { message: newMessage })
    setNewMessage("")
    const res = await fetchFrontSupportMessages(activeTicket.ticket_id)
    setMessages(res.data || [])
  }

  const submitCreate = async () => {
    try {
      if (!form.categoryId || !form.title || !form.description) return toast.error("Zorunlu alanlar eksik")
      const res = await createFrontSupportTicket(form)
      setCreateOpen(false)
      setForm({ categoryId: categories?.[0]?.category_id || 0, title: "", description: "", priority: "normal" })
      await loadTickets()
      const created = (await fetchMyFrontSupportTickets()).data.find((t: any) => t.ticket_id === res.insertedTicketId)
      if (created) openChat(created)
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Oluşturulamadı")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Headphones className="w-8 h-8 text-white" />
          <div>
            <h2 className="text-3xl font-bold text-white">Destek Talepleri</h2>
            <p className="text-white/70 text-sm mt-1">Sorularınız için bizimle iletişime geçin</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Talep
        </Button>
      </div>

      <TicketList
        tickets={tickets}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onOpenChat={openChat}
      />

      <CreateTicketModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        categories={categories}
        form={form}
        onFormChange={setForm}
        onSubmit={submitCreate}
      />

      <TicketChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeTicket={activeTicket}
        messages={messages}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={sendMessage}
        currentUserId={user?.id ? Number(user.id) : undefined}
      />
    </div>
  )
}

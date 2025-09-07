"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchMyFrontSupportTickets, fetchFrontSupportCategories, createFrontSupportTicket, fetchFrontSupportMessages, createFrontSupportMessage } from "@/services/support/front";
import toast from "react-hot-toast";

import { useAuth } from '@/contexts/auth-context';

export default function SupportTicketsSection() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [form, setForm] = useState({ categoryId: 0, title: '', description: '', priority: 'normal' as 'low'|'normal'|'high'|'urgent' });
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const { user } = useAuth();
  const messagesRef = React.useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    try {
      const res = await fetchMyFrontSupportTickets();
      setTickets(res.data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Ticketlar yüklenemedi');
    }
  };

  const loadCategories = async () => {
    const res = await fetchFrontSupportCategories();
    setCategories(res.data || []);
    if (res.data?.length) setForm(f => ({ ...f, categoryId: res.data[0].category_id }));
  };

  useEffect(() => { loadTickets(); loadCategories(); }, []);

  const openChat = async (ticket: any) => {
    setActiveTicket(ticket);
    const res = await fetchFrontSupportMessages(ticket.ticket_id);
    setMessages(res.data || []);
    setChatOpen(true);
    setTimeout(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 0);
  };

  const sendMessage = async () => {
    if (!activeTicket || !newMessage) return;
    await createFrontSupportMessage(activeTicket.ticket_id, { message: newMessage });
    setNewMessage('');
    const res = await fetchFrontSupportMessages(activeTicket.ticket_id);
    setMessages(res.data || []);
    setTimeout(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 0);
  };

  const submitCreate = async () => {
    try {
      if (!form.categoryId || !form.title || !form.description) return toast.error('Zorunlu alanlar eksik');
      const res = await createFrontSupportTicket(form);
      setCreateOpen(false);
      setForm({ categoryId: categories?.[0]?.category_id || 0, title: '', description: '', priority: 'normal' });
      await loadTickets();
      const created = (await fetchMyFrontSupportTickets()).data.find((t: any) => t.ticket_id === res.insertedTicketId);
      if (created) openChat(created);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Oluşturulamadı');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Destek Talepleri</h2>
        <Button className="bg-gray-500" onClick={() => setCreateOpen(true)}>Yeni Talep</Button>
      </div>

      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Taleplerim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded bg-white/5 border-white/20 text-white px-3 py-2">
              <option value="all">Tüm Durumlar</option>
              <option value="open">open</option>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
              <option value="closed">closed</option>
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="rounded bg-white/5 border-white/20 text-white px-3 py-2">
              <option value="all">Tüm Öncelikler</option>
              <option value="low">low</option>
              <option value="normal">normal</option>
              <option value="high">high</option>
              <option value="urgent">urgent</option>
            </select>
          </div>
          <div className="divide-y divide-white/10">
            {tickets
              .filter(t => statusFilter === 'all' ? true : t.status === statusFilter)
              .filter(t => priorityFilter === 'all' ? true : t.priority === priorityFilter)
              .map(t => (
              <div key={t.ticket_id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-white font-medium">#{t.ticket_id} • {t.title}</div>
                  <div className="text-white/60 text-sm">{t.last_message_text ? t.last_message_text : `durum: ${t.status} • öncelik: ${t.priority}`}</div>
                </div>
                <div className="space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => openChat(t)}>Mesajlar</Button>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-white/70 text-center py-10">Henüz talebiniz yok.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-white/10 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Yeni Destek Talebi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-white/80 text-sm mb-1">Kategori</div>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: Number(e.target.value) })} className="w-full rounded bg-white/5 border-white/20 text-white px-3 py-2">
                {categories.map(c => (
                  <option value={c.category_id} key={c.category_id}>{c.name}</option>
                ))}
              </select>
            </div>

            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Başlık" className="bg-white/5 border-white/20 text-white" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Açıklama" className="w-full h-28 rounded bg-white/5 border border-white/20 text-white p-2" />
            <div>
              <div className="text-white/80 text-sm mb-1">Öncelik</div>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })} className="w-full rounded bg-white/5 border-white/20 text-white px-3 py-2">
                <option value="low">low</option>
                <option value="normal">normal</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
            </div>
            <Button onClick={submitCreate} className="bg-gray-500 w-full">Oluştur</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-white/10 border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">#{activeTicket?.ticket_id} • {activeTicket?.title} ({activeTicket?.status})</DialogTitle>
          </DialogHeader>
          <div ref={messagesRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {messages.map((m) => {
              const mine = m.author_id === user?.userId;
              return (
                <div key={m.message_id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-2xl max-w-[80%] ${mine ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
                    <div className="text-sm whitespace-pre-wrap">{m.message}</div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {new Date(m.created_at).toLocaleString()} {mine && <span>{m.is_seen ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className="text-white/70 text-center py-6">Mesaj yok</div>
            )}
          </div>
          <div className="flex gap-2">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Mesaj yaz..." className="bg-white/5 border-white/20 text-white" />
            <Button onClick={sendMessage} className="bg-gray-500">Gönder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

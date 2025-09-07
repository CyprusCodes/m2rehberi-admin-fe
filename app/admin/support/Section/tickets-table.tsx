"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchSupportTickets } from "@/services/support/tickets";
import { MessageSquare, Settings, Mail, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import TicketMessagesModal from "./TicketMessagesModal";
import TicketStatusModal from "./TicketStatusModal";
import TicketUserEmailModal from "./TicketUserEmailModal";

export interface TicketRow {
  ticket_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  category_id: number;
  category_name: string;
  title: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  last_message_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function TicketTable({ tickets, onView, onUpdateStatus, onSendEmail, statusCounts }: {
  tickets: TicketRow[];
  onView: (ticket: TicketRow) => void;
  onUpdateStatus: (ticket: TicketRow) => void;
  onSendEmail: (ticket: TicketRow) => void;
  statusCounts: {
    open: number;
    pending: number;
    in_progress: number;
    resolved: number;
    closed: number;
    total: number;
  };
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'open': { color: 'bg-blue-600', text: 'Açık' },
      'pending': { color: 'bg-yellow-600', text: 'Beklemede' },
      'in_progress': { color: 'bg-orange-600', text: 'İşlemde' },
      'resolved': { color: 'bg-green-600', text: 'Çözüldü' },
      'closed': { color: 'bg-gray-600', text: 'Kapalı' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-red-600', text: status };
    
    return (
      <Badge className={`${config.color} hover:${config.color.replace('600', '700')} text-white border-0`}>
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { color: string; text: string; showIcon?: boolean }> = {
      'low': { color: 'bg-green-600', text: 'Düşük' },
      'normal': { color: 'bg-blue-600', text: 'Normal' },
      'high': { color: 'bg-red-600', text: 'Yüksek', showIcon: true },
      'urgent': { color: 'bg-orange-600', text: 'Acil', showIcon: true }
    };
    
    const config = priorityConfig[priority] || { color: 'bg-gray-600', text: priority };
    
    return (
      <Badge className={`${config.color} hover:${config.color.replace('600', '700')} text-white border-0 flex items-center gap-1`}>
        {config.showIcon && <AlertTriangle className="h-3 w-3" />}
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-300 text-sm font-medium">Açık</div>
              <div className="text-2xl font-bold text-white">{statusCounts.open}</div>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/20 border border-yellow-600/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-300 text-sm font-medium">Beklemede</div>
              <div className="text-2xl font-bold text-white">{statusCounts.pending}</div>
            </div>
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-orange-600/20 border border-orange-600/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-orange-300 text-sm font-medium">İşlemde</div>
              <div className="text-2xl font-bold text-white">{statusCounts.in_progress}</div>
            </div>
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-green-600/20 border border-green-600/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-300 text-sm font-medium">Çözüldü</div>
              <div className="text-2xl font-bold text-white">{statusCounts.resolved}</div>
            </div>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-600/20 border border-gray-600/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm font-medium">Kapalı</div>
              <div className="text-2xl font-bold text-white">{statusCounts.closed}</div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Başlık</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Öncelik</TableHead>
            <TableHead>Atanan</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {tickets.map((t) => (
          <TableRow key={t.ticket_id} className="hover:bg-white/5">
            <TableCell className="text-white font-medium">#{t.ticket_id}</TableCell>
            <TableCell className="text-white/80">
              <div>
                <div className="font-medium">{t.first_name} {t.last_name}</div>
                <div className="text-xs text-white/60">{t.email}</div>
              </div>
            </TableCell>
            <TableCell className="text-white/80">{t.category_name}</TableCell>
            <TableCell className="text-white">{t.title}</TableCell>
            <TableCell>{getStatusBadge(t.status)}</TableCell>
            <TableCell>{getPriorityBadge(t.priority)}</TableCell>
            <TableCell className="text-white/80">{t.assigned_to ?? '-'}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                size="sm" 
                onClick={() => onUpdateStatus(t)}
                className="bg-orange-600 hover:bg-orange-700 text-white border-0"
                title="Durum Güncelle"
              >
                <Settings className="h-4 w-4"/>
              </Button>
              <Button 
                size="sm" 
                onClick={() => onSendEmail(t)}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
                title="E-posta Gönder"
              >
                <Mail className="h-4 w-4"/>
              </Button>
              <Button 
                size="sm" 
                onClick={() => onView(t)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                title="Mesajları Görüntüle"
              >
                <MessageSquare className="h-4 w-4"/>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

export default function SupportTicketsTable() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [activeTicketTitle, setActiveTicketTitle] = useState<string>("");
  const [activeTicketStatus, setActiveTicketStatus] = useState<string>("");
  const [activeUserEmail, setActiveUserEmail] = useState<string>("");
  const [activeUserName, setActiveUserName] = useState<string>("");

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = {
      open: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      total: tickets.length
    };

    tickets.forEach(ticket => {
      if (counts.hasOwnProperty(ticket.status)) {
        counts[ticket.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const load = async () => {
    try {
      const res: any = await fetchSupportTickets();
      const arr = res?.data || res?.tickets || [];
      setTickets(arr);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Ticketlar yüklenemedi");
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpdateStatus = (ticket: TicketRow) => {
    setActiveTicketId(ticket.ticket_id);
    setActiveTicketStatus(ticket.status);
    setStatusModalOpen(true);
  };

  const handleView = (ticket: TicketRow) => {
    setActiveTicketId(ticket.ticket_id);
    setActiveTicketTitle(ticket.title);
    setActiveTicketStatus(ticket.status);
    setMessagesModalOpen(true);
  };

  const handleSendEmail = (ticket: TicketRow) => {
    setActiveTicketId(ticket.ticket_id);
    setActiveTicketTitle(ticket.title);
    setActiveUserEmail(ticket.email);
    setActiveUserName(`${ticket.first_name} ${ticket.last_name}`);
    setEmailModalOpen(true);
  };

  const handleStatusUpdated = () => {
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-white">Support Tickets</h2>
      </div>
      
      <TicketTable 
        tickets={tickets}
        onView={handleView}
        onUpdateStatus={handleUpdateStatus}
        onSendEmail={handleSendEmail}
        statusCounts={statusCounts}
      />

      <TicketMessagesModal
        open={messagesModalOpen}
        onOpenChange={setMessagesModalOpen}
        ticketId={activeTicketId}
        ticketTitle={activeTicketTitle}
        ticketStatus={activeTicketStatus}
      />

      <TicketStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        ticketId={activeTicketId}
        currentStatus={activeTicketStatus}
        onStatusUpdated={handleStatusUpdated}
      />

      <TicketUserEmailModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        userEmail={activeUserEmail}
        userName={activeUserName}
        ticketId={activeTicketId || 0}
        ticketTitle={activeTicketTitle}
      />
    </div>
  );
}


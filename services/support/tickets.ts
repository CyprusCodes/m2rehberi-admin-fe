import { apiClient } from "@/lib/apiClient";
import { adminSupportTicketEndpoints } from "@/lib/endpoints";

export interface SupportTicket {
  ticket_id: number;
  user_id: number;
  category_id: number;
  title: string;
  status: 'open'|'pending'|'in_progress'|'resolved'|'closed';
  priority: 'low'|'normal'|'high'|'urgent';
  assigned_to?: number | null;
  last_message_at?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  message_id: number;
  ticket_id: number;
  author_id: number;
  replied_to_message_id?: number | null;
  message: string;
  is_internal: number | boolean;
  is_seen: number | boolean;
  seen_at?: string | null;
  created_at: string;
}

export const fetchSupportTickets = async (): Promise<{ data: any[] } | { tickets: any[] }> => {
  const res = await apiClient.get(adminSupportTicketEndpoints.getAll);
  return res.data;
};

export const fetchSupportTicketById = async (id: number): Promise<{ data: SupportTicket } | { ticket: SupportTicket | null }> => {
  const res = await apiClient.get(adminSupportTicketEndpoints.getById(id));
  return res.data;
};

export const assignSupportTicket = async (id: number, assignedTo: number): Promise<{ success: boolean }> => {
  const res = await apiClient.put(adminSupportTicketEndpoints.assign(id), { assignedTo });
  return res.data as { success: boolean };
};

export const updateSupportTicketStatus = async (id: number, status: SupportTicket['status']): Promise<{ success: boolean }> => {
  const res = await apiClient.put(adminSupportTicketEndpoints.updateStatus(id), { status });
  return res.data as { success: boolean };
};

export const fetchSupportMessages = async (ticketId: number): Promise<{ data: SupportMessage[] } | { messages: SupportMessage[] }> => {
  const res = await apiClient.get(adminSupportTicketEndpoints.getMessages(ticketId));
  return res.data;
};

export const createSupportMessage = async (ticketId: number, payload: { message: string; repliedToMessageId?: number; isInternal?: boolean }): Promise<{ insertedMessageId: number }> => {
  const res = await apiClient.post(adminSupportTicketEndpoints.createMessage(ticketId), payload);
  return res.data as { insertedMessageId: number };
};


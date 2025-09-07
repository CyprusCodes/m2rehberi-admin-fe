"use client"

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchSupportMessages, createSupportMessage } from "@/services/support/tickets";
import { Send, FileText, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: number | null;
  ticketTitle?: string;
  ticketStatus?: string;
}

const TicketMessagesModal: React.FC<Props> = ({ open, onOpenChange, ticketId, ticketTitle, ticketStatus }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!ticketId) return;
    try {
      const res: any = await fetchSupportMessages(ticketId);
      setMessages(res?.data || res?.messages || []);
    } catch (e: any) {
      toast.error("Mesajlar alınamadı");
    }
  };

  useEffect(() => {
    if (open) {
      setNewMessage("");
      setIsInternal(false);
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ticketId]);

  const send = async () => {
    if (!ticketId || !newMessage.trim() || (ticketStatus === 'closed' && !isInternal)) return;
    
    // Check if user can send messages based on status
    if (!isInternal && (ticketStatus === 'closed' || ticketStatus === 'pending')) {
      toast.error("Bu ticket durumunda mesaj gönderemezsiniz");
      return;
    }
    
    setLoading(true);
    try {
      await createSupportMessage(ticketId, { message: newMessage.trim(), isInternal });
      setNewMessage("");
      setIsInternal(false);
      await load();
    } catch (e: any) {
      toast.error("Mesaj gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Allow Enter for internal notes or when status allows messaging
      if (isInternal || (ticketStatus !== 'closed' && ticketStatus !== 'pending')) {
        e.preventDefault();
        send();
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: any[] }, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/20 w-[90vw] h-[80vh] min-w-6xl flex flex-col">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-white text-lg">
            {ticketTitle} - Ticket #{ticketId}
          </DialogTitle>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900/50">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-white/60">Henüz mesaj yok</div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex justify-center my-4">
                  <div className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm">
                    {date}
                  </div>
                </div>

                {/* Messages for this date */}
                {dateMessages.map((message: any, index: number) => {
                  const isUser = message.author_id !== 1; // Assuming admin has ID 1
                  const isInternalNote = message.is_internal;
                  const showAvatar = index === 0 || dateMessages[index - 1].author_id !== message.author_id;
                  
                  return (
                    <div key={message.message_id} className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-2`}>
                      <div className={`flex max-w-[70%] ${isUser ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
                        {/* Avatar */}
                        {showAvatar && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isInternalNote 
                              ? 'bg-purple-600 text-white' 
                              : isUser 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-green-600 text-white'
                          }`}>
                            {isInternalNote ? 'N' : isUser ? 'U' : 'A'}
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                          <div className={`px-4 py-2 rounded-2xl ${
                            isInternalNote
                              ? 'bg-purple-600 text-white border-2 border-purple-400'
                              : isUser 
                                ? 'bg-white/10 text-white rounded-bl-md' 
                                : 'bg-blue-600 text-white rounded-br-md'
                          }`}>
                            {isInternalNote && (
                              <div className="text-xs font-bold mb-1 flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                İÇ NOT
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap break-words">
                              {message.message}
                            </div>
                          </div>
                          <div className="text-xs text-white/50 mt-1 px-1">
                            {formatTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          {ticketStatus === 'closed' && !isInternal ? (
            <div className="bg-gray-600/20 border border-gray-600/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="text-sm text-gray-300">
                  Bu ticket kapatılmıştır. Sadece iç not ekleyebilirsiniz.
                </div>
              </div>
            </div>
          ) : ticketStatus === 'pending' && !isInternal ? (
            <div className="bg-yellow-600/20 border border-yellow-600/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="text-sm text-yellow-300">
                  Bu ticket beklemede. İşlemde olarak değiştirildiğinde mesaj yazabilirsiniz.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Internal Note Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isInternal} 
                    onChange={e => setIsInternal(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500"
                  />
                  <FileText className="h-4 w-4" />
                  İç Not (Kullanıcıya görünmez)
                </label>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder={isInternal ? "İç notunuzu yazın..." : "Mesajınızı yazın..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 flex-1 min-h-[60px] resize-none"
                  disabled={!ticketId}
                />
                <Button
                  onClick={send}
                  disabled={!newMessage.trim() || !ticketId || loading}
                  className={`px-4 ${isInternal ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white border-0`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketMessagesModal;


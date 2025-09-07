"use client"

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

interface TicketUserEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userName: string;
  ticketId: number;
  ticketTitle: string;
}

export default function TicketUserEmailModal({
  open,
  onOpenChange,
  userEmail,
  userName,
  ticketId,
  ticketTitle,
}: TicketUserEmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Konu ve mesaj alanları zorunludur");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual email sending logic here
      // For now, just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("E-posta başarıyla gönderildi");
      onOpenChange(false);
      
      // Reset form
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("E-posta gönderilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubject("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Kullanıcıya E-posta Gönder
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Ticket #{ticketId} - {ticketTitle} için {userName} ({userEmail}) kullanıcısına e-posta gönderin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-white">
              Alıcı
            </Label>
            <Input
              id="recipient"
              value={`${userName} (${userEmail})`}
              disabled
              className="bg-neutral-800 border-neutral-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Konu *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E-posta konusunu girin"
              className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Mesaj *
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E-posta mesajınızı girin"
              rows={6}
              className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-neutral-600 text-white hover:bg-neutral-800"
          >
            İptal
          </Button>
          <Button
            type="button"
            onClick={handleSendEmail}
            disabled={isLoading || !subject.trim() || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                E-posta Gönder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

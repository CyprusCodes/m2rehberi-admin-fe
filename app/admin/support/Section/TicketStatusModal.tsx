"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateSupportTicketStatus } from "@/services/support/tickets";
import { CheckCircle, Clock, Play, XCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface TicketStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: number | null;
  currentStatus: string;
  onStatusUpdated: () => void;
}

const statusOptions = [
  { value: 'open', label: 'Açık', icon: AlertCircle, color: 'bg-blue-600', description: 'Yeni oluşturulan ticket' },
  { value: 'pending', label: 'Beklemede', icon: Clock, color: 'bg-yellow-600', description: 'Cevap bekleniyor' },
  { value: 'in_progress', label: 'İşlemde', icon: Play, color: 'bg-orange-600', description: 'Aktif olarak işleniyor' },
  { value: 'resolved', label: 'Çözüldü', icon: CheckCircle, color: 'bg-green-600', description: 'Sorun çözüldü' },
  { value: 'closed', label: 'Kapalı', icon: XCircle, color: 'bg-gray-600', description: 'Ticket kapatıldı' }
];

export default function TicketStatusModal({ 
  open, 
  onOpenChange, 
  ticketId, 
  currentStatus,
  onStatusUpdated 
}: TicketStatusModalProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!ticketId || newStatus === currentStatus) return;

    try {
      setLoading(true);
      await updateSupportTicketStatus(ticketId, newStatus as "open" | "pending" | "in_progress" | "resolved" | "closed");
      toast.success(`Ticket durumu "${statusOptions.find(s => s.value === newStatus)?.label}" olarak güncellendi`);
      onStatusUpdated();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Durum güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusInfo = () => {
    return statusOptions.find(s => s.value === currentStatus);
  };

  const currentStatusInfo = getCurrentStatusInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            Ticket Durumu Güncelle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-sm text-white/70 mb-2">Mevcut Durum:</div>
            {currentStatusInfo && (
              <div className="flex items-center gap-2">
                <Badge className={`${currentStatusInfo.color} text-white border-0`}>
                  {currentStatusInfo.label}
                </Badge>
                <span className="text-white/60 text-sm">
                  {currentStatusInfo.description}
                </span>
              </div>
            )}
          </div>

          {/* Status Options */}
          <div className="space-y-2">
            <div className="text-sm text-white/70 mb-3">Yeni Durum Seçin:</div>
            {statusOptions.map((status) => {
              const Icon = status.icon;
              const isCurrent = status.value === currentStatus;
              const isDisabled = isCurrent || loading;

              return (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(status.value)}
                  disabled={isDisabled}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-white/10 border-white/20 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? status.color : 'bg-white/10'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        isCurrent ? 'text-white' : 'text-white/60'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${
                        isCurrent ? 'text-white' : 'text-white/80'
                      }`}>
                        {status.label}
                      </div>
                      <div className="text-xs text-white/60">
                        {status.description}
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge className="bg-green-600 text-white border-0 text-xs">
                        Mevcut
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Warning for closed status */}
          <div className="bg-yellow-600/20 border border-yellow-600/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-200">
                <strong>Uyarı:</strong> Ticket "Kapalı" olarak işaretlenirse, 
                kullanıcı artık bu ticket'a mesaj gönderemeyecektir.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

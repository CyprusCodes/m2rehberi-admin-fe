"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, CreditCard, Loader2 } from "lucide-react";

interface AssignNotificationCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streamerId: string;
  onSubmit: (data: {
    pushCount: number;
    isPaymentReceived: boolean;
    paymentNote: string;
  }) => Promise<void>;
}

export function AssignNotificationCreditsModal({
  open,
  onOpenChange,
  streamerId,
  onSubmit,
}: AssignNotificationCreditsModalProps) {
  const [pushCount, setPushCount] = useState<string>("");
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [paymentNote, setPaymentNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const count = parseInt(pushCount, 10);
    if (!count || count <= 0) {
      alert("Lütfen geçerli bir kredi miktarı girin");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        pushCount: count,
        isPaymentReceived,
        paymentNote,
      });
      // Reset form
      setPushCount("");
      setIsPaymentReceived(false);
      setPaymentNote("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPushCount("");
    setIsPaymentReceived(false);
    setPaymentNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-blue-500" />
            Bildirim Kredisi Ata
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Push Count */}
          <div className="grid gap-2">
            <Label
              htmlFor="pushCount"
              className="flex items-center gap-2 text-white/70"
            >
              <CreditCard className="h-4 w-4" />
              Kredi Miktarı
            </Label>
            <Input
              id="pushCount"
              type="number"
              min="1"
              placeholder="Örn: 5"
              value={pushCount}
              onChange={(e) => setPushCount(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">
              Yayıncıya atanacak bildirim gönderme hakkı sayısı
            </p>
          </div>

          {/* Payment Received */}
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 border border-white/5">
            <Checkbox
              id="isPaymentReceived"
              checked={isPaymentReceived}
              onCheckedChange={(checked) =>
                setIsPaymentReceived(checked as boolean)
              }
              className="border-white/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <Label
              htmlFor="isPaymentReceived"
              className="text-sm font-medium leading-none cursor-pointer text-white"
            >
              Ödeme alındı mı?
            </Label>
          </div>

          {/* Payment Note */}
          <div className="grid gap-2">
            <Label htmlFor="paymentNote" className="text-white/70">
              Ödeme Notu (Opsiyonel)
            </Label>
            <Textarea
              id="paymentNote"
              placeholder="Ödeme detayları veya notlar..."
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !pushCount}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atanıyor...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Kredi Ata
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

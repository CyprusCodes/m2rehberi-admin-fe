"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Sparkles, Crown, Loader2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: number;
  username: string;
}

interface Winner {
  id: number;
  username: string;
  position: number;
}

interface ConfirmSelectWinnersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Participant[];
  winnerCount: number;
  onConfirm: () => Promise<void>;
}

export function ConfirmSelectWinnersModal({
  open,
  onOpenChange,
  participants,
  winnerCount,
  onConfirm,
}: ConfirmSelectWinnersModalProps) {
  const [stage, setStage] = useState<"confirm" | "spinning" | "result">(
    "confirm"
  );
  const [spinningIndex, setSpinningIndex] = useState(0);
  const [selectedWinners, setSelectedWinners] = useState<Winner[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStage("confirm");
      setSelectedWinners([]);
      setSpinningIndex(0);
    }
  }, [open]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (participants.length === 0) return;

    setStage("spinning");
    setIsProcessing(true);

    // Start spinning animation
    let spinCount = 0;
    const maxSpins = 30 + Math.random() * 20; // Random number of spins

    spinIntervalRef.current = setInterval(() => {
      setSpinningIndex((prev) => (prev + 1) % participants.length);
      spinCount++;

      if (spinCount >= maxSpins) {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
        }

        // Simulate winner selection locally for animation
        const actualWinnersCount = Math.min(winnerCount, participants.length);
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, actualWinnersCount).map((p, idx) => ({
          id: p.id,
          username: p.username,
          position: idx + 1,
        }));

        setSelectedWinners(winners);
        setStage("result");

        // Call the actual API
        onConfirm().finally(() => {
          setIsProcessing(false);
        });
      }
    }, 80);
  };

  const handleClose = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    onOpenChange(false);
  };

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${position}.`;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={stage !== "spinning" ? onOpenChange : undefined}
    >
      <DialogContent className="max-w-lg">
        {stage === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-6 w-6 text-purple-500" />
                Kazananları Seç
              </DialogTitle>
              <DialogDescription className="text-base">
                Bu işlem çekilişi sonlandıracak ve{" "}
                <strong>{winnerCount}</strong> kazananı rastgele seçecektir.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Toplam Katılımcı:
                  </span>
                  <span className="font-semibold">
                    {participants.length} kişi
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Seçilecek Kazanan:
                  </span>
                  <span className="font-semibold text-green-600">
                    {Math.min(winnerCount, participants.length)} kişi
                  </span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Bu işlem geri alınamaz. Kazananlar rastgele seçilecektir.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                İptal
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={participants.length === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Evet, Kazananları Seç
              </Button>
            </DialogFooter>
          </>
        )}

        {stage === "spinning" && (
          <div className="py-10 text-center space-y-8">
            <div className="space-y-2">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold">Kazananlar Seçiliyor...</h3>
              <p className="text-muted-foreground">Lütfen bekleyin</p>
            </div>

            {/* Spinning Animation */}
            <div className="relative h-32 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
              <div
                className="flex flex-col items-center transition-transform duration-75"
                style={{
                  transform: `translateY(-${spinningIndex * 48}px)`,
                }}
              >
                {participants.concat(participants).map((participant, idx) => (
                  <div
                    key={`${participant.id}-${idx}`}
                    className={cn(
                      "h-12 flex items-center justify-center px-6 py-2 rounded-lg text-lg font-medium transition-all",
                      idx ===
                        spinningIndex + Math.floor(participants.length / 2)
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110"
                        : "bg-muted/30"
                    )}
                  >
                    {participant.username}
                  </div>
                ))}
              </div>
            </div>

            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500" />
          </div>
        )}

        {stage === "result" && (
          <div className="py-6 text-center space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <PartyPopper className="h-16 w-16 text-yellow-500 mx-auto animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-ping absolute h-16 w-16 rounded-full bg-yellow-400/30" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mt-4">🎉 Tebrikler! 🎉</h3>
              <p className="text-muted-foreground">
                Kazananlar başarıyla seçildi!
              </p>
            </div>

            {/* Winners List */}
            <div className="space-y-3 max-w-sm mx-auto">
              {selectedWinners.map((winner, idx) => (
                <div
                  key={winner.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 animate-fade-in",
                    idx === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500"
                      : idx === 1
                      ? "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400"
                      : idx === 2
                      ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600"
                      : "bg-muted/50 border-muted"
                  )}
                  style={{
                    animationDelay: `${idx * 300}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <span className="text-2xl">
                    {getPositionEmoji(winner.position)}
                  </span>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">{winner.username}</span>
                  </div>
                  {idx === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                </div>
              ))}
            </div>

            <DialogFooter className="justify-center pt-4">
              <Button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Tamam
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

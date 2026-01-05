"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchActiveUsers,
  addParticipantToLottery,
  ActiveUser,
} from "@/services/lottery";

interface AddParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotteryId: string;
  existingParticipantIds: number[];
  onParticipantAdded: () => void;
}

export function AddParticipantsModal({
  open,
  onOpenChange,
  lotteryId,
  existingParticipantIds,
  onParticipantAdded,
}: AddParticipantsModalProps) {
  const { toast } = useToast();
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingUserId, setAddingUserId] = useState<number | null>(null);
  const [addedUserIds, setAddedUserIds] = useState<number[]>([]);

  // Load users when modal opens
  useEffect(() => {
    if (open) {
      loadUsers();
      setAddedUserIds([]);
    }
  }, [open]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchActiveUsers({ page_size: 100 });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Hata",
        description: "Kullanıcılar yüklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (userId: number) => {
    setAddingUserId(userId);
    try {
      await addParticipantToLottery(lotteryId, userId);
      setAddedUserIds((prev) => [...prev, userId]);
      toast({
        title: "Başarılı",
        description: "Katılımcı eklendi",
      });
      onParticipantAdded();
    } catch (error: any) {
      console.error("Error adding participant:", error);
      toast({
        title: "Hata",
        description:
          error?.response?.data?.message || "Katılımcı eklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setAddingUserId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower) ||
      user.user_id.toString().includes(searchLower)
    );
  });

  const isAlreadyParticipant = (userId: number) => {
    return (
      existingParticipantIds.includes(userId) || addedUserIds.includes(userId)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Katılımcı Ekle
          </DialogTitle>
          <DialogDescription>
            Çekilişe manuel olarak katılımcı ekleyin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="İsim, email veya ID ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {searchTerm ? "Sonuç bulunamadı" : "Kullanıcı bulunamadı"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const isParticipant = isAlreadyParticipant(user.user_id);
                  const isAdding = addingUserId === user.user_id;

                  return (
                    <div
                      key={user.user_id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isParticipant ? "bg-muted/50" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {user.first_name?.charAt(0) || user.email.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {user.user_type || "User"}
                        </Badge>
                      </div>

                      {isParticipant ? (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="h-3 w-3" />
                          Katılımcı
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddParticipant(user.user_id)}
                          disabled={isAdding}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isAdding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Ekle
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{filteredUsers.length} kullanıcı gösteriliyor</span>
            {addedUserIds.length > 0 && (
              <span className="text-green-600">
                {addedUserIds.length} katılımcı eklendi
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

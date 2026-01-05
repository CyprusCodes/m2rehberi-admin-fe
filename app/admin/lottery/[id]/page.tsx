"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  User,
  Users,
  Crown,
  Loader2,
  Sparkles,
  UserPlus,
  Info,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  fetchAdminLotteryById,
  fetchLotteryParticipants,
  endLotteryWithRandomWinners,
} from "@/services/lottery";
import { useToast } from "@/hooks/use-toast";
import { AddParticipantsModal } from "./components/AddParticipantsModal";
import { ConfirmSelectWinnersModal } from "./components/ConfirmSelectWinnersModal";

interface LotteryDetail {
  id: number;
  title: string;
  description: string;
  createdBy: {
    id: number;
    username: string;
    role: string;
    avatar?: string;
  };
  createdAt: string;
  endDate: string;
  status: "active" | "completed" | "cancelled" | "ended";
  participantCount: number;
  maxParticipants?: number;
  winnerCount: number;
  hasWinners: boolean;
  participants: Participant[];
  winners: Winner[];
}

interface Participant {
  id: number;
  username: string;
  joinedAt: string;
  avatar?: string;
}

interface Winner {
  id: number;
  username: string;
  selectedAt: string;
  position: number;
  avatar?: string;
  email?: string;
  phone?: string;
}

export default function LotteryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lotteryId = params.id as string;
  const { toast } = useToast();

  const [lottery, setLottery] = useState<LotteryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [endingLottery, setEndingLottery] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchLotteryDetail = async () => {
      try {
        // Get lottery details and participants from admin API
        const [lotteryData, participantsData] = await Promise.all([
          fetchAdminLotteryById(lotteryId),
          fetchLotteryParticipants(lotteryId),
        ]);

        // Handle winners data - it can be an array or JSON string
        let winners: any[] = [];
        if (lotteryData.data.winners_data) {
          if (Array.isArray(lotteryData.data.winners_data)) {
            // Already an array from API
            winners = lotteryData.data.winners_data;
          } else if (typeof lotteryData.data.winners_data === "string") {
            // Parse JSON string if needed
            try {
              winners = JSON.parse(lotteryData.data.winners_data) || [];
            } catch (e) {
              console.warn("Could not parse winners data:", e);
            }
          }
        }

        setLottery({
          id: lotteryData.data.lottery_id,
          title: lotteryData.data.title,
          description: lotteryData.data.description,
          createdBy: {
            id: lotteryData.data.creator_user_id,
            username:
              `${lotteryData.data.creator_first_name || ""} ${
                lotteryData.data.creator_last_name || ""
              }`.trim() ||
              lotteryData.data.creator_email ||
              `User ${lotteryData.data.creator_user_id}`,
            role:
              lotteryData.data.creator_user_type_id === 4
                ? "streamer"
                : lotteryData.data.creator_user_type_id === 3
                ? "serverOwner"
                : "user",
          },
          createdAt: lotteryData.data.created_at,
          endDate: lotteryData.data.end_date,
          status: lotteryData.data.status,
          participantCount: lotteryData.data.participant_count,
          maxParticipants: lotteryData.data.max_participants,
          winnerCount: lotteryData.data.winner_count,
          hasWinners: lotteryData.data.winner_selected_count > 0,
          participants: participantsData.data.map((p: any) => ({
            id: p.participant_user_id,
            username:
              `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
              p.email ||
              `User ${p.participant_user_id}`,
            joinedAt: p.joined_at,
            avatar: p.avatar,
          })),
          winners: winners
            .map((w: any, index: number) => ({
              id: w.user_id,
              username:
                `${w.first_name || ""} ${w.last_name || ""}`.trim() ||
                w.email ||
                `User ${w.user_id}`,
              selectedAt: w.selected_at,
              position: w.winner_position || index + 1,
              email: w.email,
              phone: w.phone_number,
            }))
            .sort((a: any, b: any) => a.position - b.position),
        });
      } catch (error) {
        console.error("Error fetching lottery detail:", error);
        setLottery(null);
      } finally {
        setLoading(false);
      }
    };

    if (lotteryId) {
      fetchLotteryDetail();
    }
  }, [lotteryId, refreshKey]);

  const handleParticipantAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEndLottery = () => {
    if (!lottery || lottery.status !== "active") return;

    if (lottery.participantCount < 1) {
      toast({
        title: "Hata",
        description: "Çekilişe katılan kimse yok!",
        variant: "destructive",
      });
      return;
    }

    // Open the winner selection modal
    setShowWinnerModal(true);
  };

  const handleConfirmEndLottery = async () => {
    setEndingLottery(true);
    try {
      const result = await endLotteryWithRandomWinners(lotteryId);
      toast({
        title: "Başarılı",
        description:
          result.message || "Çekiliş sonlandırıldı ve kazananlar seçildi!",
      });
      // Refresh the page data after a short delay
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 1500);
    } catch (error: any) {
      console.error("End lottery error:", error);
      toast({
        title: "Hata",
        description:
          error?.response?.data?.message || "Çekiliş sonlandırılamadı!",
        variant: "destructive",
      });
    } finally {
      setEndingLottery(false);
    }
  };

  const getStatusBadge = (status: LotteryDetail["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Aktif
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Tamamlandı</Badge>;
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>;
      case "ended":
        return <Badge variant="secondary">Bitti</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "streamer":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Yayıncı
          </Badge>
        );
      case "serverOwner":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Server Sahibi
          </Badge>
        );
      default:
        return <Badge variant="outline">Kullanıcı</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!lottery) {
    return (
      <div className="space-y-6">
        <Link href="/admin/lottery">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold">Çekiliş bulunamadı</h3>
            <p className="text-muted-foreground">
              Bu çekiliş mevcut değil veya silinmiş olabilir.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/lottery">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          {lottery.status === "active" && (
            <Button
              onClick={handleEndLottery}
              disabled={endingLottery}
              className="bg-green-600 hover:bg-green-700"
            >
              {endingLottery ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                  <span className="text-white">Kazananlar Seçiliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2 text-white" />
                  <span className="text-white">Çekilişi Bitir & Kazanan Seç</span>
                </>
              )}
            </Button>
          )}
          {getStatusBadge(lottery.status)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Çekiliş Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{lottery.title}</h3>
              <p className="text-muted-foreground">{lottery.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Oluşturulma:{" "}
                  {format(new Date(lottery.createdAt), "dd.MM.yyyy HH:mm", {
                    locale: tr,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Bitiş:{" "}
                  {format(new Date(lottery.endDate), "dd.MM.yyyy HH:mm", {
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Oluşturan Kişi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {lottery.createdBy.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold">{lottery.createdBy.username}</h4>
                {getRoleBadge(lottery.createdBy.role)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Katılımcı İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Toplam Katılımcı:</span>
                <span className="font-semibold">
                  {lottery.participantCount}
                </span>
              </div>
              {lottery.maxParticipants && (
                <div className="flex justify-between">
                  <span>Maksimum Katılımcı:</span>
                  <span className="font-semibold">
                    {lottery.maxParticipants}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Kazanan Sayısı:</span>
                <span className="font-semibold">{lottery.winnerCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Kazananlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lottery.hasWinners && lottery.winners.length > 0 ? (
              <div className="space-y-3">
                {lottery.winners.map((winner) => {
                  const getPositionStyle = (pos: number) => {
                    switch (pos) {
                      case 1:
                        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500 border";
                      case 2:
                        return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400 border";
                      case 3:
                        return "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600 border";
                      default:
                        return "bg-muted/50";
                    }
                  };
                  const getPositionEmoji = (pos: number) => {
                    switch (pos) {
                      case 1:
                        return "🥇";
                      case 2:
                        return "🥈";
                      case 3:
                        return "🥉";
                      default:
                        return `${pos}.`;
                    }
                  };
                  return (
                    <div
                      key={winner.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${getPositionStyle(
                        winner.position
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {getPositionEmoji(winner.position)}
                        </span>
                        <span className="font-medium">{winner.username}</span>

                        {/* Contact Info Popover */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full hover:bg-primary/10"
                            >
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-0" align="start">
                            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-t-lg border-b">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {winner.username}
                                  </p>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getPositionEmoji(winner.position)}{" "}
                                    {winner.position}. Sıra
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    E-posta
                                  </p>
                                  <p className="text-sm font-medium truncate">
                                    {winner.email || "Belirtilmemiş"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    Telefon
                                  </p>
                                  <p className="text-sm font-medium">
                                    {winner.phone || "Belirtilmemiş"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(winner.selectedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {lottery.status === "active"
                  ? "Çekiliş henüz tamamlanmadı"
                  : "Kazanan seçilmedi"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Katılımcılar</CardTitle>
            <CardDescription>
              Çekilişe katılan tüm kullanıcılar ({lottery.participants.length}{" "}
              kişi)
            </CardDescription>
          </div>
          {lottery.status === "active" && (
            <Button
              onClick={() => setShowAddParticipantModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Katılımcı Ekle
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı Adı</TableHead>
                <TableHead>Katılım Tarihi</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lottery.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold">
                          {participant.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{participant.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(participant.joinedAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {lottery.winners.some((w) => w.id === participant.id) ? (
                      <Badge variant="default" className="bg-yellow-500">
                        Kazanan
                      </Badge>
                    ) : (
                      <Badge variant="outline">Katılımcı</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Participants Modal */}
      <AddParticipantsModal
        open={showAddParticipantModal}
        onOpenChange={setShowAddParticipantModal}
        lotteryId={lotteryId}
        existingParticipantIds={lottery.participants.map((p) => p.id)}
        onParticipantAdded={handleParticipantAdded}
      />

      {/* Winner Selection Modal */}
      <ConfirmSelectWinnersModal
        open={showWinnerModal}
        onOpenChange={setShowWinnerModal}
        participants={lottery.participants}
        winnerCount={lottery.winnerCount}
        onConfirm={handleConfirmEndLottery}
      />
    </div>
  );
}

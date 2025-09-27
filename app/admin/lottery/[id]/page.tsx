"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, Clock, Trophy, User, Users, Crown } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { tr } from "date-fns/locale"
import { fetchAdminLotteryById, fetchLotteryParticipants } from "@/services/lottery"

interface LotteryDetail {
  id: number
  title: string
  description: string
  createdBy: {
    id: number
    username: string
    role: string
    avatar?: string
  }
  createdAt: string
  endDate: string
  status: "active" | "completed" | "cancelled"
  participantCount: number
  maxParticipants?: number
  winnerCount: number
  hasWinners: boolean
  participants: Participant[]
  winners: Winner[]
}

interface Participant {
  id: number
  username: string
  joinedAt: string
  avatar?: string
}

interface Winner {
  id: number
  username: string
  selectedAt: string
  position: number
  avatar?: string
}

export default function LotteryDetailPage() {
  const params = useParams()
  const lotteryId = params.id as string
  
  const [lottery, setLottery] = useState<LotteryDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLotteryDetail = async () => {
      try {
        // Get lottery details and participants from admin API
        const [lotteryData, participantsData] = await Promise.all([
          fetchAdminLotteryById(lotteryId),
          fetchLotteryParticipants(lotteryId)
        ])
        
        // Parse winners data if available
        let winners = []
        if (lotteryData.data.winners_data) {
          try {
            winners = JSON.parse(lotteryData.data.winners_data) || []
          } catch (e) {
            console.warn("Could not parse winners data:", e)
          }
        }
        
        setLottery({
          id: lotteryData.data.lottery_id,
          title: lotteryData.data.title,
          description: lotteryData.data.description,
          createdBy: {
            id: lotteryData.data.creator_user_id,
            username: `${lotteryData.data.creator_first_name || ''} ${lotteryData.data.creator_last_name || ''}`.trim() || lotteryData.data.creator_email || `User ${lotteryData.data.creator_user_id}`,
            role: lotteryData.data.creator_user_type_id === 4 ? 'streamer' : lotteryData.data.creator_user_type_id === 3 ? 'serverOwner' : 'user'
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
            username: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email || `User ${p.participant_user_id}`,
            joinedAt: p.joined_at,
            avatar: p.avatar
          })),
          winners: winners.map((w: any, index: number) => ({
            id: w.user_id,
            username: `${w.first_name || ''} ${w.last_name || ''}`.trim() || w.email || `User ${w.user_id}`,
            selectedAt: w.selected_at,
            position: w.winner_position || index + 1
          }))
        })
      } catch (error) {
        console.error("Error fetching lottery detail:", error)
        setLottery(null)
      } finally {
        setLoading(false)
      }
    }

    if (lotteryId) {
      fetchLotteryDetail()
    }
  }, [lotteryId])

  const getStatusBadge = (status: LotteryDetail["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Aktif</Badge>
      case "completed":
        return <Badge variant="secondary">Tamamlandı</Badge>
      case "cancelled":
        return <Badge variant="destructive">İptal</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "streamer":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Yayıncı</Badge>
      case "serverOwner":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Server Sahibi</Badge>
      default:
        return <Badge variant="outline">Kullanıcı</Badge>
    }
  }

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
    )
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
            <p className="text-muted-foreground">Bu çekiliş mevcut değil veya silinmiş olabilir.</p>
          </CardContent>
        </Card>
      </div>
    )
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
        {getStatusBadge(lottery.status)}
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
                  Oluşturulma: {format(new Date(lottery.createdAt), "dd.MM.yyyy HH:mm", { locale: tr })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Bitiş: {format(new Date(lottery.endDate), "dd.MM.yyyy HH:mm", { locale: tr })}
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
                <span className="font-semibold">{lottery.participantCount}</span>
              </div>
              {lottery.maxParticipants && (
                <div className="flex justify-between">
                  <span>Maksimum Katılımcı:</span>
                  <span className="font-semibold">{lottery.maxParticipants}</span>
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
              <div className="space-y-2">
                {lottery.winners.map((winner) => (
                  <div key={winner.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{winner.position}.</Badge>
                      <span>{winner.username}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(winner.selectedAt), { addSuffix: true, locale: tr })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {lottery.status === "active" ? "Çekiliş henüz tamamlanmadı" : "Kazanan seçilmedi"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Katılımcılar</CardTitle>
          <CardDescription>
            Çekilişe katılan tüm kullanıcılar ({lottery.participants.length} kişi)
          </CardDescription>
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
                    {formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true, locale: tr })}
                  </TableCell>
                  <TableCell>
                    {lottery.winners.some(w => w.id === participant.id) ? (
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
    </div>
  )
}
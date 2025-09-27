"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Users, Calendar, Trophy } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { fetchAdminLotteries, transformLotteryData } from "@/services/lottery"

interface LotteryTableItem {
  id: number
  title: string
  description: string
  createdBy: {
    id: number
    username: string
    role: string
  }
  createdAt: string
  endDate: string
  status: "active" | "completed" | "cancelled" | "ended"
  participantCount: number
  maxParticipants?: number
  winnerCount: number
  hasWinners: boolean
}

export function LotteryTable() {
  const [lotteries, setLotteries] = useState<LotteryTableItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const data = await fetchAdminLotteries({ 
          pageSize: 50, 
          sortBy: 'general_lottery.created_at' 
        })
        
        // Transform data to match our interface
        const transformedLotteries = data.data.map(transformLotteryData)
        setLotteries(transformedLotteries)
      } catch (error) {
        console.error("Error fetching lotteries:", error)
        setLotteries([])
      } finally {
        setLoading(false)
      }
    }

    fetchLotteries()
  }, [])

  const getStatusBadge = (status: LotteryTableItem["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Aktif</Badge>
      case "completed":
      case "ended":
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
      <Card>
        <CardHeader>
          <CardTitle>Çekilişler</CardTitle>
          <CardDescription>Sistem çekilişlerinin listesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Çekilişler</CardTitle>
        <CardDescription>
          Toplam {lotteries.length} çekiliş bulundu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Çekiliş</TableHead>
              <TableHead>Oluşturan</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Katılımcılar</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Kazananlar</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lotteries.map((lottery) => (
              <TableRow key={lottery.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{lottery.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {lottery.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{lottery.createdBy.username}</div>
                    {getRoleBadge(lottery.createdBy.role)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(lottery.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{lottery.participantCount}</span>
                    {lottery.maxParticipants && (
                      <span className="text-muted-foreground">/ {lottery.maxParticipants}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(lottery.endDate), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>{lottery.winnerCount} kazanan</span>
                    {lottery.hasWinners && lottery.status === "completed" && (
                      <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700">
                        Seçildi
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/lottery/${lottery.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detay
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
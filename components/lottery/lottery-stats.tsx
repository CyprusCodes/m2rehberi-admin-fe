"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react"
import { fetchAdminLotteryStats, type LotteryStats } from "@/services/lottery"

export function LotteryStats() {
  const [stats, setStats] = useState<LotteryStats>({
    totalLotteries: 0,
    activeLotteries: 0,
    totalParticipants: 0,
    completedLotteries: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await fetchAdminLotteryStats()
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching lottery stats:", error)
        setStats({
          totalLotteries: 0,
          activeLotteries: 0,
          totalParticipants: 0,
          completedLotteries: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Toplam Çekiliş",
      value: stats.totalLotteries,
      icon: Trophy,
      description: "Oluşturulan toplam çekiliş sayısı"
    },
    {
      title: "Aktif Çekilişler",
      value: stats.activeLotteries,
      icon: Calendar,
      description: "Şu anda devam eden çekilişler"
    },
    {
      title: "Toplam Katılımcı",
      value: stats.totalParticipants,
      icon: Users,
      description: "Tüm çekilişlere katılan kullanıcı sayısı"
    },
    {
      title: "Tamamlanan Çekilişler",
      value: stats.completedLotteries,
      icon: TrendingUp,
      description: "Başarıyla tamamlanan çekilişler"
    }
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
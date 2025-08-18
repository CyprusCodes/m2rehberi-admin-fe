"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Mail } from "lucide-react"
import { fetchUserStats, type UserStats } from "@/services/users"

export function UsersStats() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { stats: userStats } = await fetchUserStats()
        setStats(userStats)
      } catch (error) {
        console.error("Error loading user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yükleniyor...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div>Veri yüklenemedi</div>
  }

  // Calculate percentage changes
  const totalChange = stats.usersLast30Days > 0 && stats.usersPrevious30Days > 0 
    ? Math.round(((stats.usersLast30Days - stats.usersPrevious30Days) / stats.usersPrevious30Days) * 100)
    : 0

  const statsData = [
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers.toLocaleString(),
      change: totalChange > 0 ? `+${totalChange}%` : totalChange < 0 ? `${totalChange}%` : "0%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Onaylı Kullanıcılar",
      value: stats.verifiedUsers.toLocaleString(),
      change: `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%`,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      title: "Bekleyen Onaylar",
      value: stats.pendingUsers.toLocaleString(),
      change: `${Math.round((stats.pendingUsers / stats.totalUsers) * 100)}%`,
      icon: Mail,
      color: "text-orange-500",
    },
    {
      title: "Engellenmiş",
      value: stats.bannedUsers.toLocaleString(),
      change: `${Math.round((stats.bannedUsers / stats.totalUsers) * 100)}%`,
      icon: UserX,
      color: "text-red-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : stat.change.startsWith("-")
                      ? "text-red-500"
                      : "text-yellow-500"
                }
              >
                {stat.change}
              </span>{" "}
              {stat.title === "Toplam Kullanıcı" ? "geçen aydan" : "toplam oran"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
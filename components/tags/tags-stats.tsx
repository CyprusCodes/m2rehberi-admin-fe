"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tags, Hash, TrendingUp, Users, Loader2, AlertCircle } from "lucide-react"
import { fetchTagStats, type TagStats } from "@/services/tags"
import toast from "react-hot-toast"

export function TagsStats() {
  const [stats, setStats] = useState<TagStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchTagStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Tag statistics yükleme hatası:', error)
      setError('Tag istatistikleri yüklenemedi')
      toast.error('Tag istatistikleri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Calculate percentage change for tags
  const getTagsChange = () => {
    if (!stats) return "Hesaplanıyor..."
    const current = stats.tagsLast30Days
    const previous = stats.tagsPrevious30Days
    if (previous === 0) return current > 0 ? `+${current} this month` : "No change"
    const change = current - previous
    const percentage = Math.round((change / previous) * 100)
    return change >= 0 ? `+${change} (${percentage}%)` : `${change} (${percentage}%)`
  }

  const statsConfig = [
    {
      title: "Total Tags",
      value: stats?.totalTags?.toString() || "0",
      change: getTagsChange(),
      icon: Tags,
      color: "from-black/50 to-black/50",
    },
    {
      title: "Parent Categories",
      value: stats?.parentCategories?.toString() || "0",
      change: `${stats?.subCategories || 0} subcategories`,
      icon: Hash,
      color: "from-black/50 to-black/50",
    },
    {
      title: "Most Popular",
      value: stats?.mostPopularTag || "Henüz yok",
      change: `${stats?.mostPopularCount || 0} topics`,
      icon: TrendingUp,
      color: "from-black/50 to-black/50",
    },
    {
      title: "Tag Usage",
      value: `${stats?.usagePercentage || 0}%`,
      change: `${stats?.activeTags || 0}/${stats?.totalTags || 0} active`,
      icon: Users,
      color: "from-black/50 to-black/50",
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-6 w-6 animate-spin text-white/70" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card key={stat.title} className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <p className="text-xs text-white/60">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Clock, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { streamerPostReportService, StreamerPostReportStats } from "@/services/streamer-post-reports"

export function ReportedPostsStats() {
  const [stats, setStats] = useState<StreamerPostReportStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await streamerPostReportService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      title: "Toplam Rapor",
      value: stats.total.toString(),
      icon: Flag,
      color: "text-blue-500",
    },
    {
      title: "Bekleyen Raporlar",
      value: stats.pending.toString(),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "İncelenen Raporlar",
      value: stats.reviewed.toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Reddedilen Raporlar",
      value: stats.rejected.toString(),
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              Gerçek zamanlı veri
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

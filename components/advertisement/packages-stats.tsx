import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Calendar, Eye } from "lucide-react"

export function PackagesStats() {
  const stats = [
    {
      title: "Toplam Paket",
      value: "4",
      description: "Aktif reklam paketi",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Haftalık Gelir",
      value: "₺2,450",
      description: "Bu hafta kazanç",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Aktif Döngü",
      value: "3 gün",
      description: "Mevcut döngüde kalan",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Toplam Görüntülenme",
      value: "45.2K",
      description: "Bu hafta görüntülenme",
      icon: Eye,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

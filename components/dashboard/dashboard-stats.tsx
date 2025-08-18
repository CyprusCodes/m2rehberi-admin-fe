import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, MessageSquare, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Toplam Kullanıcı",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Aktif Sunucular",
    value: "8",
    change: "+2",
    icon: Server,
    color: "text-green-500",
  },
  {
    title: "Forum Mesajları",
    value: "1,234",
    change: "+23%",
    icon: MessageSquare,
    color: "text-purple-500",
  },
  {
    title: "Aylık Gelir",
    value: "₺12,450",
    change: "+8%",
    icon: TrendingUp,
    color: "text-orange-500",
  },
]

export function DashboardStats() {
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
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stat.change}</span> geçen aydan
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

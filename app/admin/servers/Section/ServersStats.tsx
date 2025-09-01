import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Users, Activity, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Toplam Sunucu",
    value: "8",
    change: "+1",
    icon: Server,
    color: "text-blue-500",
  },
  {
    title: "Aktif Oyuncular",
    value: "1,247",
    change: "+156",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "Ortalama Uptime",
    value: "99.2%",
    change: "+0.3%",
    icon: Activity,
    color: "text-purple-500",
  },
  {
    title: "Bakımda",
    value: "1",
    change: "0",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
]

export function ServersStats() {
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
              <span
                className={
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : stat.change.startsWith("-")
                      ? "text-red-500"
                      : "text-muted-foreground"
                }
              >
                {stat.change}
              </span>{" "}
              geçen hafta
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

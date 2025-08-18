import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Eye, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    title: "Toplam Reklam",
    value: "24",
    change: "+3",
    icon: Megaphone,
    color: "text-blue-500",
  },
  {
    title: "Aktif Reklamlar",
    value: "18",
    change: "+2",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "Bekleyen Onaylar",
    value: "4",
    change: "+1",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "Toplam Görüntülenme",
    value: "45.2K",
    change: "+12%",
    icon: Eye,
    color: "text-purple-500",
  },
]

export function AdvertisementStats() {
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

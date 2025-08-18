import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, FileText, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Toplam Kategori",
    value: "12",
    change: "+2",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    title: "Toplam Mesaj",
    value: "3,247",
    change: "+156",
    icon: MessageSquare,
    color: "text-green-500",
  },
  {
    title: "Aktif Kullanıcılar",
    value: "892",
    change: "+23",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Günlük Mesaj",
    value: "127",
    change: "+12%",
    icon: TrendingUp,
    color: "text-orange-500",
  },
]

export function ForumsStats() {
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

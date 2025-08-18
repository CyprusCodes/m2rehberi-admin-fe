import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "Ahmet Yılmaz",
    action: "yeni hesap oluşturdu",
    time: "2 dakika önce",
    avatar: "/user-avatar-1.png",
  },
  {
    user: "Mehmet Kaya",
    action: "Emek Server'a katıldı",
    time: "5 dakika önce",
    avatar: "/diverse-user-avatar-set-2.png",
  },
  {
    user: "Ayşe Demir",
    action: "forum mesajı gönderdi",
    time: "10 dakika önce",
    avatar: "/diverse-user-avatars-3.png",
  },
  {
    user: "Ali Özkan",
    action: "reklam başvurusu yaptı",
    time: "15 dakika önce",
    avatar: "/user-avatar-4.png",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
              <AvatarFallback>
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

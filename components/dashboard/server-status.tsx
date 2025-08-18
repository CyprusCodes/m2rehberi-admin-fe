import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const servers = [
  {
    name: "Emek Server",
    status: "online",
    players: 34,
    maxPlayers: 64,
    uptime: "99.9%",
  },
  {
    name: "Kaplan Server",
    status: "online",
    players: 28,
    maxPlayers: 50,
    uptime: "98.5%",
  },
  {
    name: "Ejder Server",
    status: "maintenance",
    players: 0,
    maxPlayers: 100,
    uptime: "95.2%",
  },
]

export function ServerStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sunucu Durumu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {servers.map((server) => (
          <div key={server.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{server.name}</span>
                <Badge
                  variant={server.status === "online" ? "default" : "secondary"}
                  className={
                    server.status === "online" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                  }
                >
                  {server.status === "online" ? "Çevrimiçi" : "Bakım"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {server.players}/{server.maxPlayers}
              </span>
            </div>
            <Progress value={(server.players / server.maxPlayers) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">Uptime: {server.uptime}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

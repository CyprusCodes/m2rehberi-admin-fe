"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Settings, Play, Pause, Wrench } from "lucide-react"

// Mock data - replace with real data
const servers = [
  {
    id: "1",
    name: "Emek Server",
    status: "online",
    players: 34,
    maxPlayers: 64,
    uptime: "99.9%",
    location: "İstanbul",
    version: "1.2.3",
    banner: "/server-banner-1.png",
    rules: ["PvP yasak değil", "Küfür yasak", "Reklam yasak"],
    description: "Yeni başlayanlar için ideal sunucu",
  },
  {
    id: "2",
    name: "Kaplan Server",
    status: "online",
    players: 28,
    maxPlayers: 50,
    uptime: "98.5%",
    location: "Ankara",
    version: "1.2.3",
    banner: "/server-banner-2.png",
    rules: ["Hardcore PvP", "Drop rate x2", "Exp rate x3"],
    description: "Deneyimli oyuncular için zorlu sunucu",
  },
  {
    id: "3",
    name: "Ejder Server",
    status: "maintenance",
    players: 0,
    maxPlayers: 100,
    uptime: "95.2%",
    location: "İzmir",
    version: "1.2.4",
    banner: "/server-banner-3.png",
    rules: ["Balanced gameplay", "Fair play", "No cheating"],
    description: "Dengeli oyun deneyimi sunan sunucu",
  },
  {
    id: "4",
    name: "Aslan Server",
    status: "online",
    players: 45,
    maxPlayers: 80,
    uptime: "97.8%",
    location: "Bursa",
    version: "1.2.3",
    banner: "/server-banner-4.png",
    rules: ["PvP zones", "Guild wars", "Events daily"],
    description: "Guild savaşları ve etkinlikler",
  },
]

export function ServersGrid() {
  const [selectedServer, setSelectedServer] = useState<(typeof servers)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500 hover:bg-green-600">Çevrimiçi</Badge>
      case "offline":
        return <Badge variant="destructive">Çevrimdışı</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Bakım</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const getCapacityColor = (players: number, maxPlayers: number) => {
    const percentage = (players / maxPlayers) * 100
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleViewDetails = (server: (typeof servers)[0]) => {
    router.push(`/dashboard/servers/${server.id}`)
  }

  const handleServerAction = (serverId: string, action: string) => {
    console.log(`Server ${serverId} action: ${action}`)
    // Implement server actions
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <Card key={server.id} className="overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <img
                src={server.banner || "/placeholder.svg?height=128&width=400&query=server banner"}
                alt={`${server.name} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">{getStatusBadge(server.status)}</div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{server.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(server)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleServerAction(server.id, "settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {server.status === "online" ? (
                      <>
                        <DropdownMenuItem onClick={() => handleServerAction(server.id, "pause")}>
                          <Pause className="mr-2 h-4 w-4" />
                          Durdur
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServerAction(server.id, "maintenance")}>
                          <Wrench className="mr-2 h-4 w-4" />
                          Bakıma Al
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => handleServerAction(server.id, "start")}>
                        <Play className="mr-2 h-4 w-4" />
                        Başlat
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground">{server.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Oyuncu Kapasitesi</span>
                  <span>
                    {server.players}/{server.maxPlayers}
                  </span>
                </div>
                <Progress value={(server.players / server.maxPlayers) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Konum</p>
                  <p className="font-medium">{server.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">{server.uptime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Versiyon</p>
                  <p className="font-medium">{server.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kurallar</p>
                  <p className="font-medium">{server.rules.length} kural</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

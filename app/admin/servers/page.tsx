import { ServersStats, ServersTable, AddServerDialog } from "./Section"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ServersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sunucu Yönetimi</h1>
          <p className="text-muted-foreground">OynaGG sunucularını yönetin ve izleyin</p>
        </div>
        <AddServerDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sunucu
          </Button>
        </AddServerDialog>
      </div>

      <ServersStats />
      <ServersTable />
    </div>
  )
}

import { ReportedPostsStats, ReportedPostsTable } from "./Section"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function ReportedPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raporlanan Postlar</h1>
          <p className="text-muted-foreground">Yayıncı postlarının raporlarını yönetin ve inceleyin</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      <ReportedPostsStats />
      <ReportedPostsTable />
    </div>
  )
}
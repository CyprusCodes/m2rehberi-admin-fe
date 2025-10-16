import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ServerStatus } from "@/components/dashboard/server-status"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">OynaGG yönetim paneline hoş geldiniz</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <ServerStatus />
        <RecentActivity />
      </div>
    </div>
  )
}

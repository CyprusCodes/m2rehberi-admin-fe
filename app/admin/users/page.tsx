import { UsersTable } from "@/components/users/users-table"
import { UsersStats } from "@/components/users/users-stats"
import { UsersFilters } from "@/components/users/users-filters"
import { Toaster } from 'react-hot-toast'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Sistem kullanıcılarını yönetin ve onaylayın</p>
      </div>

      <UsersStats />
      <UsersFilters />
      <UsersTable />
    </div>
  )
}

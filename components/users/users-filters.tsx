"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download } from "lucide-react"

export function UsersFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [emailFilter, setEmailFilter] = useState("all")

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="blocked">Engellenmiş</SelectItem>
          </SelectContent>
        </Select>

        <Select value={emailFilter} onValueChange={setEmailFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Email durumu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Emailler</SelectItem>
            <SelectItem value="verified">Onaylanmış</SelectItem>
            <SelectItem value="unverified">Onaylanmamış</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Dışa Aktar
        </Button>
      </div>
    </div>
  )
}

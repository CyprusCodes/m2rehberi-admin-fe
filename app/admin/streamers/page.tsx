"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StreamersTable } from './Section/StreamersTable'
import { CreateNewStreamer } from './Section/CreateNewStreamer'

export default function StreamersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yayıncılar</h1>
          <p className="text-muted-foreground">
            Yayıncıları görüntüleyin ve yönetin
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yayıncı Yarat
        </Button>
      </div>
      
      <StreamersTable />
      
      <CreateNewStreamer 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false)
          // Trigger refresh of the table
          window.dispatchEvent(new Event("streamers:refresh"))
        }}
      />
    </div>
  )
}
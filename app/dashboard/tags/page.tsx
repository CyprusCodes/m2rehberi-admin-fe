"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TagsStats } from "@/components/tags/tags-stats"
import { TagsTable } from "@/components/tags/tags-table"
import { AddTagDialog } from "@/components/tags/add-tag-dialog"
import { Plus, Search } from "lucide-react"

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tags Management</h1>
          <p className="text-white/70 mt-2">Manage forum categories and content tags</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gray-500 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      <TagsStats />

      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">All Tags</CardTitle>
          <CardDescription className="text-white/70">
            Manage forum categories and content classification tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          <TagsTable searchTerm={searchTerm} key={refreshKey} />
        </CardContent>
      </Card>

      <AddTagDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={handleRefresh}
      />
    </div>
  )
}

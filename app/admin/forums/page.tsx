"use client"

import { useState } from "react"
import { ForumsStats } from "@/components/forums/forums-stats"
import { ForumsTable } from "@/components/forums/forums-table"
import { AddForumDialog } from "@/components/forums/add-forum-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

export default function ForumsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Forum Management</h1>
          <p className="text-white/70 mt-2">Manage forum categories and discussions</p>
        </div>
        <AddForumDialog>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </AddForumDialog>
      </div>

      <ForumsStats />

      <div className="flex items-center gap-4 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="pvp">PVP</SelectItem>
            <SelectItem value="market">MarketGG</SelectItem>
            <SelectItem value="guild">Guild Wars</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="guides">Guides</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ForumsTable searchTerm={searchTerm} selectedTag={selectedTag} />
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, MessageSquare } from "lucide-react"

// Mock data with tags
const forums = [
  {
    id: "1",
    name: "PVP Strategies",
    description: "Player vs Player discussions and strategies",
    topics: 45,
    posts: 234,
    lastPost: "2024-01-20 14:30",
    lastUser: "DragonSlayer99",
    status: "active",
    tags: ["pvp", "strategy"],
  },
  {
    id: "2",
    name: "MarketGG Trading",
    description: "Trading and marketplace discussions",
    topics: 32,
    posts: 189,
    lastPost: "2024-01-20 12:15",
    lastUser: "TraderKing",
    status: "active",
    tags: ["market", "trading"],
  },
  {
    id: "3",
    name: "Guild Wars",
    description: "Guild battles and warfare discussions",
    topics: 23,
    posts: 156,
    lastPost: "2024-01-20 10:45",
    lastUser: "GuildMaster",
    status: "active",
    tags: ["guild", "pvp"],
  },
  {
    id: "4",
    name: "Server Events",
    description: "Server events and competitions",
    topics: 18,
    posts: 97,
    lastPost: "2024-01-19 16:20",
    lastUser: "EventHost",
    status: "active",
    tags: ["events"],
  },
  {
    id: "5",
    name: "Game Guides",
    description: "Tutorials and game guides",
    topics: 28,
    posts: 145,
    lastPost: "2024-01-19 14:10",
    lastUser: "GuideWriter",
    status: "active",
    tags: ["guides"],
  },
]

interface ForumsTableProps {
  searchTerm?: string
  selectedTag?: string
}

export function ForumsTable({ searchTerm = "", selectedTag = "all" }: ForumsTableProps) {
  const router = useRouter()

  const filteredForums = forums.filter((forum) => {
    const matchesSearch =
      forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "all" || forum.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Inactive</Badge>
      case "archived":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Archived</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Unknown</Badge>
    }
  }

  const handleViewForum = (forumId: string) => {
    router.push(`/dashboard/forums/${forumId}`)
  }

  const handleAction = (forumId: string, action: string) => {
    console.log(`Forum ${forumId} action: ${action}`)
    if (action === "view") {
      handleViewForum(forumId)
    }
    // Implement other forum actions
  }

  return (
    <div className="rounded-md border border-white/20 bg-white/5 backdrop-blur-md">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20 hover:bg-white/5">
            <TableHead className="text-white/90">Category</TableHead>
            <TableHead className="text-white/90">Topics</TableHead>
            <TableHead className="text-white/90">Posts</TableHead>
            <TableHead className="text-white/90">Last Post</TableHead>
            <TableHead className="text-white/90">Status</TableHead>
            <TableHead className="text-white/90 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredForums.map((forum) => (
            <TableRow key={forum.id} className="border-white/20 hover:bg-white/5">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-white">{forum.name}</div>
                  <div className="text-sm text-white/60">{forum.description}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {forum.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/20 text-white/70 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-white/50" />
                  <span className="font-medium text-white">{forum.topics}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium text-white">{forum.posts}</span>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm text-white/80">{forum.lastPost}</div>
                  <div className="text-xs text-white/50">by {forum.lastUser}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(forum.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-md border-white/20">
                    <DropdownMenuLabel className="text-white/90">Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleAction(forum.id, "view")}
                      className="text-white/90 hover:bg-white/10"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Topics
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction(forum.id, "edit")}
                      className="text-white/90 hover:bg-white/10"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={() => handleAction(forum.id, "delete")}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

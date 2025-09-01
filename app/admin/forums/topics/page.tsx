"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageSquare, Eye, Clock, Search, Pin } from "lucide-react"

// Mock topics data for a specific category
const mockTopics = [
  {
    id: "1",
    title: "Best PVP Strategies for Warriors",
    author: {
      name: "DragonSlayer99",
      avatar: "/user-avatar-1.png",
    },
    replies: 45,
    views: 1234,
    lastReply: "2024-01-20 14:30",
    isPinned: true,
    isLocked: false,
    tags: ["PVP", "Warrior", "Strategy"],
  },
  {
    id: "2",
    title: "Ninja vs Warrior: Who Wins?",
    author: {
      name: "ShadowNinja",
      avatar: "/user-avatar-2.png",
    },
    replies: 23,
    views: 567,
    lastReply: "2024-01-20 12:15",
    isPinned: false,
    isLocked: false,
    tags: ["PVP", "Ninja", "Warrior"],
  },
  {
    id: "3",
    title: "PVP Tournament Rules and Regulations",
    author: {
      name: "AdminUser",
      avatar: "/admin-avatar.png",
    },
    replies: 12,
    views: 890,
    lastReply: "2024-01-19 16:20",
    isPinned: true,
    isLocked: true,
    tags: ["PVP", "Tournament", "Rules"],
  },
]

export default function ForumTopicsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const categoryId = searchParams.get("category") || "1"
  const categoryName = searchParams.get("name") || "PVP Strategies"

  const filteredTopics = mockTopics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTopicClick = (topicId: string) => {
    router.push(`/dashboard/forums/${topicId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/forums")}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forums
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{categoryName}</h1>
            <p className="text-white/70 mt-1">All topics in this category</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Topics List */}
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Topics ({filteredTopics.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.isPinned && <Pin className="h-4 w-4 text-yellow-400" />}
                    <h3 className="font-semibold text-white hover:text-purple-300 transition-colors">{topic.title}</h3>
                    {topic.isLocked && <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Locked</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={topic.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{topic.author.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{topic.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {topic.replies} replies
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {topic.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {topic.lastReply}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {topic.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

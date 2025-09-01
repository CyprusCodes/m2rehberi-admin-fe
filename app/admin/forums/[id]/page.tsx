"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Eye, Clock, Lock, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Mock data for forum topic
const mockTopic = {
  id: "1",
  title: "Best PVP Strategies for Warriors",
  content:
    "I've been playing warrior for 2 years and wanted to share some advanced PVP strategies that have helped me dominate in battles. Here are my top tips...",
  author: {
    id: "user1",
    name: "DragonSlayer99",
    avatar: "/user-avatar-1.png",
    role: "Veteran Player",
    joinDate: "2022-03-15",
  },
  category: "PVP",
  tags: ["PVP", "Warrior", "Strategy"],
  createdAt: "2024-01-15T10:30:00Z",
  views: 1234,
  replies: 45,
  isLocked: false,
  isPinned: false,
}

const mockReplies = [
  {
    id: "1",
    content: "Great guide! I've been struggling with PVP as a warrior. The combo you mentioned really works!",
    author: {
      id: "user2",
      name: "SwordMaster",
      avatar: "/user-avatar-2.png",
      role: "Player",
    },
    createdAt: "2024-01-15T11:15:00Z",
  },
  {
    id: "2",
    content: "Thanks for sharing! Do you have any tips for fighting against ninjas? They're so fast!",
    author: {
      id: "user3",
      name: "WarriorKing",
      avatar: "/user-avatar-3.png",
      role: "Advanced Player",
    },
    createdAt: "2024-01-15T12:00:00Z",
  },
]

export default function ForumTopicPage() {
  const params = useParams()
  const router = useRouter()
  const [newReply, setNewReply] = useState("")
  const [topic] = useState(mockTopic)
  const [replies] = useState(mockReplies)

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle reply submission
    console.log("New reply:", newReply)
    setNewReply("")
  }

  const handleDeleteTopic = () => {
    // Handle topic deletion
    console.log("Deleting topic:", topic.id)
    router.push("/dashboard/forums")
  }

  const handleLockTopic = () => {
    // Handle topic lock/unlock
    console.log("Toggling lock for topic:", topic.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forums
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleLockTopic}
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Lock className="h-4 w-4 mr-2" />
            {topic.isLocked ? "Unlock" : "Lock"} Topic
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTopic}
            className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Topic
          </Button>
        </div>
      </div>

      {/* Topic Header */}
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {topic.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {topic.replies} replies
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(topic.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{topic.category}</Badge>
              {topic.isPinned && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pinned</Badge>
              )}
              {topic.isLocked && <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Locked</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={topic.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{topic.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white">{topic.author.name}</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {topic.author.role}
                </Badge>
                <span className="text-sm text-white/50">
                  Joined {new Date(topic.author.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="text-white/90 whitespace-pre-wrap">{topic.content}</div>
              <div className="flex items-center gap-2 mt-4">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Replies ({replies.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {replies.map((reply, index) => (
            <div key={reply.id}>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{reply.author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{reply.author.name}</span>
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                        {reply.author.role}
                      </Badge>
                      <span className="text-sm text-white/50">{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-white/90">{reply.content}</div>
                </div>
              </div>
              {index < replies.length - 1 && <Separator className="bg-white/10 mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Reply */}
      {!topic.isLocked && (
        <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Add Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Write your reply..."
                className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Post Reply
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

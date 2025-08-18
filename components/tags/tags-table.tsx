"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash2, Eye, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchTags, type Tag as ApiTag } from "@/services/tags"
import toast from "react-hot-toast"

interface Tag {
  id: string
  name: string
  description: string
  color: string
  topicsCount: number
  isActive: boolean
  createdAt: string
  parentId?: string // Added parent relationship
  children?: Tag[] // Added children array
}



interface TagsTableProps {
  searchTerm: string
  onRefresh?: () => void
}

export function TagsTable({ searchTerm, onRefresh }: TagsTableProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())

  // API'den veri çekme fonksiyonu
  const loadTags = async () => {
    try {
      setLoading(true)
      const response = await fetchTags()
      
      // API tag'lerini component tag formatına dönüştür
      const hierarchicalTags = buildHierarchy(response.data)
      setTags(hierarchicalTags)
    } catch (error) {
      console.error('Tags yükleme hatası:', error)
      toast.error('Tag\'ler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  // Parent-child yapısını oluştur
  const buildHierarchy = (apiTags: ApiTag[]): Tag[] => {
    const tagMap = new Map<number, Tag>()
    const parentTags: Tag[] = []

    // Önce tüm tag'leri map'e ekle
    apiTags.forEach(apiTag => {
      const tag: Tag = {
        id: apiTag.tagId.toString(),
        name: apiTag.name,
        description: apiTag.description || '',
        color: apiTag.color,
        topicsCount: apiTag.topicsCount,
        isActive: apiTag.isActive,
        createdAt: apiTag.createdAt,
        parentId: apiTag.parentId?.toString(),
        children: []
      }
      tagMap.set(apiTag.tagId, tag)
    })

    // Parent-child ilişkilerini oluştur
    tagMap.forEach(tag => {
      if (tag.parentId) {
        const parent = tagMap.get(Number(tag.parentId))
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(tag)
        }
      } else {
        parentTags.push(tag)
      }
    })

    return parentTags
  }

  useEffect(() => {
    loadTags()
  }, [])

  // onRefresh prop'u değiştiğinde verileri yenile
  useEffect(() => {
    if (onRefresh) {
      loadTags()
    }
  }, [onRefresh])

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getColorClass = (color: string) => {
    const colors = {
      red: "bg-red-500/20 text-red-300 border-red-500/30",
      green: "bg-green-500/20 text-green-300 border-green-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const toggleExpanded = (tagId: string) => {
    const newExpanded = new Set(expandedTags)
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId)
    } else {
      newExpanded.add(tagId)
    }
    setExpandedTags(newExpanded)
  }

  const renderTagRow = (tag: Tag, level = 0): React.ReactNode => {
    const hasChildren = tag.children && tag.children.length > 0
    const isExpanded = expandedTags.has(tag.id)

    return (
      <React.Fragment key={`tag-fragment-${tag.id}-${level}`}>
        <TableRow key={`tag-row-${tag.id}`} className="border-white/20 hover:bg-white/5">
          <TableCell>
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => toggleExpanded(tag.id)}
                >
                  <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </Button>
              )}
              {!hasChildren && level > 0 && <div className="w-6" />}
              <Badge className={getColorClass(tag.color)}>{tag.name}</Badge>
              {level > 0 && <span className="text-xs text-white/50">(subcategory)</span>}
            </div>
          </TableCell>
          <TableCell className="text-white/80">{tag.description}</TableCell>
          <TableCell className="text-white/80">{tag.topicsCount.toLocaleString()}</TableCell>
          <TableCell>
            <Badge
              variant={tag.isActive ? "default" : "secondary"}
              className={tag.isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}
            >
              {tag.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell className="text-white/80">{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-md border-white/20">
                <DropdownMenuItem className="text-white/90 hover:bg-white/10">
                  <Eye className="mr-2 h-4 w-4" />
                  View Topics
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white/90 hover:bg-white/10">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Tag
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Tag
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && tag.children!.map((child, index) => renderTagRow(child, level + 1))}
      </React.Fragment>
    )
  }

  if (loading) {
    return (
      <div className="rounded-md border border-white/20 bg-white/5 p-8">
        <div className="text-center text-white/70">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70 mx-auto mb-4"></div>
          Tag'ler yükleniyor...
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="rounded-md border border-white/20 bg-white/5 p-8">
        <div className="text-center text-white/70">
          <div className="text-4xl mb-4">🏷️</div>
          <h3 className="text-lg font-medium text-white mb-2">Henüz tag bulunmuyor</h3>
          <p className="text-sm">İlk tag'i oluşturmak için "Add Tag" butonunu kullanın.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-white/20 bg-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20 hover:bg-white/5">
            <TableHead className="text-white/90">Tag Name</TableHead>
            <TableHead className="text-white/90">Description</TableHead>
            <TableHead className="text-white/90">Topics</TableHead>
            <TableHead className="text-white/90">Status</TableHead>
            <TableHead className="text-white/90">Created</TableHead>
            <TableHead className="text-white/90 w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => renderTagRow(tag))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-white/70 py-8">
                Arama kriterlerinize uygun tag bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

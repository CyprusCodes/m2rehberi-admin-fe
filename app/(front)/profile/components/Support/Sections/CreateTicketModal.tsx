"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Clock, Zap, CheckCircle } from "lucide-react"

interface Category {
  category_id: number
  name: string
}

interface CreateTicketForm {
  categoryId: number
  title: string
  description: string
  priority: "low" | "normal" | "high" | "urgent"
}

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  form: CreateTicketForm
  onFormChange: (form: CreateTicketForm) => void
  onSubmit: () => void
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "low":
      return <CheckCircle className="w-4 h-4" />
    case "normal":
      return <Clock className="w-4 h-4" />
    case "high":
      return <AlertTriangle className="w-4 h-4" />
    case "urgent":
      return <Zap className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-500/20 text-green-300 border-green-500/30"
    case "normal":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    case "high":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "urgent":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  categories,
  form,
  onFormChange,
  onSubmit,
}: CreateTicketModalProps) {
  const handleCategoryChange = (categoryId: string) => {
    onFormChange({ ...form, categoryId: Number(categoryId) })
  }

  const handleTitleChange = (title: string) => {
    onFormChange({ ...form, title })
  }

  const handleDescriptionChange = (description: string) => {
    onFormChange({ ...form, description })
  }

  const handlePriorityChange = (priority: "low" | "normal" | "high" | "urgent") => {
    onFormChange({ ...form, priority })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="bg-neutral-900 border-l border-white/10 backdrop-blur-xl min-w-[700px] sm:w-[800px] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-white text-lg font-semibold tracking-tight">
                 M2 Rehberi Yeni Destek Talebi
                </SheetTitle>
                <p className="text-white/60 text-sm mt-1">Sorununuzu detaylı bir şekilde açıklayın</p>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-transparent to-white/5">
          <div className="flex-1 space-y-8 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-white/90 text-sm font-medium">
                Kategori
              </Label>
              <Select value={form.categoryId.toString()} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl px-4 py-3 backdrop-blur-sm focus:bg-white/15 transition-all duration-200">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/20">
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-white/90 text-sm font-medium">
                Başlık
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Talebinizin kısa bir açıklaması"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 backdrop-blur-sm focus:bg-white/15 transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-white/90 text-sm font-medium">
                Açıklama
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px] resize-none rounded-xl px-4 py-3 backdrop-blur-sm focus:bg-white/15 transition-all duration-200"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white/90 text-sm font-medium">Öncelik Seviyesi</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["low", "normal", "high", "urgent"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handlePriorityChange(priority)}
                    className={`p-4 rounded-xl border transition-all duration-200 backdrop-blur-sm ${
                      form.priority === priority
                        ? "bg-white/15 border-white/30 shadow-lg shadow-white/10"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <Badge className={`${getPriorityColor(priority)} text-xs font-medium w-full justify-center py-2`}>
                      {getPriorityIcon(priority)}
                      <span className="ml-2 capitalize">
                        {priority === "low"
                          ? "Düşük"
                          : priority === "normal"
                            ? "Normal"
                            : priority === "high"
                              ? "Yüksek"
                              : "Acil"}
                      </span>
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-6 bg-gradient-to-t from-white/5 to-transparent backdrop-blur-sm">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl py-3 transition-all duration-200"
              >
                İptal
              </Button>
              <Button
                onClick={onSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
                disabled={!form.title.trim() || !form.description.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

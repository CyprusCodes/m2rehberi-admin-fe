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
      return <CheckCircle className="h-4 w-4" />
    case "normal":
      return <Clock className="h-4 w-4" />
    case "high":
      return <AlertTriangle className="h-4 w-4" />
    case "urgent":
      return <Zap className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
    case "normal":
      return "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
    case "high":
      return "border-orange-400/40 bg-orange-500/10 text-orange-200"
    case "urgent":
      return "border-rose-400/40 bg-rose-500/10 text-rose-200"
    default:
      return "border-slate-500/40 bg-slate-500/10 text-slate-200"
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
        className="flex min-w-[700px] flex-col border-l border-slate-800/60 bg-slate-950/95 p-0 sm:w-[800px]"
      >
        <SheetHeader className="border-b border-slate-800/60 bg-gradient-to-r from-indigo-500/10 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-2">
              <Plus className="h-5 w-5 text-indigo-100" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-100 tracking-tight">
                Oyna.gg Destek Talebi
              </SheetTitle>
              <p className="mt-1 text-sm text-slate-400">Sorununuzu detaylı bir şekilde açıklayın</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-transparent to-slate-900/70">
          <div className="flex-1 space-y-8 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500/20">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium text-slate-300">
                Kategori
              </Label>
              <Select value={form.categoryId.toString()} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 focus:border-indigo-400/60">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                Başlık
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Talebinizin kısa bir açıklaması"
                className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-slate-300">
                Açıklama
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                className="min-h-[120px] resize-none rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-slate-300">Öncelik Seviyesi</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["low", "normal", "high", "urgent"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handlePriorityChange(priority)}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      form.priority === priority
                        ? "border-indigo-400/60 bg-indigo-500/15 shadow-lg shadow-indigo-900/30"
                        : "border-slate-700/60 bg-slate-900/60 hover:border-indigo-400/40 hover:bg-slate-900/70"
                    }`}
                  >
                    <Badge className={`${getPriorityColor(priority)} flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-medium`}>
                      {getPriorityIcon(priority)}
                      <span className="capitalize">
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

          <div className="border-t border-slate-800/60 bg-slate-950/80 p-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:border-indigo-400/40 hover:bg-slate-900/70"
              >
                İptal
              </Button>
              <Button
                onClick={onSubmit}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 py-3 text-slate-100 shadow-lg shadow-indigo-900/40 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
                disabled={!form.title.trim() || !form.description.trim()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

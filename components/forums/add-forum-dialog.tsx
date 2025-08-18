"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddForumDialogProps {
  children: React.ReactNode
}

export function AddForumDialog({ children }: AddForumDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Yeni forum kategorisi eklendi:", formData)
    // Implement forum creation logic
    setOpen(false)
    setFormData({
      name: "",
      description: "",
      status: "active",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Forum Kategorisi</DialogTitle>
          <DialogDescription>Yeni bir forum kategorisi oluşturun</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Genel Tartışma"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Kategori hakkında kısa açıklama"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Kategori Oluştur
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

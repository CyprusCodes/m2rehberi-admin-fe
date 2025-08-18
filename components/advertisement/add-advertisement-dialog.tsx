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

interface AddAdvertisementDialogProps {
  children: React.ReactNode
}

export function AddAdvertisementDialog({ children }: AddAdvertisementDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    url: "",
    startDate: "",
    endDate: "",
    order: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Yeni reklam eklendi:", formData)
    // Implement advertisement creation logic
    setOpen(false)
    setFormData({
      title: "",
      company: "",
      description: "",
      url: "",
      startDate: "",
      endDate: "",
      order: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Reklam Ekle</DialogTitle>
          <DialogDescription>MetinPort sistemine yeni bir reklam ekleyin</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Reklam Başlığı</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Premium Metin2 Items"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Şirket Adı</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Örn: GameShop TR"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reklam hakkında kısa açıklama"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Sıralama</Label>
            <Select value={formData.order} onValueChange={(value) => setFormData({ ...formData, order: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sıralama seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - En Üst</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Reklam Ekle
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

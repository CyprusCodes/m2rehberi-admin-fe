"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPackageDialog({ open, onOpenChange }: AddPackageDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    dimensions: "",
    price: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Package created:", formData)
    onOpenChange(false)
    setFormData({
      name: "",
      area: "",
      dimensions: "",
      price: "",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Reklam Paketi Oluştur</DialogTitle>
          <DialogDescription>Yeni bir reklam alanı paketi oluşturun ve fiyatını belirleyin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Paket Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Ana Sidebar Reklamı"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Reklam Alanı</Label>
            <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Reklam alanını seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sidebar">Sidebar</SelectItem>
                <SelectItem value="navbar">Navbar</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
                <SelectItem value="login">Login Ekranı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Boyutlar (px)</Label>
            <Input
              id="dimensions"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="Örn: 300x250"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Haftalık Fiyat (₺)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Reklam paketi hakkında açıklama..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Paketi Oluştur</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

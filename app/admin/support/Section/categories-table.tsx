"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { fetchSupportCategories, createSupportCategory, updateSupportCategory, deleteSupportCategory, type SupportCategory } from "@/services/support/categories";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export interface CategoryRow {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function CategoryTable({ categories, onEdit, onDelete }: {
  categories: CategoryRow[];
  onEdit: (category: CategoryRow) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad</TableHead>
          <TableHead>Açıklama</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Sıra</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((c) => (
          <TableRow key={c.category_id} className="hover:bg-white/5">
            <TableCell className="text-white font-medium">{c.name}</TableCell>
            <TableCell className="text-white/80">{c.description || "-"}</TableCell>
            <TableCell>
              <Badge 
                variant={c.is_active ? "default" : "secondary"}
                className={c.is_active 
                  ? "bg-green-600 hover:bg-green-700 text-white border-0" 
                  : "bg-red-600 hover:bg-red-700 text-white border-0"
                }
              >
                {c.is_active ? "Aktif" : "Pasif"}
              </Badge>
            </TableCell>
            <TableCell className="text-white">{c.sort_order}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                size="sm" 
                onClick={() => onEdit(c)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                <Edit className="h-4 w-4"/>
              </Button>
              <Button 
                size="sm" 
                onClick={() => onDelete(c.category_id)}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function SupportCategoriesTable() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true as boolean, sortOrder: 0 });

  const load = async () => {
    try {
      const res = await fetchSupportCategories();
      setCategories(res.data as CategoryRow[]);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Kategoriler yüklenemedi");
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async () => {
    try {
      if (editing) {
        await updateSupportCategory(editing.category_id, form);
        toast.success("Kategori güncellendi");
      } else {
        await createSupportCategory(form);
        toast.success("Kategori oluşturuldu");
      }
      setOpen(false); setEditing(null); setForm({ name: "", description: "", isActive: true, sortOrder: 0 });
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "İşlem başarısız");
    }
  };

  const handleEdit = (category: CategoryRow) => {
    setEditing(category);
    setForm({ 
      name: category.name, 
      description: category.description || "", 
      isActive: !!category.is_active, 
      sortOrder: category.sort_order 
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupportCategory(id);
      toast.success("Silindi");
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Silinemedi");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-white">Support Categories</h2>
        <Button 
          onClick={() => { setEditing(null); setForm({ name: "", description: "", isActive: true, sortOrder: 0 }); setOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2"/> Yeni Kategori
        </Button>
      </div>
      
      <CategoryTable 
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? "Kategori Düzenle" : "Yeni Kategori"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input 
              placeholder="Ad" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <Input 
              placeholder="Açıklama" 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <div className="flex gap-3">
              <Input 
                type="number" 
                placeholder="Sıra" 
                value={form.sortOrder} 
                onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} 
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
              <Button 
                type="button" 
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={form.isActive 
                  ? "bg-green-600 hover:bg-green-700 text-white border-0" 
                  : "bg-red-600 hover:bg-red-700 text-white border-0"
                }
              >
                {form.isActive ? "Aktif" : "Pasif"}
              </Button>
            </div>
            <Button 
              onClick={onSubmit} 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-full shadow-lg"
            >
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


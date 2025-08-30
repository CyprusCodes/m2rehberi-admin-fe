"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Pencil, Trash2, Info, AlertTriangle } from "lucide-react";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  type Role,
} from "@/services/roles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { AccessGate } from "./Section/AccessGate";

export default function RolesPage() {
  const [rows, setRows] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  // Form fields
  const [editingId, setEditingId] = useState<number | null>(null);
  const [userType, setUserType] = useState("");
  const [userTypeLabel, setUserTypeLabel] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isServerOwnerRequestable, setIsServerOwnerRequestable] = useState<number>(0);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const granted = localStorage.getItem("roles_access_granted") === "true";
        const exp = Number(
          localStorage.getItem("roles_access_expires_at") || "0"
        );
        if (granted && exp && Date.now() < exp) {
          setAccessGranted(true);
        } else {
          localStorage.removeItem("roles_access_granted");
          localStorage.removeItem("roles_access_expires_at");
        }
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRoles();
      setRows(res.data);
    } catch (e: any) {
      setError(e?.message || "Roller yüklenemedi");
      toast.error(e?.message || "Roller yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessGranted) load();
  }, [load, accessGranted]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.userType.toLowerCase().includes(q) ||
        r.userTypeLabel.toLowerCase().includes(q) ||
        String(r.userTypeId).includes(q)
    );
  }, [rows, search]);

  const openCreate = () => {
    setEditingId(null);
    setUserType("");
    setUserTypeLabel("");
    setStatus("active");
    setIsServerOwnerRequestable(0);
    setDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingId(role.userTypeId);
    setUserType(role.userType);
    setUserTypeLabel(role.userTypeLabel);
    setStatus(role.status);
    setIsServerOwnerRequestable(typeof role.isServerOwnerRequestable === 'boolean' ? (role.isServerOwnerRequestable ? 1 : 0) : (role.isServerOwnerRequestable ?? 0));
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      if (!userType.trim() || !userTypeLabel.trim()) return;
      
      if (editingId) {
        await updateRole(editingId, {
          userType,
          userTypeLabel,
          status,
          isServerOwnerRequestable,
        });
        toast.success("Rol güncellendi");
      } else {
        await createRole({
          userType,
          userTypeLabel,
          status,
          isServerOwnerRequestable,
        });
        toast.success("Rol oluşturuldu");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      const message = (e as any)?.message || "İşlem sırasında bir hata oluştu";
      toast.error(message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Bu rolü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteRole(id);
      toast.success("Rol silindi");
      await load();
    } catch (e) {
      const message = (e as any)?.message || "Rol silinirken bir hata oluştu";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={!accessGranted} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Güvenlik Doğrulaması</DialogTitle>
          </DialogHeader>
          <AccessGate onGranted={() => setAccessGranted(true)} />
        </DialogContent>
      </Dialog>

      <Alert className="border-red-200 bg-orange-500/50 text-white shadow-lg">
        <AlertTriangle className="h-5 w-5 text-white" />
        <AlertTitle className="text-white font-semibold text-lg">⚠️ Dikkat</AlertTitle>
        <AlertDescription className="text-white font-medium">
          Roller üzerinde yapılacak değişiklikler projenin çalışmasında
          aksamalara neden olabilir. Lütfen dikkatli olun.
        </AlertDescription>
      </Alert>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kullanıcı Rolleri</h1>
          <p className="text-muted-foreground">
            Sistem kullanıcı tiplerini yönetin
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Rol
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara..."
              className="max-w-xs"
            />
          </div>

          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kod</TableHead>
                <TableHead>Etiket</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    İstek Açılabilir
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Kullanıcılar rol değiştirmek istediklerinde Açık olan User Tipleri tercih edebilirler</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.userTypeId}>
                  <TableCell>#{r.userTypeId}</TableCell>
                  <TableCell>{r.userType}</TableCell>
                  <TableCell>{r.userTypeLabel}</TableCell>
                  <TableCell>
                    {r.status === "active" ? (
                      <Badge className="bg-green-500">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Pasif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.isServerOwnerRequestable === 1 ||
                    r.isServerOwnerRequestable === true ? (
                      <Badge className="bg-blue-500">Açık</Badge>
                    ) : (
                      <Badge variant="secondary">Kapalı</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(r)}>
                          <Pencil className="mr-2 h-4 w-4" /> Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => remove(r.userTypeId)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Rolü Düzenle" : "Yeni Rol"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Kod</Label>
              <Input
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                placeholder="super_admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userTypeLabel">Etiket</Label>
              <Input
                id="userTypeLabel"
                value={userTypeLabel}
                onChange={(e) => setUserTypeLabel(e.target.value)}
                placeholder="Yönetici"
              />
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={status}
                onValueChange={(v: "active" | "inactive") => setStatus(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Server Owner Talebi Açılabilir</Label>
              <Select
                value={String(isServerOwnerRequestable)}
                onValueChange={(v) => setIsServerOwnerRequestable(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Açık</SelectItem>
                  <SelectItem value="0">Kapalı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={submit}>
                {editingId ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

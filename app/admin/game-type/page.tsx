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
import { Plus, MoreHorizontal, Pencil, Power, PowerOff } from "lucide-react";
import {
  fetchGameTypes,
  createGameType,
  updateGameType,
  type GameType,
} from "@/services/gameTypes";
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
import { Switch } from "@/components/ui/switch";
import { ColorPicker, GradientColorPicker } from "@/components/ui/color-picker";
import { MobileCardPreview } from "@/components/game-types/mobile-card-preview";
import toast from "react-hot-toast";

export default function GameTypePage() {
  const [rows, setRows] = useState<GameType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form fields
  const [editingId, setEditingId] = useState<number | null>(null);
  const [gameTypeCode, setGameTypeCode] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [glowColor, setGlowColor] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchGameTypes();
      setRows(res.data);
    } catch (e: any) {
      setError(e?.message || "Oyun tipleri yüklenemedi");
      toast.error(e?.message || "Oyun tipleri yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.gameTypeCode.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(q)) ||
        String(r.gameTypeId).includes(q)
    );
  }, [rows, search]);

  const openCreate = () => {
    setEditingId(null);
    setGameTypeCode("");
    setTitle("");
    setSubtitle("");
    setBadge("");
    setIconUrl("");
    setGradientColors(["#0f172a", "#14532d", "#16a34a"]);
    setGlowColor("rgba(16, 185, 129, 0.35)");
    setIsActive(true);
    setSortOrder(0);
    setDialogOpen(true);
  };

  const openEdit = (gameType: GameType) => {
    setEditingId(gameType.gameTypeId);
    setGameTypeCode(gameType.gameTypeCode);
    setTitle(gameType.title);
    setSubtitle(gameType.subtitle || "");
    setBadge(gameType.badge || "");
    setIconUrl(gameType.iconUrl || "");
    setGradientColors(gameType.gradientColors || ["#0f172a", "#14532d", "#16a34a"]);
    setGlowColor(gameType.glowColor || "rgba(148, 163, 184, 0.35)");
    setIsActive(gameType.isActive);
    setSortOrder(gameType.sortOrder);
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      if (!gameTypeCode.trim() || !title.trim()) {
        toast.error("Kod ve başlık zorunludur");
        return;
      }
      
      if (gradientColors.length === 0) {
        toast.error("En az bir gradient rengi seçmelisiniz");
        return;
      }

      if (editingId) {
        await updateGameType(editingId, {
          gameTypeCode,
          title,
          subtitle: subtitle || null,
          badge: badge || null,
          iconUrl: iconUrl || null,
          gradientColors: gradientColors.length > 0 ? gradientColors : null,
          glowColor: glowColor || null,
          isActive,
          sortOrder,
        });
        toast.success("Oyun tipi güncellendi");
      } else {
        await createGameType({
          gameTypeCode,
          title,
          subtitle: subtitle || null,
          badge: badge || null,
          iconUrl: iconUrl || null,
          gradientColors: gradientColors.length > 0 ? gradientColors : null,
          glowColor: glowColor || null,
          isActive,
          sortOrder,
        });
        toast.success("Oyun tipi oluşturuldu");
      }
      setDialogOpen(false);
      await load();
    } catch (e) {
      const message = (e as any)?.message || "İşlem sırasında bir hata oluştu";
      toast.error(message);
    }
  };

  const toggleActive = async (gameType: GameType) => {
    try {
      await updateGameType(gameType.gameTypeId, {
        isActive: !gameType.isActive,
      });
      toast.success(`Oyun tipi ${!gameType.isActive ? "aktif" : "pasif"} edildi`);
      await load();
    } catch (e) {
      const message = (e as any)?.message || "Durum değiştirilemedi";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Oyun Tipleri</h1>
          <p className="text-muted-foreground">
            Oyun tiplerini yönetin ve mobil uygulamada görüntülenmesini kontrol edin
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Oyun Tipi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oyun Tipleri</CardTitle>
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
          {loading && <div className="text-sm text-muted-foreground mb-2">Yükleniyor...</div>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kod</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Alt Başlık</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.gameTypeId}>
                  <TableCell>#{r.gameTypeId}</TableCell>
                  <TableCell className="font-mono text-sm">{r.gameTypeCode}</TableCell>
                  <TableCell className="font-semibold">{r.title}</TableCell>
                  <TableCell>{r.subtitle || "-"}</TableCell>
                  <TableCell>
                    {r.badge ? (
                      <Badge variant="outline">{r.badge}</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {r.isActive ? (
                      <Badge className="bg-green-500">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Pasif</Badge>
                    )}
                  </TableCell>
                  <TableCell>{r.sortOrder}</TableCell>
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
                          onClick={() => toggleActive(r)}
                        >
                          {r.isActive ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" /> Pasif Et
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" /> Aktif Et
                            </>
                          )}
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
        <DialogContent className="min-w-6xl max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Oyun Tipini Düzenle" : "Yeni Oyun Tipi"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameTypeCode">Kod *</Label>
              <Input
                id="gameTypeCode"
                value={gameTypeCode}
                onChange={(e) => setGameTypeCode(e.target.value)}
                placeholder="minecraft"
                disabled={!!editingId}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Küçük harf, rakam ve alt çizgi kullanılabilir. Düzenleme sırasında değiştirilemez.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Minecraft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Alt Başlık</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Blocklarla sınırsız dünya."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Sandbox"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconUrl">İkon URL</Label>
                <Input
                  id="iconUrl"
                  type="url"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="https://example.com/icon.png"
                />
                <p className="text-xs text-muted-foreground">
                  İkon görselinin URL adresini giriniz
                </p>
              </div>
            </div>
            <GradientColorPicker
              value={gradientColors}
              onChange={setGradientColors}
              label="Gradient Renkleri"
            />
            <ColorPicker
              value={glowColor}
              onChange={setGlowColor}
              label="Glow Rengi"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sıra</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
            </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Mobil Görünüm Önizlemesi</Label>
                <p className="text-xs text-muted-foreground mb-4">
                  Mobil uygulamada nasıl görüneceğini buradan görebilirsiniz
                </p>
              </div>
              <MobileCardPreview
                title={title || "Oyun Adı"}
                subtitle={subtitle}
                badge={badge}
                iconUrl={iconUrl}
                gradientColors={gradientColors.length > 0 ? gradientColors : undefined}
                glowColor={glowColor}
                isSelected={false}
              />
              <div className="pt-4 border-t">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={submit}>
                    {editingId ? "Güncelle" : "Oluştur"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

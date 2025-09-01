"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  Database,
  Info,
  AlertTriangle,
  Settings,
} from "lucide-react";
import {
  getSystemSettings as fetchSystemSettings,
  type SystemSetting,
  createSystemSetting,
  updateSystemSetting,
  deleteSystemSetting,
} from "@/services/system-settings";
import { AccessGate } from "./AccessGate";

export function DatabaseSettings() {
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(
    null
  );
  
  // Access Gate state
  const [accessGranted, setAccessGranted] = useState(false);
  const [newSetting, setNewSetting] = useState<{
    setting_key: string;
    setting_value: string;
    setting_type: "string" | "integer" | "boolean";
    description: string;
    is_public: boolean;
    setting_status: "active" | "inactive";
  }>({
    setting_key: "",
    setting_value: "",
    setting_type: "string",
    description: "",
    is_public: false,
    setting_status: "active",
  });

  // Check access on component mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const granted = localStorage.getItem("settings_access_granted") === "true";
        const exp = Number(
          localStorage.getItem("settings_access_expires_at") || "0"
        );
        if (granted && exp && Date.now() < exp) {
          setAccessGranted(true);
        } else {
          localStorage.removeItem("settings_access_granted");
          localStorage.removeItem("settings_access_expires_at");
        }
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    if (!accessGranted) return;
    setLoading(true);
    try {
      const { data } = await fetchSystemSettings();
      setSettings(Array.isArray(data) ? (data as SystemSetting[]) : []);
      setErrored(false);
    } catch (e) {
      setErrored(true);
    } finally {
      setLoading(false);
    }
  }, [accessGranted]);

  useEffect(() => {
    load();
  }, [load]);

  const resetNewSetting = () => {
    setNewSetting({
      setting_key: "",
      setting_value: "",
      setting_type: "string",
      description: "",
      is_public: false,
      setting_status: "active",
    });
  };

  const handleCreate = async () => {
    try {
      const now = new Date().toISOString();
      await createSystemSetting({
        settingKey: newSetting.setting_key,
        settingValue: newSetting.setting_value,
        settingType: newSetting.setting_type,
        description: newSetting.description,
        isPublic: newSetting.is_public,
        settingStatus: newSetting.setting_status,
        createdAt: now,
        updatedAt: now,
      } as any);
      setIsCreateDialogOpen(false);
      resetNewSetting();
      await load();
      toast.success("Sistem ayarı başarıyla oluşturuldu");
    } catch (e: any) {
      toast.error(e?.message || "Ayar oluşturulurken bir hata oluştu");
    }
  };

  const openEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSetting) return;
    try {
      await updateSystemSetting(editingSetting);
      setIsEditDialogOpen(false);
      setEditingSetting(null);
      await load();
      toast.success("Sistem ayarı başarıyla güncellendi");
    } catch (e: any) {
      toast.error(e?.message || "Ayar güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async (setting: SystemSetting) => {
    if (!setting.settingId) return;
    const ok = window.confirm("Bu ayarı silmek istediğinize emin misiniz?");
    if (!ok) return;
    try {
      await deleteSystemSetting(setting.settingId);
      await load();
      toast.success("Sistem ayarı başarıyla silindi");
    } catch (e: any) {
      toast.error(e?.message || "Ayar silinirken bir hata oluştu");
    }
  };

  const renderValue = (setting: SystemSetting) => {
    switch (setting.settingType) {
      case "boolean":
        return (
          <Badge
            variant={setting.settingValue === "true" ? "default" : "secondary"}
            className="font-medium"
          >
            {setting.settingValue === "true" ? "Açık" : "Kapalı"}
          </Badge>
        );
      default:
        return (
          <span
            className="font-medium max-w-48 block truncate"
            title={setting.settingValue}
          >
            {setting.settingValue}
          </span>
        );
    }
  };

  const renderModalInput = (
    setting: SystemSetting,
    field: "setting_value",
    onChange: (value: string) => void
  ) => {
    switch (setting.settingType) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={setting.settingValue === "true"}
              onCheckedChange={(checked) =>
                onChange(checked ? "true" : "false")
              }
            />
            <Label>
              {setting.settingValue === "true" ? "Açık" : "Kapalı"}
            </Label>
          </div>
        );
      case "integer":
        return (
          <Input
            type="number"
            value={setting.settingValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Sayısal değer girin"
          />
        );
      default:
        return (
          <Input
            value={setting.settingValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Değer girin"
          />
        );
    }
  };

  // Show access gate if not granted
  if (!accessGranted) {
    return <AccessGate onGranted={() => setAccessGranted(true)} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Database className="h-8 w-8 animate-pulse text-muted-foreground" />
        <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
      </div>
    );
  }

  // Check if there are any inactive settings
  const inactiveSettings = settings.filter(setting => setting.settingStatus === 'inactive');
  const inactiveCount = inactiveSettings.length;

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">Sistem Ayarları Yönetim Paneli</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Bu bölümde uygulamanızın tüm konfigürasyon ayarlarını merkezi olarak yönetebilirsiniz. 
          Yapılan değişiklikler sistem genelinde anında etkili olacaktır.
        </AlertDescription>
      </Alert>

      {/* Red warning alert for inactive settings */}
      {inactiveCount > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-200">Sistem Uyarısı: Devre Dışı Ayarlar</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Sistemde {inactiveCount} adet devre dışı bırakılmış ayar bulunmaktadır. 
            Bu durumun farkındaysanız ve kasıtlı ise herhangi bir işlem yapmanıza gerek yoktur.
          </AlertDescription>
        </Alert>
      )}

      {/* Instructional info box for adding new permission controls */}
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Yeni İzin Kontrolü Ekleme Kılavuzu</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <div className="space-y-3">
            <p className="font-medium">Sisteme yeni bir izin kontrolü eklemek için aşağıdaki adımları takip ediniz:</p>
            <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-amber-200 dark:border-amber-700">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded text-xs font-medium">1</span>
                  <span>Yeni izin türünü sistem ayarları olarak tanımlayın</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded text-xs font-medium">2</span>
                  <span>İlgili API endpoint kontrolcülerinde gerekli izin kontrollerini implement edin</span>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                ⚠️ Önemli: Backend API'da manuel kod değişiklikleri gereklidir. 
                Sadece bu panelden eklenen izinler otomatik olarak çalışmayabilir.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {settings.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Henüz ayar bulunmuyor</AlertTitle>
          <AlertDescription>
            Sisteminiz için yeni ayarlar oluşturmaya başlayın.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sistem Ayarları
              </CardTitle>
              <CardDescription>
                Toplam {settings.length} ayar • Veritabanından yönetilen
                konfigürasyon
              </CardDescription>
            </div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Ayar Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Yeni Sistem Ayarı</DialogTitle>
                  <DialogDescription>
                    Sisteminiz için yeni bir konfigürasyon ayarı oluşturun
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="setting_key"
                        className="text-sm font-medium"
                      >
                        Ayar Anahtarı *
                      </Label>
                      <Input
                        id="setting_key"
                        value={newSetting.setting_key}
                        onChange={(e) =>
                          setNewSetting((prev) => ({
                            ...prev,
                            setting_key: e.target.value,
                          }))
                        }
                        placeholder="örn: maintenance.enabled"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="setting_type"
                        className="text-sm font-medium"
                      >
                        Veri Tipi
                      </Label>
                      <Select
                        value={newSetting.setting_type}
                        onValueChange={(value: any) =>
                          setNewSetting((prev) => ({
                            ...prev,
                            setting_type: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">Metin (String)</SelectItem>
                          <SelectItem value="boolean">
                            Doğru/Yanlış (Boolean)
                          </SelectItem>
                          <SelectItem value="integer">
                            Sayı (Integer)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="setting_value"
                      className="text-sm font-medium"
                    >
                      Değer *
                    </Label>
                    {newSetting.setting_type === "boolean" ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newSetting.setting_value === "true"}
                          onCheckedChange={(checked) =>
                            setNewSetting((prev) => ({
                              ...prev,
                              setting_value: checked ? "true" : "false",
                            }))
                          }
                        />
                        <Label>
                          {newSetting.setting_value === "true"
                            ? "Açık"
                            : "Kapalı"}
                        </Label>
                      </div>
                    ) : (
                      <Input
                        id="setting_value"
                        value={newSetting.setting_value}
                        onChange={(e) =>
                          setNewSetting((prev) => ({
                            ...prev,
                            setting_value: e.target.value,
                          }))
                        }
                        placeholder={
                          newSetting.setting_type === "integer"
                            ? "123"
                            : "Değer girin"
                        }
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Açıklama
                    </Label>
                    <Textarea
                      id="description"
                      value={newSetting.description}
                      onChange={(e) =>
                        setNewSetting((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Bu ayarın ne işe yaradığını açıklayın..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_public"
                        checked={newSetting.is_public}
                        onCheckedChange={(checked) =>
                          setNewSetting((prev) => ({
                            ...prev,
                            is_public: checked,
                          }))
                        }
                      />
                      <Label htmlFor="is_public" className="text-sm">
                        Public API'de görünür
                      </Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {newSetting.setting_status === "active"
                        ? "Aktif"
                        : "Pasif"}
                    </Badge>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetNewSetting();
                    }}
                  >
                    İptal
                  </Button>
                  <Button

                    disabled={
                      !newSetting.setting_key.trim() ||
                      !newSetting.setting_value.trim()
                    }
                    onClick={handleCreate}
                  >
                    Ayar Oluştur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Anahtar</TableHead>
                  <TableHead className="font-semibold">Değer</TableHead>
                  <TableHead className="font-semibold">
                    Seçilen Veri Tipi
                  </TableHead>
                  <TableHead className="font-semibold">Açıklama</TableHead>
                  <TableHead className="font-semibold">Görünürlük</TableHead>
                  <TableHead className="font-semibold">Durum</TableHead>
                  <TableHead className="font-semibold text-right">
                    İşlemler
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting, index) => (
                  <TableRow
                    key={setting.settingKey}
                    className={
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {setting.settingKey}
                    </TableCell>
                    <TableCell>{renderValue(setting)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {setting.settingType === "boolean"
                          ? "Doğru/Yanlış"
                          : setting.settingType === "integer"
                          ? "Sayı"
                          : "Metin"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <span
                        className="text-sm text-muted-foreground line-clamp-2"
                        title={setting.description}
                      >
                        {setting.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={setting.isPublic ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {setting.isPublic ? "Herkese Açık" : "Özel"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          setting.settingStatus === "active"
                            ? "default"
                            : "destructive"
                        }
                        className={`text-xs ${
                          setting.settingStatus === "active"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-800"
                        }`}
                      >
                        {setting.settingStatus === "active"
                          ? "Aktif"
                          : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        onClick={() => openEdit(setting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(setting)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ayarı Düzenle</DialogTitle>
            <DialogDescription>
              "{editingSetting?.settingKey}" ayarını güncelleyin
            </DialogDescription>
          </DialogHeader>

          {editingSetting && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ayar Anahtarı</Label>
                <Input
                  value={editingSetting.settingKey}
                  disabled
                  className="font-mono text-sm bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Değer</Label>
                {renderModalInput(editingSetting, "setting_value", (value) =>
                  setEditingSetting((prev) =>
                    prev ? { ...prev, settingValue: value } : null
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Açıklama</Label>
                <Textarea
                  value={editingSetting.description || ""}
                  onChange={(e) =>
                    setEditingSetting((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                  placeholder="Bu ayarın ne işe yaradığını açıklayın..."
                  className="min-h-[80px]"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={Boolean(editingSetting.isPublic)}
                    onCheckedChange={(checked) =>
                      setEditingSetting((prev) =>
                        prev ? { ...prev, isPublic: checked } : null
                      )
                    }
                  />
                  <Label className="text-sm">Public API'de görünür</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Durum:</Label>
                  <Select
                    value={editingSetting.settingStatus}
                    onValueChange={(value: any) =>
                      setEditingSetting((prev) =>
                        prev ? { ...prev, settingStatus: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingSetting(null);
              }}
            >
              İptal
            </Button>
            <Button onClick={handleSaveEdit}>Değişiklikleri Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

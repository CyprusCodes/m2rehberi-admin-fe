"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createServer } from "@/services/servers";
import { fetchTags, type Tag as ApiTag } from "@/services/tags";

interface AddServerDialogProps {
  children: React.ReactNode;
}

const LEVEL_RANGES = [
  "1-99",
  "1-105",
  "1-120",
  "1-250",
  "55-105",
  "55-120",
  "Other",
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

const SERVER_TYPES = ["TR Type", "VS Type", "GM Type", "Other"];

const OynaGG_SYSTEMS = [
  "Çevrimdışı Pazar",
  "Rebirth",
  "Gaya",
  "Zodyak Tapınağı",
  "Ticaret Camı",
  "Afrodit Sistemi",
  "Official Pet",
  "Savaş Bölgesi",
];

const OynaGG_FEATURES = [
  "Lycan",
  "Simya",
  "Kuşak",
  "Betalı",
  "Efsun Botu",
  "Razador",
  "Nemere",
  "Meley",
];

const OynaGG_EVENTS = [
  "Futbol Topu",
  "Ox",
  "Balık Etkinliği",
  "Ay Işığı",
  "Üç Yol Savaşı",
  "Kale Savaşı",
  "At Yarışı",
  "Sayı Tahmin",
];

const STEPS = [
  { id: 1, title: "Temel Bilgiler", description: "Sunucu adı ve oyun türü" },
  { id: 2, title: "Detaylar", description: "Oyuncu sayısı ve bağlantılar" },
  { id: 3, title: "Ayarlar", description: "Kurallar ve yapılandırma" },
  { id: 4, title: "Özellikler", description: "Sistemler ve eventlar" },
];

export function AddServerDialog({ children }: AddServerDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameType: "OynaGG",
    levelRange: "",
    difficulty: "",
    serverType: "",
    maxPlayers: "",
    tagId: "",
    discordLink: "",
    websiteLink: "",
    youtubeLinks: "",
    rules: "",
    systems: [] as string[],
    features: [] as string[],
    events: [] as string[],
  });
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const handleSystemToggle = (
    system: string,
    category: "systems" | "features" | "events"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(system)
        ? prev[category].filter((s) => s !== system)
        : [...prev[category], system],
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Load tags when dialog opens
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingTags(true);
        const res = await fetchTags();
        setTags(res.data || []);
      } catch (e) {
        // noop
      } finally {
        setLoadingTags(false);
      }
    };
    if (open) {
      load();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }
    try {
      const payload = {
        userId: Number(user.id),
        serverName: formData.name,
        description: formData.description || undefined,
        gameType: formData.gameType as "OynaGG" | "other",
        serverLevelRange: formData.levelRange || undefined,
        serverDifficulty: (formData.difficulty || undefined) as
          | "Easy"
          | "Medium"
          | "Hard"
          | "Other"
          | undefined,
        serverType: formData.serverType || undefined,
        maxPlayers: Number(formData.maxPlayers),
        tagId: formData.tagId ? Number(formData.tagId) : undefined,
        discordLink: formData.discordLink || undefined,
        websiteLink: formData.websiteLink || undefined,
        youtubeLinks: formData.youtubeLinks
          ? formData.youtubeLinks
              .split(/[\n,]+/)
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        serverRules: formData.rules || undefined,
        systems: formData.systems,
        features: formData.features,
        events: formData.events,
      };
      await createServer(payload);
      // notify list to refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("servers:refresh"));
      }
      setOpen(false);
      setCurrentStep(1);
      // Reset form
      setFormData({
        name: "",
        description: "",
        gameType: "OynaGG",
        levelRange: "",
        difficulty: "",
        serverType: "",
        maxPlayers: "",
        tagId: "",
        discordLink: "",
        websiteLink: "",
        youtubeLinks: "",
        rules: "",
        systems: [],
        features: [],
        events: [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Genel Bilgiler
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium">
                    Sunucu Adı *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Örn: Emek Server"
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gameType" className="text-base font-medium">
                    Oyun Türü *
                  </Label>
                  <Select
                    value={formData.gameType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gameType: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Oyun seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OynaGG">OynaGG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Açıklama
              </h3>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Sunucu Açıklaması *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Sunucu hakkında detaylı açıklama yazın..."
                  rows={5}
                  className="text-base resize-none"
                  required
                />
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Sunucu Özellikleri
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3 flex-1">
                  <Label className="text-base font-medium">Level Aralığı *</Label>
                  <Select
                    value={formData.levelRange}
                    onValueChange={(value) =>
                      setFormData({ ...formData, levelRange: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder="Level aralığı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVEL_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 flex-1">
                  <Label className="text-base font-medium">
                    Zorluk Seviyesi *
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder="Zorluk seviyesi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 flex-1">
                  <Label className="text-base font-medium">Server Tipi *</Label>
                  <Select
                    value={formData.serverType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serverType: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder="Server tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Sunucu Detayları
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 flex-1">
                  <Label htmlFor="maxPlayers" className="text-base font-medium">
                    Maksimum Oyuncu *
                  </Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPlayers: e.target.value })
                    }
                    placeholder="100"
                    min="1"
                    max="1000"
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <Label className="text-base font-medium">
                    Kategori (Tag)
                  </Label>
                  <Select
                    value={formData.tagId}
                    onValueChange={(value) => setFormData({ ...formData, tagId: value })}
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder={loadingTags ? "Yükleniyor..." : "Kategori seçin"} />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((t) => (
                        <SelectItem key={t.tagId} value={String(t.tagId)}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Bağlantılar
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="discordLink"
                      className="text-base font-medium"
                    >
                      Discord Linki
                    </Label>
                    <Input
                      id="discordLink"
                      value={formData.discordLink}
                      onChange={(e) =>
                        setFormData({ ...formData, discordLink: e.target.value })
                      }
                      placeholder="https://discord.gg/..."
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="websiteLink"
                      className="text-base font-medium"
                    >
                      Web Sitesi
                    </Label>
                    <Input
                      id="websiteLink"
                      value={formData.websiteLink}
                      onChange={(e) =>
                        setFormData({ ...formData, websiteLink: e.target.value })
                      }
                      placeholder="https://example.com"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="youtubeLinks"
                    className="text-base font-medium"
                  >
                    YouTube Linkleri (virgül veya yeni satır ile ayırın)
                  </Label>
                  <Textarea
                    id="youtubeLinks"
                    value={formData.youtubeLinks}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeLinks: e.target.value })
                    }
                    placeholder="https://youtu.be/abc123\nhttps://youtube.com/watch?v=def456\nhttps://youtu.be/ghi789"
                    rows={4}
                    className="text-base resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Sunucunuzla ilgili tanıtım videolarının YouTube linklerini ekleyin. Her satıra bir link yazabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Sunucu Kuralları
              </h3>
              <div className="space-y-3">
                <Label htmlFor="rules" className="text-base font-medium">
                  Kurallar ve Yönergeler
                </Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) =>
                    setFormData({ ...formData, rules: e.target.value })
                  }
                  placeholder="Sunucu kurallarını, yasakları ve yönergeleri detaylı bir şekilde yazın..."
                  rows={8}
                  className="text-base resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Oyuncuların uyması gereken kuralları açık ve anlaşılır bir
                  şekilde belirtin.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {formData.gameType === "OynaGG" && (
              <>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Genel Sistemler
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {OynaGG_SYSTEMS.map((system) => (
                      <div
                        key={system}
                        className="flex items-center space-x-3 p-3 bg-background rounded-md border"
                      >
                        <Checkbox
                          id={`system-${system}`}
                          checked={formData.systems.includes(system)}
                          onCheckedChange={() =>
                            handleSystemToggle(system, "systems")
                          }
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={`system-${system}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {system}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Diğer Özellikler
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {OynaGG_FEATURES.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-3 p-3 bg-background rounded-md border"
                      >
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() =>
                            handleSystemToggle(feature, "features")
                          }
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={`feature-${feature}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Eventlar
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {OynaGG_EVENTS.map((event) => (
                      <div
                        key={event}
                        className="flex items-center space-x-3 p-3 bg-background rounded-md border"
                      >
                        <Checkbox
                          id={`event-${event}`}
                          checked={formData.events.includes(event)}
                          onCheckedChange={() =>
                            handleSystemToggle(event, "events")
                          }
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={`event-${event}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {event}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}


            {formData.gameType !== "OynaGG" && (
              <div className="bg-muted/30 p-12 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-xl font-semibold mb-2">
                    OynaGG Özellikleri
                  </h3>
                  <p className="text-base">
                    Özellikleri görmek için önce temel bilgiler adımından oyun türünü seçin
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[85vw] max-h-[90vh] w-[85vw] min-w-[85vw]">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-center">
            Yeni Sunucu Ekle
          </DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            OynaGG sistemine yeni bir oyun sunucusu ekleyin
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress removed */}

        <ScrollArea className="max-h-[60vh] px-2">
          <div className="py-6">{renderStepContent()}</div>
        </ScrollArea>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 h-12 px-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Önceki
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-12 px-6"
            >
              İptal
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 h-12 px-6"
              >
                Sonraki
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 h-12 px-6 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4" />
                Sunucuyu Ekle
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
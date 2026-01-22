"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ArrowLeft,
  Loader2,
  Trophy,
  Gift,
  Users,
  Calendar,
  Upload,
  X,
  ImageIcon,
  Dices,
  Hand,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminCreateLottery,
  AdminCreateLotteryPayload,
} from "@/services/lottery";
import { fetchStreamers, Streamer } from "@/services/streamers";
import { uploadAsset } from "@/services/uploads";
import { apiClient } from "@/lib/apiClient";

export default function CreateLotteryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loadingStreamers, setLoadingStreamers] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prizeDescription, setPrizeDescription] = useState("");
  const [prizeImageUrl, setPrizeImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedStreamerId, setSelectedStreamerId] = useState<string>("");
  const [requireFollow, setRequireFollow] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [winnerCount, setWinnerCount] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizeType, setPrizeType] = useState<"coupon_code" | "username">(
    "username",
  );
  const [selectionMethod, setSelectionMethod] = useState<"random" | "manual">(
    "random",
  );
  const [couponCodes, setCouponCodes] = useState<string[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [bulkCouponCodes, setBulkCouponCodes] = useState("");

  // Fetch streamers on mount
  useEffect(() => {
    const loadStreamers = async () => {
      try {
        const response = await fetchStreamers();
        setStreamers(response);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Yayıncılar yüklenirken hata oluştu",
          variant: "destructive",
        });
      } finally {
        setLoadingStreamers(false);
      }
    };
    loadStreamers();
  }, [toast]);

  // Set default dates
  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formatDateForInput = (date: Date) => {
      return date.toISOString().slice(0, 16);
    };

    setStartDate(formatDateForInput(now));
    setEndDate(formatDateForInput(nextWeek));
  }, []);

  const isFormValid = () => {
    const basicValid =
      title.trim() &&
      prizeDescription.trim() &&
      selectedStreamerId &&
      startDate &&
      endDate &&
      new Date(startDate) < new Date(endDate);

    // If coupon_code type, check if we have enough codes
    if (prizeType === "coupon_code") {
      const winnerCountNum = parseInt(winnerCount) || 1;
      return basicValid && couponCodes.length >= winnerCountNum;
    }

    return basicValid;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Sadece resim dosyaları yüklenebilir",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadAsset(file);
      setPrizeImageUrl(response.data.url);
      toast({
        title: "Başarılı",
        description: "Görsel yüklendi",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Hata",
        description: "Görsel yüklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setPrizeImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formatDateForMySQL = (dateStr: string) => {
        return new Date(dateStr).toISOString().slice(0, 19).replace("T", " ");
      };

      const selectedStreamer = streamers.find(
        (s) => s.id.toString() === selectedStreamerId,
      );

      const payload: AdminCreateLotteryPayload = {
        title,
        description: description || undefined,
        prizeDescription,
        prizeImageUrl: prizeImageUrl || undefined,
        prizeType,
        participationRules: {
          streamer_id: parseInt(selectedStreamerId),
          follow_required: requireFollow,
        },
        maxParticipants: maxParticipants
          ? parseInt(maxParticipants)
          : undefined,
        startDate: formatDateForMySQL(startDate),
        endDate: formatDateForMySQL(endDate),
        winnerCount: parseInt(winnerCount) || 1,
        selectionMethod,
        status: "active",
        creatorUserId: selectedStreamer?.user_id || undefined,
      };

      const result = await adminCreateLottery(payload);

      // If coupon_code type and codes provided, add them
      if (prizeType === "coupon_code" && couponCodes.length > 0) {
        try {
          await apiClient.post(
            `/admin/lottery/${result.insertedGeneralLotteryId}/add-coupon-codes`,
            { couponCodes },
          );
        } catch (couponError: any) {
          console.error("Coupon codes error:", couponError);
          toast({
            title: "Uyarı",
            description:
              "Çekiliş oluşturuldu ancak kupon kodları eklenirken hata oluştu: " +
              (couponError?.response?.data?.message || "Bilinmeyen hata"),
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Başarılı",
        description: "Çekiliş başarıyla oluşturuldu!",
      });

      router.push("/admin/lottery");
    } catch (error: any) {
      console.error("Create lottery error:", error);
      toast({
        title: "Hata",
        description:
          error?.response?.data?.message || "Çekiliş oluşturulamadı!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lottery">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Çekiliş Oluştur</h1>
          <p className="text-muted-foreground">
            Bir yayıncı için çekiliş oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Çekiliş Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Çekiliş Bilgileri
              </CardTitle>
              <CardDescription>Çekiliş detaylarını girin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Çekiliş Başlığı *</Label>
                <Input
                  id="title"
                  placeholder="Örn: 1000 EP Çekilişi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  placeholder="Çekiliş hakkında detaylı bilgi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ödül Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Ödül Bilgileri
              </CardTitle>
              <CardDescription>Verilecek ödülü tanımlayın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prizeDescription">Ödül Açıklaması *</Label>
                <Textarea
                  id="prizeDescription"
                  placeholder="Örn: 1000 EP + VIP Paket"
                  value={prizeDescription}
                  onChange={(e) => setPrizeDescription(e.target.value)}
                  rows={2}
                  required
                />
              </div>

              {/* Prize Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="prizeType">Ödül Tipi *</Label>
                <Select
                  value={prizeType}
                  onValueChange={(value: "coupon_code" | "username") =>
                    setPrizeType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ödül tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="username">Kullanıcı Adı</SelectItem>
                    <SelectItem value="coupon_code">Kupon Kodu</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {prizeType === "username"
                    ? "Kazananlar çekiliş sonlandıktan sonra oyun kullanıcı adlarını girecekler"
                    : "Kazananlara otomatik olarak kupon kodları gönderilecek"}
                </p>
              </div>

              {/* Coupon Codes Section */}
              {prizeType === "coupon_code" && (
                <div className="space-y-2 border rounded-lg p-4">
                  <Label>Kupon Kodları</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Kazanan sayısı kadar kupon kodu eklemelisiniz. Kodları her
                    satıra bir kod gelecek şekilde yapıştırabilirsiniz.
                  </p>

                  {/* Bulk Entry - Textarea */}
                  <div className="space-y-2">
                    <Label htmlFor="bulkCouponCodes" className="text-sm">
                      Çoklu Kupon Kodu Ekle (Her satıra bir kod)
                    </Label>
                    <Textarea
                      id="bulkCouponCodes"
                      placeholder={`SDK-SDLDFMG-DLFGMD\nEPIC-2353-3522-3252\nSTEAM-DFKGD-DSEE-UOGL`}
                      value={bulkCouponCodes}
                      onChange={(e) => setBulkCouponCodes(e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const lines = bulkCouponCodes
                          .split("\n")
                          .map((line) => line.trim())
                          .filter((line) => line.length > 0);

                        const newCodes: string[] = [];
                        const duplicateCodes: string[] = [];

                        lines.forEach((code) => {
                          if (
                            !couponCodes.includes(code) &&
                            !newCodes.includes(code)
                          ) {
                            newCodes.push(code);
                          } else if (
                            couponCodes.includes(code) ||
                            newCodes.includes(code)
                          ) {
                            duplicateCodes.push(code);
                          }
                        });

                        if (newCodes.length > 0) {
                          setCouponCodes([...couponCodes, ...newCodes]);
                          setBulkCouponCodes("");
                          toast({
                            title: "Başarılı",
                            description: `${newCodes.length} kod eklendi${duplicateCodes.length > 0 ? `, ${duplicateCodes.length} kod zaten mevcut` : ""}`,
                          });
                        } else if (duplicateCodes.length > 0) {
                          toast({
                            title: "Uyarı",
                            description: "Tüm kodlar zaten eklenmiş",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-full"
                    >
                      Kodları Ekle
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted-foreground">veya</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>

                  {/* Single Entry */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tek kod ekle"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (
                            newCouponCode.trim() &&
                            !couponCodes.includes(newCouponCode.trim())
                          ) {
                            setCouponCodes([
                              ...couponCodes,
                              newCouponCode.trim(),
                            ]);
                            setNewCouponCode("");
                          } else if (
                            couponCodes.includes(newCouponCode.trim())
                          ) {
                            toast({
                              title: "Uyarı",
                              description: "Bu kod zaten eklenmiş",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          newCouponCode.trim() &&
                          !couponCodes.includes(newCouponCode.trim())
                        ) {
                          setCouponCodes([
                            ...couponCodes,
                            newCouponCode.trim(),
                          ]);
                          setNewCouponCode("");
                        } else if (couponCodes.includes(newCouponCode.trim())) {
                          toast({
                            title: "Uyarı",
                            description: "Bu kod zaten eklenmiş",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Ekle
                    </Button>
                  </div>

                  {/* Display Added Codes */}
                  {couponCodes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">
                          Eklenen Kodlar ({couponCodes.length}):
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCouponCodes([]);
                            toast({
                              title: "Temizlendi",
                              description: "Tüm kodlar kaldırıldı",
                            });
                          }}
                          className="h-6 text-xs"
                        >
                          Tümünü Temizle
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-muted/30">
                        {couponCodes.map((code, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-background border px-2 py-1 rounded text-sm font-mono"
                          >
                            <span>{code}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => {
                                setCouponCodes(
                                  couponCodes.filter((_, i) => i !== index),
                                );
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Ödül Görseli</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {prizeImageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border">
                    <Image
                      src={prizeImageUrl}
                      alt="Ödül görseli"
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Yükleniyor...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Görsel yüklemek için tıklayın
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Max 5MB, JPG/PNG
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Yayıncı Seçimi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Yayıncı Ataması
              </CardTitle>
              <CardDescription>
                Çekilişi hangi yayıncıya atayacaksınız?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streamer">Yayıncı Seçin *</Label>
                {loadingStreamers ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Yükleniyor...
                    </span>
                  </div>
                ) : streamers.length === 0 ? (
                  <div className="p-3 border rounded-md text-sm text-muted-foreground">
                    Onaylı yayıncı bulunamadı
                  </div>
                ) : (
                  <Select
                    value={selectedStreamerId}
                    onValueChange={setSelectedStreamerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yayıncı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {streamers.map((streamer) => (
                        <SelectItem
                          key={streamer.id}
                          value={streamer.id.toString()}
                        >
                          {streamer.display_name} (@{streamer.handle})
                          {streamer.is_verified && " ✓"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Takip Zorunlu</Label>
                  <p className="text-sm text-muted-foreground">
                    Katılım için yayıncıyı takip etmek gereksin
                  </p>
                </div>
                <Switch
                  checked={requireFollow}
                  onCheckedChange={setRequireFollow}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tarih ve Ayarlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tarih ve Ayarlar
              </CardTitle>
              <CardDescription>
                Çekiliş zamanlaması ve limitleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Başlangıç *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Bitiş *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="winnerCount">Kazanan Sayısı</Label>
                  <Input
                    id="winnerCount"
                    type="number"
                    min="1"
                    max="100"
                    value={winnerCount}
                    onChange={(e) => setWinnerCount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Katılımcı</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="Sınırsız"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kazanan Seçim Yöntemi */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dices className="h-5 w-5" />
                Kazanan Seçim Yöntemi
              </CardTitle>
              <CardDescription>
                Çekiliş bittiğinde kazananlar nasıl belirlensin?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Random Option */}
                <div
                  onClick={() => setSelectionMethod("random")}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                    selectionMethod === "random"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        selectionMethod === "random"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <Dices className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Otomatik (Random)</h4>
                        {selectionMethod === "random" && (
                          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sistem otomatik olarak kazananları seçer
                      </p>
                    </div>
                  </div>

                  {/* Info Box for Random */}
                  {selectionMethod === "random" && (
                    <div className="mt-4 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                      <div className="flex gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium mb-1">Nasıl Çalışır?</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>
                              Çekiliş bitiş tarihi geldiğinde sistem otomatik
                              çalışır
                            </li>
                            <li>Kazananlar rastgele seçilir</li>
                            <li>
                              Kazananlara otomatik push bildirim gönderilir
                            </li>
                            <li>Herhangi bir manuel işlem gerektirmez</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Option */}
                <div
                  onClick={() => setSelectionMethod("manual")}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                    selectionMethod === "manual"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        selectionMethod === "manual"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <Hand className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Manuel</h4>
                        {selectionMethod === "manual" && (
                          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Kazananları kendiniz seçersiniz
                      </p>
                    </div>
                  </div>

                  {/* Info Box for Manual */}
                  {selectionMethod === "manual" && (
                    <div className="mt-4 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                      <div className="flex gap-2">
                        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          <p className="font-medium mb-1">Nasıl Çalışır?</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>
                              Bitiş tarihine 5 dk kala email hatırlatması
                              alırsınız
                            </li>
                            <li>
                              Çekiliş bittiğinde kazananları kendiniz seçersiniz
                            </li>
                            <li>
                              5 dk içinde seçim yapılmazsa uyarı emaili
                              gönderilir
                            </li>
                            <li>
                              Canlı yayında çekiliş yapmak isteyenler için
                              idealdir
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/lottery">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || !isFormValid()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4 mr-2" />
                Çekiliş Oluştur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminCreateLottery,
  AdminCreateLotteryPayload,
} from "@/services/lottery";
import { fetchStreamers, Streamer } from "@/services/streamers";
import { uploadAsset } from "@/services/uploads";

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
    return (
      title.trim() &&
      prizeDescription.trim() &&
      selectedStreamerId &&
      startDate &&
      endDate &&
      new Date(startDate) < new Date(endDate)
    );
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
        (s) => s.id.toString() === selectedStreamerId
      );

      const payload: AdminCreateLotteryPayload = {
        title,
        description: description || undefined,
        prizeDescription,
        prizeImageUrl: prizeImageUrl || undefined,
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
        selectionMethod: "random",
        status: "active",
        creatorUserId: selectedStreamer?.user_id || undefined,
      };

      const result = await adminCreateLottery(payload);

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

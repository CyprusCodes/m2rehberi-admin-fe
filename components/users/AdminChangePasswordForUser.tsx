"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Wand2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { changeUserPassword } from "@/services/users";

interface AdminChangePasswordForUserProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminChangePasswordForUser({
  userId,
  open,
  onOpenChange,
}: AdminChangePasswordForUserProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setConfirmPassword(result);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Şifre kopyalandı");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!userId) return;

    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword(userId, password, sendEmail);
      toast.success("Şifre başarıyla değiştirildi");
      onOpenChange(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Şifre değiştirilemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Şifre Değiştir</DialogTitle>
          <DialogDescription>
            Kullanıcı için yeni bir şifre belirleyin.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Yeni şifre girin"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateRandomPassword}
                  title="Rastgele Şifre Oluştur"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!password}
                  title="Şifreyi Kopyala"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Şifre Tekrarı</Label>
              <Input
                id="confirm-password"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifreyi tekrar girin"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/50">
            <Checkbox
              id="send-email"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="send-email"
                className="font-medium cursor-pointer"
              >
                Bu şifreyi kullanıcıya gönder
              </Label>
              <p className="text-sm text-muted-foreground">
                Kullanıcıya yeni şifresini içeren bir bilgilendirme emaili
                gönderilir.
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4 text-blue-800" />
            <AlertDescription>
              Şifre en az 6 karakterden oluşmalıdır. Güçlü bir şifre için harf,
              rakam ve özel karakterler kullanmanız önerilir.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !password || !userId}
          >
            {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

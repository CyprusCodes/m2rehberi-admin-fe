"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Server,
  Trophy,
  Smartphone,
  Globe,
  Monitor,
  KeyRound,
  Clock,
} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  userStatus: string;
  emailVerifyStatus: string;
  emailVerifyCode: string | null;
  emailVerifyAt: string | null;
  createdAt: string;
  userType: string;
}

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Beklemede</Badge>
        );
      case "blocked":
        return <Badge variant="destructive">Engellenmiş</Badge>;
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const handleApproveUser = () => {
    console.log("Kullanıcı onaylandı:", user.email);
    // Implement user approval logic
    onOpenChange(false);
  };

  const handleBlockUser = () => {
    console.log("Kullanıcı engellendi:", user.email);
    // Implement user blocking logic
    onOpenChange(false);
  };

  const handleSendVerificationEmail = () => {
    console.log("Doğrulama emaili gönderildi:", user.email);
    // Implement email verification logic
  };

  const handleSendPasswordResetEmail = () => {
    console.log("Şifre sıfırlama emaili gönderildi:", user.email);
    // Implement password reset email logic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Kullanıcı Detayları</DialogTitle>
          <DialogDescription>
            {user.firstName} {user.lastName} kullanıcısının detaylı bilgileri
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={"/placeholder-user.jpg"}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-xl">
                  {(user.firstName[0] || "").concat(user.lastName[0] || "")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {getStatusBadge(user.userStatus)}
                {user.emailVerifyStatus === "active" ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Email Onaylandı
                  </Badge>
                ) : (
                  <Badge variant="outline">Email Beklemede</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Hesap Bilgileri</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Kayıt Tarihi</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Son Giriş</p>
                    <p className="text-sm text-muted-foreground">
                      {user.emailVerifyAt ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sunucu</p>
                    <p className="text-sm text-muted-foreground">
                      {user.userType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Level</p>
                    <p className="text-sm text-muted-foreground">-</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Teknik Bilgiler</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Son IP Adresi</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      -
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cihaz Bilgisi</p>
                    <p className="text-sm text-muted-foreground">-</p>
                  </div>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Telefon Numarası</p>
                      <p className="text-sm text-muted-foreground">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {user.userStatus === "pending" && (
              <Button
                onClick={handleApproveUser}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Kullanıcıyı Onayla
              </Button>
            )}
            {user.userStatus !== "blocked" && (
              <Button variant="destructive" onClick={handleBlockUser}>
                <UserX className="mr-2 h-4 w-4" />
                Kullanıcıyı Engelle
              </Button>
            )}
            {user.emailVerifyStatus !== "active" && (
              <Button variant="outline" onClick={handleSendVerificationEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Doğrulama Emaili Gönder
              </Button>
            )}
            <Button variant="outline" onClick={handleSendPasswordResetEmail}>
              <KeyRound className="mr-2 h-4 w-4" />
              Şifre Sıfırlama Emaili
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

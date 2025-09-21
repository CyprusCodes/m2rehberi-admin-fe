"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Gamepad2, ArrowLeft, LogIn, User, Eye, EyeOff, AlertCircle, Crown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const { adminLogin } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "E-posta adresi gerekli";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    if (!password) {
      newErrors.password = "Şifre gerekli";
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await adminLogin(email.trim(), password);
      if (success) {
        router.push("/admin");
      } else {
        setErrors({ general: "Admin girişi başarısız. Lütfen bilgilerinizi kontrol edin." });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Admin girişi yapılırken bir hata oluştu";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#05060c] via-[#040512] to-[#02030a] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),transparent_55%)]" />

      <div className="relative z-10 flex items-center justify-between p-6">
        <Link href="/">
          <Button variant="ghost" className="group gap-2 text-slate-300 hover:bg-slate-900/60">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Ana sayfaya dön
          </Button>
        </Link>
        <ModeToggle />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20">
              <Gamepad2 className="h-7 w-7 text-indigo-200" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-100">Oyna.gg Admin Girişi</h1>
              <p className="text-sm text-slate-400">Yönetim paneline erişmek için bilgilerinizi girin</p>
            </div>
          </div>

          <Card className="overflow-hidden border border-slate-800/60 bg-slate-900/70 shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
            <CardHeader className="relative pb-4 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-100">
                <Crown className="h-5 w-5 text-indigo-200" />
                Admin Panel
              </CardTitle>
              <CardDescription className="text-slate-400">
                Oyna.gg yönetim alanına sadece yetkili hesaplar giriş yapabilir
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                    <AlertCircle className="h-4 w-4" />
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                    E-posta Adresi
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="admin@oyna.gg"
                      className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-10 text-slate-100 placeholder:text-slate-500 ${
                        errors.email
                          ? "border-rose-500/40"
                          : focusedField === "email"
                            ? "border-indigo-400/60"
                            : "border-slate-700/60"
                      }`}
                      disabled={isLoading}
                    />
                    <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  {errors.email && <p className="text-xs text-rose-300">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Şifre
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Şifrenizi girin"
                      className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-12 text-slate-100 placeholder:text-slate-500 ${
                        errors.password
                          ? "border-rose-500/40"
                          : focusedField === "password"
                            ? "border-indigo-400/60"
                            : "border-slate-700/60"
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-rose-300">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 text-slate-100 shadow-lg shadow-indigo-900/40 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100/60 border-t-transparent" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Giriş Yap
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

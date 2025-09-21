"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/contexts/auth-context';
import { 
  Gamepad2, 
  UserPlus, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft, 
  Phone,
  Key,
  CheckCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  verifyCode?: string;
  general?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<1 | 2>(1);

  const { userLogin, userRegister, verifyEmail } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Ad gerekli";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Soyad gerekli";
    }

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

    if (phoneNumber && phoneNumber.trim() && !/^\+?[\d\s\-()]+$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Geçerli bir telefon numarası girin";
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const registerData: RegisterData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim() || undefined,
      };

      const success = await userRegister(registerData);
      if (success) {
        // Move to step 2 for email verification
        setStep(2);
      } else {
        setErrors({ general: "Kayıt başarısız. Lütfen tekrar deneyin." });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin.";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifyCode || verifyCode.trim().length !== 6) {
      setErrors({ verifyCode: "Lütfen 6 haneli doğrulama kodunu girin." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const verifySuccess = await verifyEmail(email.trim(), verifyCode.trim());
      
      if (verifySuccess) {
        // After successful verification, auto-login
        const loginSuccess = await userLogin(email.trim(), password);
        if (loginSuccess) {
          router.push('/profile');
        } else {
          // If auto-login fails, redirect to login page
          setErrors({ general: "E-posta doğrulandı. Lütfen giriş yapın." });
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        }
      } else {
        setErrors({ verifyCode: "Doğrulama başarısız. Lütfen kodu kontrol edin." });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Doğrulama başarısız. Lütfen kodu kontrol edin.";
      setErrors({ verifyCode: message });
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
              <h1 className="text-3xl font-semibold text-slate-100">
                {step === 1 ? "Oyna.gg'e Katılın" : "E-postanızı Doğrulayın"}
              </h1>
              <p className="text-sm text-slate-400">
                {step === 1 
                  ? "Topluluğumuza katılın ve yayıncıları takip edin"
                  : "E-posta adresinize gönderilen kodu girin"
                }
              </p>
            </div>
          </div>

          <Card className="overflow-hidden border border-slate-800/60 bg-slate-900/70 shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
            <CardHeader className="relative pb-4 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-100">
                {step === 1 ? (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Hesap Oluştur
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    E-posta Doğrulama
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {step === 1
                  ? "Bilgilerinizi girerek yeni hesabınızı oluşturun"
                  : "E-posta adresinize gönderilen 6 haneli kodu girin"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              {step === 1 ? (
                <form onSubmit={handleRegister} className="space-y-6">
                  {errors.general && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                      <AlertCircle className="h-4 w-4" />
                      {errors.general}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-slate-200">
                        Ad
                      </Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            clearError("firstName");
                          }}
                          onFocus={() => setFocusedField("firstName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Adınız"
                          className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-10 text-slate-100 placeholder:text-slate-500 ${
                            errors.firstName
                              ? "border-rose-500/40"
                              : focusedField === "firstName"
                                ? "border-indigo-400/60"
                                : "border-slate-700/60"
                          }`}
                          disabled={isLoading}
                        />
                        <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                      {errors.firstName && <p className="text-xs text-rose-300">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-slate-200">
                        Soyad
                      </Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            clearError("lastName");
                          }}
                          onFocus={() => setFocusedField("lastName")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Soyadınız"
                          className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-10 text-slate-100 placeholder:text-slate-500 ${
                            errors.lastName
                              ? "border-rose-500/40"
                              : focusedField === "lastName"
                                ? "border-indigo-400/60"
                                : "border-slate-700/60"
                          }`}
                          disabled={isLoading}
                        />
                        <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                      {errors.lastName && <p className="text-xs text-rose-300">{errors.lastName}</p>}
                    </div>
                  </div>

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
                        placeholder="ornek@oyna.gg"
                        className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-10 text-slate-100 placeholder:text-slate-500 ${
                          errors.email
                            ? "border-rose-500/40"
                            : focusedField === "email"
                              ? "border-indigo-400/60"
                              : "border-slate-700/60"
                        }`}
                        disabled={isLoading}
                      />
                      <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                    {errors.email && <p className="text-xs text-rose-300">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-200">
                      Telefon Numarası <span className="text-slate-400">(opsiyonel)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          clearError("phoneNumber");
                        }}
                        onFocus={() => setFocusedField("phoneNumber")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+905551234567"
                        className={`h-12 rounded-xl border bg-slate-900/70 px-4 pr-10 text-slate-100 placeholder:text-slate-500 ${
                          errors.phoneNumber
                            ? "border-rose-500/40"
                            : focusedField === "phoneNumber"
                              ? "border-indigo-400/60"
                              : "border-slate-700/60"
                        }`}
                        disabled={isLoading}
                      />
                      <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                    {errors.phoneNumber && <p className="text-xs text-rose-300">{errors.phoneNumber}</p>}
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
                        placeholder="En az 6 karakter"
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
                        Hesap oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Hesap Oluştur
                      </>
                    )}
                  </Button>

                  <div className="mt-6 text-center text-sm text-slate-400">
                    Zaten hesabınız var mı?{' '}
                    <Link href="/auth/signin" className="text-indigo-200 hover:text-indigo-100">
                      Giriş yapın
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-6">
                  {errors.general && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      <CheckCircle className="h-4 w-4" />
                      {errors.general}
                    </div>
                  )}

                  {errors.verifyCode && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                      <AlertCircle className="h-4 w-4" />
                      {errors.verifyCode}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="verifyCode" className="text-sm font-medium text-slate-200">
                      Doğrulama Kodu
                    </Label>
                    <div className="relative">
                      <Input
                        id="verifyCode"
                        type="text"
                        value={verifyCode}
                        onChange={(e) => {
                          setVerifyCode(e.target.value);
                          clearError("verifyCode");
                        }}
                        onFocus={() => setFocusedField("verifyCode")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="XXXXXX"
                        maxLength={6}
                        className={`h-12 rounded-xl border bg-slate-900/70 px-4 text-center text-slate-100 placeholder:text-slate-500 text-xl font-mono tracking-widest ${
                          errors.verifyCode
                            ? "border-rose-500/40"
                            : focusedField === "verifyCode"
                              ? "border-indigo-400/60"
                              : "border-slate-700/60"
                        }`}
                        disabled={isLoading}
                      />
                      <Key className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                    {errors.verifyCode && <p className="text-xs text-rose-300">{errors.verifyCode}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-100 shadow-lg shadow-emerald-900/40 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100/60 border-t-transparent" />
                        Doğrulanıyor...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Kodu Doğrula
                      </>
                    )}
                  </Button>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-slate-400 hover:text-slate-200"
                      disabled={isLoading}
                    >
                      ← Bilgileri düzenle
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
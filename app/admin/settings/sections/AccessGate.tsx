"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Database } from "lucide-react"
import toast from "react-hot-toast"

type AccessGateProps = {
  onGranted: () => void
}

export function AccessGate({ onGranted }: AccessGateProps) {
  const router = useRouter()
  const expected = process.env.NEXT_PUBLIC_SETTINGS_ACCESS_CODE

  const [digits, setDigits] = useState(["", "", "", ""])
  const inputsRef = useRef<Array<HTMLInputElement | null>>([null, null, null, null])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const onChange = (idx: number, value: string) => {
    const v = value.replace(/[^0-9]/g, "").slice(0, 1)
    const next = [...digits]
    next[idx] = v
    setDigits(next)
    setError(null)
    if (v && idx < 3) inputsRef.current[idx + 1]?.focus()

    const joined = next.join("")
    if (joined.length === 4 && next.every(Boolean)) validate(joined)
  }

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = idx - 1
      const next = [...digits]
      next[prev] = ""
      setDigits(next)
      inputsRef.current[prev]?.focus()
      e.preventDefault()
    }
  }

  const validate = (code: string) => {
    if (!expected || expected.length !== 4) {
      setError("Şifre yapılandırılmamış")
      toast.error("Şifre yapılandırılmamış")
      return
    }
    if (code === expected) {
      try {
        const expiresAt = Date.now() + 5 * 60 * 1000 // 5 dakika
        localStorage.setItem("settings_access_granted", "true")
        localStorage.setItem("settings_access_expires_at", String(expiresAt))
        localStorage.setItem("settings_access_attempts", "0")
      } catch {}
      toast.success("Erişim onaylandı")
      onGranted()
      return
    }
    setError("Geçersiz şifre")
    toast.error("Geçersiz şifre")
    try {
      const attempts = Number(localStorage.getItem("settings_access_attempts") || "0") + 1
      localStorage.setItem("settings_access_attempts", String(attempts))
      if (attempts >= 3) {
        router.replace("/admin")
        return
      }
    } catch {}
    setDigits(["", "", "", ""]) // sıfırla
    inputsRef.current[0]?.focus()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-2">
        <Database className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Veritabanı Ayarları</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Bu bölüm hassas sistem ayarlarını içerir. Erişim için 4 haneli güvenlik kodunu girin.
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <div className="flex items-center justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el
              }}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 rounded-md border bg-background text-center text-xl font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="•"
            />
          ))}
        </div>
        {error && (
          <div className="text-sm text-red-600 text-center bg-red-50 dark:bg-red-950 p-2 rounded-md border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <div className="text-xs text-muted-foreground text-center">
          Güvenlik kodu 5 dakika geçerlidir. 3 yanlış denemeden sonra ana sayfaya yönlendirileceksiniz.
        </div>
      </div>
    </div>
  )
}

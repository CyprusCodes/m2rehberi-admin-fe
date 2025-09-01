import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MetinPort - Metin2 Server Management",
  description: "Metin2 sunucularını keşfedin ve yönetin",
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}

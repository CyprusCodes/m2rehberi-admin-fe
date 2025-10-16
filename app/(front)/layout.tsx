import type React from "react"
import type { Metadata } from "next"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingFooter } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: "OynaGG - Metin2 Server Management",
  description: "Metin2 sunucularını keşfedin ve yönetin",
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      {children}
      <LandingFooter />
    </div>
  )
}

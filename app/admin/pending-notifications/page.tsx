"use client";

import { PendingNotificationsTable } from "./Section/PendingNotificationsTable";
import { Bell, Shield, Sparkles } from "lucide-react";

export default function PendingNotificationsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-darkblue-900 to-darkblue-950 text-foreground pb-20">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[90px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[1600px] space-y-8">
        {/* Premium Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Icon Container with Premium Effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-500/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <Bell className="h-9 w-9 text-blue-400" />
                  <Sparkles className="h-4 w-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>

              {/* Title and Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 tracking-tight">
                    Bildirim Yönetimi
                  </h1>
                </div>
                <p className="text-slate-400 text-lg font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Yayıncı bildirimlerini profesyonelce inceleyin ve yönetin
                </p>
              </div>
            </div>

            {/* Optional: Quick Stats Badge */}
            <div className="hidden lg:flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white/90">
                Sistem Aktif
              </span>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <PendingNotificationsTable />
      </div>
    </div>
  );
}

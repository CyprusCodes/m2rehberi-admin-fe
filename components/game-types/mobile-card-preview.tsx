"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface MobileCardPreviewProps {
  title: string;
  subtitle?: string;
  badge?: string;
  iconUrl?: string;
  gradientColors?: string[];
  glowColor?: string;
  isSelected?: boolean;
}

export function MobileCardPreview({
  title,
  subtitle,
  badge,
  iconUrl,
  gradientColors = ["#0f172a", "#1e293b", "#334155"],
  glowColor = "rgba(148, 163, 184, 0.35)",
  isSelected = false,
}: MobileCardPreviewProps) {
  const [imageError, setImageError] = useState(false);
  
  const gradientStyle = useMemo(() => {
    if (gradientColors.length === 0) {
      return { background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" };
    }
    return {
      background: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
    };
  }, [gradientColors]);

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: isSelected ? "#22c55e" : "rgba(148, 163, 184, 0.25)" }}>
      <div
        className="relative p-6"
        style={{
          ...gradientStyle,
          boxShadow: `0 10px 18px ${glowColor}`,
        }}
      >
        {/* Mobile frame simulation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
              >
                {iconUrl && !imageError ? (
                  <Image
                    src={iconUrl}
                    alt={title}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <Gamepad2 className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{title || "Oyun Adı"}</h3>
                {subtitle && (
                  <p className="text-sm text-slate-200">{subtitle}</p>
                )}
              </div>
            </div>
            {badge && (
              <div
                className="rounded-full px-3 py-1"
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.55)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <span className="text-xs font-semibold text-slate-100">{badge}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-200" />
              <span className="text-xs text-slate-200">
                {subtitle || "Harika bir oyun deneyimi"}
              </span>
            </div>
            {isSelected && (
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-200">Seçili</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">
        Mobil görünüm önizlemesi
      </div>
    </Card>
  );
}

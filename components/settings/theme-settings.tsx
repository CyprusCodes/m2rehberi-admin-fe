"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Palette, Monitor, Moon, Sun } from "lucide-react"

export function ThemeSettings() {
  const { theme, setTheme, systemTheme } = useTheme()

  const themes = [
    {
      name: "light",
      label: "Açık Tema",
      description: "Açık renkli arayüz",
      icon: Sun,
    },
    {
      name: "dark",
      label: "Koyu Tema",
      description: "Koyu renkli arayüz",
      icon: Moon,
    },
    {
      name: "system",
      label: "Sistem",
      description: "Sistem ayarını takip et",
      icon: Monitor,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Tema Seçimi
          </CardTitle>
          <CardDescription>Admin paneli için tema tercihlerinizi belirleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={theme} onValueChange={setTheme} className="space-y-4">
            {themes.map((themeOption) => (
              <div key={themeOption.name} className="flex items-center space-x-3">
                <RadioGroupItem value={themeOption.name} id={themeOption.name} />
                <Label htmlFor={themeOption.name} className="flex items-center gap-3 cursor-pointer flex-1">
                  <themeOption.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{themeOption.label}</div>
                    <div className="text-sm text-muted-foreground">{themeOption.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Otomatik Tema Değişimi</Label>
                <div className="text-sm text-muted-foreground">Gündüz/gece saatlerine göre otomatik tema değişimi</div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Yüksek Kontrast</Label>
                <div className="text-sm text-muted-foreground">Erişilebilirlik için yüksek kontrast modu</div>
              </div>
              <Switch />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Varsayılana Sıfırla
            </Button>
            <Button size="sm">Değişiklikleri Kaydet</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tema Önizleme</CardTitle>
          <CardDescription>Seçili temanın görünümü</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-background border rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">Arka Plan</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-card border rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">Kart</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">Card</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">Birincil</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">Primary</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

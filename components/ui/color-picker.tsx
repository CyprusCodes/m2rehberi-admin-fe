"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div
              className="mr-2 h-4 w-4 rounded border"
              style={{ backgroundColor: value || "#000000" }}
            />
            <span className="font-mono text-sm">{value || "Renk seçin"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Renk Seçici</Label>
              <Input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-12 w-full cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Hex Kodu</Label>
              <Input
                type="text"
                value={value || ""}
                onChange={(e) => {
                  let hex = e.target.value.replace(/[^0-9A-Fa-f#]/g, "");
                  if (!hex.startsWith("#") && hex.length > 0) {
                    hex = `#${hex}`;
                  }
                  if (hex.length <= 7) {
                    onChange(hex);
                  }
                }}
                placeholder="#000000"
                className="font-mono"
                maxLength={7}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface GradientColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  label?: string;
}

export function GradientColorPicker({
  value,
  onChange,
  label,
}: GradientColorPickerProps) {
  const [open, setOpen] = useState(false);
  const colors = value.length > 0 ? value : ["#000000"];

  const addColor = () => {
    onChange([...colors, "#000000"]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      onChange(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div className="mr-2 flex h-4 gap-1">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm">
              {colors.length} renk seçildi
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Gradient Renkleri</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColor}
              >
                <Plus className="h-4 w-4 mr-1" />
                Renk Ekle
              </Button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="h-10 w-20 cursor-pointer shrink-0"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const hex = e.target.value.replace(/[^0-9A-Fa-f#]/g, "");
                      if (hex.length <= 7) {
                        updateColor(index, hex.startsWith("#") ? hex : `#${hex}`);
                      }
                    }}
                    className="font-mono flex-1"
                    placeholder="#000000"
                    maxLength={7}
                  />
                  {colors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColor(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <div className="h-12 rounded-md overflow-hidden">
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(to right, ${colors.join(", ")})`,
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

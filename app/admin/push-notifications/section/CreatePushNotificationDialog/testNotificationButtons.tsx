"use client";

import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Zap } from "lucide-react";

interface TestNotificationButtonsProps {
  onTest: (platform: "ios" | "android" | "all") => void;
  disabled?: boolean;
}

export const TestNotificationButtons = ({
  onTest,
  disabled,
}: TestNotificationButtonsProps) => {
  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onTest("ios")}
        disabled={disabled}
        className="gap-2 border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all"
      >
        <Smartphone className="w-4 h-4 text-blue-400" />
        <span className="font-medium">iOS Test</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onTest("android")}
        disabled={disabled}
        className="gap-2 border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all"
      >
        <Tablet className="w-4 h-4 text-green-400" />
        <span className="font-medium">Android Test</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onTest("all")}
        disabled={disabled}
        className="gap-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
      >
        <Zap className="w-4 h-4 text-blue-400" />
        <span className="font-medium">Tümü Test</span>
      </Button>
    </div>
  );
};

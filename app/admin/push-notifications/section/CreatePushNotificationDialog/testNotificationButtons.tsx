"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface TestNotificationButtonsProps {
  onTest: () => void;
  disabled?: boolean;
  selectedUser?: string;
}

export const TestNotificationButtons = ({
  onTest,
  disabled,
  selectedUser,
}: TestNotificationButtonsProps) => {
  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onTest}
        disabled={disabled || !selectedUser}
        className="gap-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
      >
        <Send className="w-4 h-4 text-blue-400" />
        <span className="font-medium">
          {selectedUser ? "Seçilen Kullanıcıya Test Gönder" : "Test İçin Kullanıcı Seçin"}
        </span>
      </Button>
    </div>
  );
};

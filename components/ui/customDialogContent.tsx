import { DialogFooter, DialogHeader, DialogTitle } from "./dialog";

import { DialogClose } from "./dialog";

import { Button } from "./button";
import { DialogContent } from "./dialog";
import { Circle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
export const CustomDialogContent = ({
  children,
  title,
  description,
  currentTab,
  tabs,
  onConfirm,
  bodyClassName,
  wrapperClassName,
  hideTitle = false,
  isSubmitting = false,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  currentTab?: string;
  tabs?: {
    name: string;
    icon: React.ElementType;
    onClick?: () => void;
  }[];
  onConfirm?: () => void;
  bodyClassName?: string;
  wrapperClassName?: string;
  hideTitle?: boolean;
  isSubmitting?: boolean;
}) => {
  return (
    <DialogContent
      className="dark min-w-[85%] h-[98%] p-0 flex gap-0 flex-col overflow-hidden"
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
    >
      <DialogHeader className="h-[50px] flex-shrink-0 flex justify-center border-b border-gray-200/10">
        {/* Always render DialogTitle for accessibility, hide visually if hideTitle is true */}
        {title ? (
          <DialogTitle className={cn(hideTitle && "sr-only")}></DialogTitle>
        ) : (
          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}
        <div className="flex items-center h-full gap-10">
          <DialogClose asChild>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <X className="w-4 h-4 text-subtle" />
              </Button>
              <p className="px-2 bg-subtle2 rounded-md text-sm text-subtle">
                esc
              </p>
            </div>
          </DialogClose>
          {tabs && (
            <div className="flex items-center h-full">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={tab.onClick}
                  className={cn(
                    "flex items-center min-w-[200px] h-full border-x border-gray-200/10",
                    currentTab !== tab.name && "bg-[#18181B]"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 ml-4",
                      currentTab !== tab.name && "opacity-50"
                    )}
                  >
                    <Circle
                      className={cn(
                        "w-4 h-4 text-subtle",
                        currentTab === tab.name && "text-blue-400"
                      )}
                    />
                    <p className="text-white text-sm font-bold">{tab.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {title && hideTitle && <span className="ml-auto mr-4">{title}</span>}
        </div>
      </DialogHeader>
      <div className={cn("flex-1 overflow-y-auto px-6 py-6", wrapperClassName)}>
        <div className={cn("w-full max-w-[1200px] mx-auto", bodyClassName)}>
          {!hideTitle && (
            <div className="w-full flex flex-col gap-2 mb-6">
              <DialogTitle className="text-white text-2xl font-bold">
                {title}
              </DialogTitle>
              {description && (
                <div className="text-subtle text-sm">{description}</div>
              )}
            </div>
          )}

          <div className="w-full">{children}</div>
        </div>
      </div>
      {onConfirm && (
        <DialogFooter className="h-[60px] border-t border-gray-200/10">
          <div className="flex items-center gap-2 mr-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {}}
                className="text-white"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            {onConfirm && (
              <Button onClick={onConfirm} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Confirm"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      )}
    </DialogContent>
  );
};

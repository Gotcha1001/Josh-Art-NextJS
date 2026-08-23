"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

interface SpinnerProps {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Spinner({
  size = "md",
  label,
  className,
  fullScreen = false,
}: SpinnerProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <Loader2 className={cn(SIZES[size], "animate-spin text-primary")} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

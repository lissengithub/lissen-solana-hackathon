"use client";

import { cn } from "@/lib/utils";
import { UserRoundPlus } from "lucide-react";

interface SlotEmptyProps {
  className?: string;
  keyboardVisible: boolean;
}

export function SlotEmpty({ className, keyboardVisible }: SlotEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 h-full aspect-[179/246] w-full",
        keyboardVisible ? "aspect-square" : "",
        className,
      )}
    >
      <div className="relative w-full h-full">
        <div
          className={cn(
            "w-full h-full rounded-xl bg-[#1F2428] border border-white/10 border-dashed flex items-center justify-center",
            keyboardVisible ? "rounded-full" : "",
          )}
        >
          <UserRoundPlus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white ml-[1px] sm:ml-[2px] md:ml-[3px]" />
        </div>
      </div>
    </div>
  );
}

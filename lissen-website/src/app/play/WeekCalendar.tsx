"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import updateLocale from "dayjs/plugin/updateLocale";
import { cn } from "@/lib/utils";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

interface WeekCalendarProps {
  className?: string;
  activeWeek: number;
  setActiveWeek: (week: number) => void;
}

// Show last week, current week, and next week
const WEEK_COUNT = 3;

dayjs.extend(weekOfYear);

const WeekCalendar = ({
  activeWeek,
  setActiveWeek,
  className,
}: WeekCalendarProps) => {
  // Create array of week objects with first and last day
  const weeks = useMemo(() => {
    return Array.from({ length: WEEK_COUNT }).map((_, index) => {
      // Start from last week (-1), current week (0), next week (1)
      const weekOffset = index - 1;
      const firstDay = dayjs().utc().startOf("week").add(weekOffset, "week");
      const lastDay = firstDay.endOf("week");
      return {
        firstDay,
        lastDay,
        weekNumber: firstDay.week(),
      };
    });
  }, []);

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar w-full">
        {weeks.map((week) => {
          const isActive = week.weekNumber === activeWeek;
          return (
            <button
              key={week.weekNumber}
              onClick={() => setActiveWeek(week.weekNumber)}
              className={cn(
                "flex-1 h-[50px] sm:min-w-[184px] sm:w-[184px] sm:h-[60px] sm:flex-none shrink-0 rounded-md flex flex-col justify-center items-center border border-white/10 ",
                isActive ? "bg-white" : "bg-white/10",
              )}
            >
              <span
                className={cn(
                  "font-bold text-xs sm:text-sm",
                  isActive ? "text-black" : "text-white/50",
                )}
              >
                {dayjs(week.firstDay).format("MMMM").toUpperCase()}
              </span>
              <span
                className={cn(
                  "font-bold text-xs sm:text-sm",
                  isActive ? "text-black" : "text-white/50",
                )}
              >
                {`${dayjs(week.firstDay).format("DD")} - ${dayjs(week.lastDay).format("DD")}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  className?: string;
}

export function GlassCalendar({ onDateSelect, selectedDate, className }: GlassCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(selectedDate || null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (date: Date) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass p-6 shadow-xl", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousMonth}
          className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.h2
          key={format(currentMonth, "MMMM yyyy")}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold flex items-center gap-2"
        >
          <CalendarIcon className="w-5 h-5 text-[var(--splita-accent)]" />
          {format(currentMonth, "MMMM yyyy")}
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextMonth}
          className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        <AnimatePresence mode="wait">
          {daysInMonth.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isSelected = selected && isSameDay(date, selected);
            const isToday = isSameDay(date, new Date());

            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.01 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "aspect-square rounded-xl transition-all duration-300",
                  "flex items-center justify-center text-sm font-medium",
                  !isCurrentMonth && "text-gray-400 opacity-50",
                  isCurrentMonth && !isSelected && "text-gray-700 hover:bg-white/20",
                  isToday && !isSelected && "ring-2 ring-[var(--splita-accent)]/50",
                  isSelected && "bg-[var(--splita-accent)] text-white shadow-lg scale-110"
                )}
              >
                {format(date, "d")}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Date Display */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-white/20"
        >
          <p className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-[var(--splita-accent)]">{format(selected, "EEEE, MMMM d, yyyy")}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}


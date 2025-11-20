import { useState } from "react";
import { GlassCalendar } from "@/components/ui/glass-calendar";
import { motion } from "framer-motion";

export default function GlassCalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/illustrations/liquid-1.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white drop-shadow-lg"
          >
            Glass Calendar Demo
          </motion.h1>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 lg:col-span-2"
          >
            <GlassCalendar
              onDateSelect={(date) => {
                setSelectedDate(date);
                console.log("Selected date:", date);
              }}
              selectedDate={selectedDate}
            />
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4">Selected Date</h2>
            {selectedDate ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  You can use this date for scheduling, booking, or any other purpose.
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No date selected yet. Click on a date above!</p>
            )}
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass p-6 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--splita-accent)]" />
              Smooth animations with Framer Motion
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--splita-accent)]" />
              Liquid glass design matching Cash App / Venmo aesthetic
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--splita-accent)]" />
              Premium fintech aesthetic
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--splita-accent)]" />
              Responsive design for all screen sizes
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}


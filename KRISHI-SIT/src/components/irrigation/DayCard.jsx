import React from "react";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

/**
 * Shows single day's tasks in scheduler.
 * day: { day: "Day 1", tasks: [...] }
 */
export default function DayCard({ day, index = 0 }) {
    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.04 }}
        >
            <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs text-white/60">{day.day}</div>
                        <div className="font-semibold mt-1">{day.tasks[0]}</div>
                    </div>
                    <div className="text-xs text-white/60">{day.tasks.length} tasks</div>
                </div>

                <ul className="mt-3 text-sm text-white/70 list-disc ml-5 space-y-1">
                    {day.tasks.map((t, i) => (
                        <li key={i}>{t}</li>
                    ))}
                </ul>
            </GlassCard>
        </motion.div>
    );
}

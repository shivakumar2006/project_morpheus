import React from "react";
import { motion } from "framer-motion";

/**
 * Small card to show a recommended crop with meta.
 * Props: crop {name, season, relevancy, tips}, index
 */
export default function CropResultCard({ crop, index = 1 }) {
    const relevancy = crop.relevancy ?? crop.score ?? 70;
    const badgeColor =
        relevancy > 80 ? "bg-emerald-300 text-black" : relevancy > 65 ? "bg-yellow-300 text-black" : "bg-red-400 text-black";

    return (
        <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.28, delay: index * 0.03 }}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/4 border border-white/6"
        >
            <div>
                <div className="text-xs text-white/60">Recommendation #{index}</div>
                <div className="text-lg font-semibold">{crop.name}</div>
                {crop.season && <div className="text-xs text-white/60 mt-1">Season: {crop.season}</div>}
                {crop.tips && <div className="text-sm text-white/70 mt-2">{crop.tips}</div>}
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className={`text-xs px-3 py-1 rounded-full ${badgeColor}`}>{Math.round(relevancy)}%</div>
                <button className="text-sm px-2 py-1 rounded-md bg-white/6 border border-white/8">View</button>
            </div>
        </motion.div>
    );
}

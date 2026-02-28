import React from "react";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

/**
 * Shows the detection result: soil type, confidence, details & recommended crops.
 * Expects result = { type, confidence, details, recommendedCrops: [{name,...}] }
 */
export default function SoilResultCard({ result }) {
    if (!result) {
        return (
            <GlassCard>
                <div className="text-sm text-white/70">No detection yet. Upload soil image to see results here.</div>
            </GlassCard>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
            <GlassCard>
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white/6 flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-300" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            <path d="M5 11c1.6-3 4-5 7-5s5.4 2 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <div className="text-lg font-semibold">{result.type}</div>
                        <div className="text-xs text-white/60 mt-1">Confidence: {(result.confidence * 100).toFixed(0)}%</div>
                        <p className="text-sm text-white/70 mt-3">{result.details}</p>

                        <div className="mt-4">
                            <div className="text-sm font-medium mb-2">Recommended crops</div>
                            <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                                {result.recommendedCrops?.map((c) => (
                                    <div key={c.name} className="flex items-center justify-between p-3 rounded-md bg-white/4 border border-white/6">
                                        <div>
                                            <div className="font-medium">{c.name}</div>
                                            <div className="text-xs text-white/60">Suitable for {result.type} soil</div>
                                        </div>
                                        <div className="text-xs text-emerald-200">Recommended</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

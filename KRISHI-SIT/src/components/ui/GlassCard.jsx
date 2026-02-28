import React from "react";
import { motion } from "framer-motion";

/**
 * Simple glassmorphism wrapper used across pages.
 * Accepts className for custom sizing/spacing.
 */
export default function GlassCard({ children, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className={
                `backdrop-blur-md bg-white/6 border border-white/8 rounded-2xl shadow-2xl p-6 ` +
                className
            }
        >
            {children}
        </motion.div>
    );
}

import React from "react";
import { motion } from "framer-motion";

/**
 * Primary button with framer micro interaction.
 * Props: children, onClick, disabled, loading, className
 */
export default function Button({
    children,
    onClick,
    disabled = false,
    loading = false,
    className = "",
    type = "button",
}) {
    return (
        <motion.button
            type={type}
            whileTap={{ scale: 0.985 }}
            className={
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm " +
                "bg-gradient-to-r from-emerald-400 to-green-600 text-black disabled:opacity-60 " +
                className
            }
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
        >
            {loading ? (
                <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span>Processing</span>
                </>
            ) : (
                children
            )}
        </motion.button>
    );
}

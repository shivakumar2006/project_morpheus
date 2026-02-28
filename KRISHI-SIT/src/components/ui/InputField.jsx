import React from "react";

/**
 * Reusable input with label and small styling suitable for dashboards.
 * Props:
 *  - label (string)
 *  - id (string)
 *  - type (string)
 *  - value, onChange
 *  - placeholder
 */
export default function InputField({
    label,
    id,
    type = "text",
    value,
    onChange,
    placeholder = "",
    className = "",
}) {
    return (
        <label htmlFor={id} className="block text-sm">
            <div className="text-xs text-white/75 mb-1">{label}</div>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={
                    "w-full rounded-lg bg-white/5 border border-white/8 px-4 py-2 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition " +
                    className
                }
                aria-label={label}
            />
        </label>
    );
}

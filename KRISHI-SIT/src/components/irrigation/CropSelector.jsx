import React from "react";

/**
 * Simple select for crop/soil options.
 * Props: value, onChange, label, options (array)
 */
export default function CropSelector({ value, onChange, label = "Select", options = ["Wheat", "Rice", "Maize"] }) {
    return (
        <div>
            <label className="text-xs text-white/70 block mb-1">{label}</label>
            <select
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                className="rounded-lg bg-white/5 border border-white/8 px-3 py-2 focus:outline-none"
            >
                <option value="" disabled>
                    Choose
                </option>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}

import React from "react";

/**
 * Small loading indicator used inline.
 */
export default function LoadingDots({ className = "" }) {
    return (
        <div className={"flex items-center gap-1 " + className} aria-hidden>
            <span className="w-2 h-2 rounded-full bg-white/85 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse delay-75" />
            <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse delay-150" />
        </div>
    );
}

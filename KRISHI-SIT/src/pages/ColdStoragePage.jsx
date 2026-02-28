import React, { useState } from "react";
import ColdStorage from "./ColdStorage";
import Godown from "./Godown";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "560px", h: "560px", top: "-18%", left: "-12%", bg: "radial-gradient(circle,rgba(34,197,94,0.09) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "400px", h: "400px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(99,220,255,0.07) 0%,transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
            { w: "280px", h: "280px", top: "28%", left: "44%", bg: "radial-gradient(circle,rgba(251,191,36,0.05) 0%,transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
            { w: "220px", h: "220px", bottom: "5%", left: "8%", bg: "radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite reverse" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(28)].map((_, i) => (
            <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: `rgba(${i % 2 === 0 ? "99,220,255" : "52,211,153"},${Math.random() * 0.08 + 0.03})`,
                width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
            }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.10),transparent)", animation: "scanLine 12s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
    { key: "cold", icon: "❄️", label: "Cold Storages", color: "#63dcff", desc: "Refrigerated storage centers" },
    { key: "godown", icon: "🏭", label: "Godowns", color: "#fbbf24", desc: "Warehouses across India" },
];

// ── Main wrapper ──────────────────────────────────────────────────────────────
export default function ColdStoragePage() {
    const [tab, setTab] = useState("cold");
    const activeTab = TABS.find(t => t.key === tab);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn   { from { opacity:0; transform:translateY(-22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn   { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes tabFadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        @keyframes skeletonPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.65; } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #0a1a0d; color: #fff; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 80px" }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: "44px", animation: "heroIn 0.7s both ease" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "20px" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Storage Infrastructure · India</span>
                        </div>

                        <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px,5vw,52px)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: 1.0 }}>
                            Cold Storage &{" "}
                            <span style={{ background: "linear-gradient(90deg,#63dcff,#34d399,#fbbf24)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                                Warehouses
                            </span>
                        </h1>

                        <p style={{ margin: "0 auto", maxWidth: "500px", fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
                            Discover refrigerated cold storage centers and agricultural warehouses across India for smarter produce management.
                        </p>
                    </div>

                    {/* ── Tab switcher ── */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
                        <div style={{ display: "inline-flex", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "6px", backdropFilter: "blur(16px)" }}>
                            {TABS.map(t => {
                                const isActive = tab === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => setTab(t.key)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "8px",
                                            padding: "12px 24px", borderRadius: "12px",
                                            border: `1px solid ${isActive ? `${t.color}45` : "transparent"}`,
                                            background: isActive ? `${t.color}18` : "transparent",
                                            color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                                            fontSize: "14px", fontWeight: "800", fontFamily: "inherit",
                                            cursor: "pointer", transition: "all 0.25s",
                                            boxShadow: isActive ? `0 4px 18px ${t.color}28` : "none",
                                            position: "relative",
                                        }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; } }}
                                    >
                                        <span style={{ fontSize: "18px" }}>{t.icon}</span>
                                        <span>{t.label}</span>
                                        {isActive && (
                                            <span style={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", borderRadius: "99px", background: t.color, opacity: 0.8 }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active tab color bar */}
                    <div style={{ height: "2px", borderRadius: "99px", background: `linear-gradient(90deg,transparent,${activeTab.color}60,transparent)`, marginBottom: "32px", transition: "background 0.35s" }} />

                    {/* ── Active tab header ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", animation: "tabFadeIn 0.4s both ease" }} key={tab + "_header"}>
                        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${activeTab.color}10`, border: `1px solid ${activeTab.color}28`, borderRadius: "99px", padding: "4px 14px" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: activeTab.color, display: "inline-block", boxShadow: `0 0 6px ${activeTab.color}` }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: activeTab.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{activeTab.desc}</span>
                        </div>
                        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
                    </div>

                    {/* ── Tab content ── */}
                    <div key={tab} style={{ animation: "tabFadeIn 0.4s both ease" }}>
                        {tab === "cold" && <ColdStorage />}
                        {tab === "godown" && <Godown />}
                    </div>

                </div>
            </div>
        </>
    );
}
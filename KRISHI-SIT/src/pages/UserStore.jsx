import React, { useState } from "react";
import CategorySelector from "../components/CategorySelector";
import CropPage from "./CropPage";
import VegetablesPage from "./VegetablePages";
import FruitPage from "./FruitPage";
import PulsesPage from "./PulsesPage";

// ── Animated background ────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "560px", h: "560px", top: "-18%", left: "-12%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "420px", h: "420px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
            { w: "300px", h: "300px", top: "28%", left: "42%", bg: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
            { w: "220px", h: "220px", bottom: "5%", left: "10%", bg: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite reverse" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(32)].map((_, i) => (
            <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: `rgba(52,211,153,${Math.random() * 0.12 + 0.03})`,
                width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
            }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.10), transparent)", animation: "scanLine 12s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Category tab config ────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: "Crops", icon: "🌾", label: "Crops", color: "#34d399", desc: "Rice, Wheat & more" },
    { key: "Vegetables", icon: "🥦", label: "Vegetables", color: "#86efac", desc: "Seasonal & fresh" },
    { key: "Fruits", icon: "🍎", label: "Fruits", color: "#f9a8d4", desc: "Farm-picked daily" },
    { key: "Pulses", icon: "🫘", label: "Pulses", color: "#fcd34d", desc: "Lentils, Dals & more" },
];

// ── Custom category tab nav ────────────────────────────────────────────────────
const CategoryNav = ({ active, setActive }) => (
    <div style={{
        position: "sticky", top: "68px", zIndex: 10,
        background: "rgba(2,12,6,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(52,211,153,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
        {/* Top accent line */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 28px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>

                {/* Section label */}
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.45)", marginRight: "6px", whiteSpace: "nowrap" }}>
                    Category
                </span>

                {CATEGORIES.map((cat) => {
                    const isActive = active === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActive(cat.key)}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "10px 18px", borderRadius: "14px",
                                border: `1px solid ${isActive ? `${cat.color}40` : "rgba(255,255,255,0.08)"}`,
                                background: isActive ? `${cat.color}18` : "rgba(255,255,255,0.04)",
                                color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                                fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
                                cursor: "pointer", letterSpacing: "0.3px",
                                boxShadow: isActive ? `0 4px 18px ${cat.color}30` : "none",
                                transition: "all 0.22s ease",
                                position: "relative",
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.color = "#fff";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                }
                            }}
                        >
                            <span style={{ fontSize: "17px" }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                            {isActive && (
                                <span style={{
                                    position: "absolute", bottom: "4px", left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "16px", height: "2px", borderRadius: "99px",
                                    background: cat.color, opacity: 0.8,
                                }} />
                            )}
                        </button>
                    );
                })}

                {/* Active category info pill */}
                {(() => {
                    const cat = CATEGORIES.find(c => c.key === active);
                    return (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: `${cat.color}10`, border: `1px solid ${cat.color}25`, borderRadius: "99px", padding: "5px 14px", animation: "fadeIn 0.3s both ease" }}>
                            <span style={{ fontSize: "14px" }}>{cat.icon}</span>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: cat.color }}>{cat.desc}</span>
                        </div>
                    );
                })()}
            </div>
        </div>

        {/* Active tab color bar */}
        {(() => {
            const cat = CATEGORIES.find(c => c.key === active);
            return <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${cat.color}60, transparent)`, transition: "background 0.3s" }} />;
        })()}
    </div>
);

// ── Page wrapper ───────────────────────────────────────────────────────────────
const PageWrapper = ({ children, categoryKey }) => (
    <div
        key={categoryKey}
        style={{ animation: "tabFadeIn 0.4s both ease", minHeight: "calc(100vh - 140px)" }}
    >
        {children}
    </div>
);

// ── Hero strip ─────────────────────────────────────────────────────────────────
const HeroStrip = ({ active }) => {
    const cat = CATEGORIES.find(c => c.key === active);
    return (
        <div style={{
            maxWidth: "1200px", margin: "0 auto",
            padding: "48px 28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "20px",
            animation: "heroIn 0.6s both ease",
        }}>
            <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cat.color, display: "inline-block", boxShadow: `0 0 8px ${cat.color}`, animation: "pulseDot 2s infinite" }} />
                    <span style={{ fontSize: "11px", fontWeight: "700", color: cat.color, letterSpacing: "2px", textTransform: "uppercase" }}>Farm Fresh · {cat.label}</span>
                </div>
                <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px,4vw,44px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.05 }}>
                    Fresh <span style={{ color: cat.color }}>{cat.label}</span>
                    <span style={{ display: "block", fontSize: "clamp(14px,2vw,18px)", fontWeight: "400", color: "rgba(255,255,255,0.4)", letterSpacing: "0px", fontFamily: "'DM Sans',sans-serif", marginTop: "6px" }}>
                        Sourced directly from verified farmers near you.
                    </span>
                </h1>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                    { icon: "✅", label: "Verified Farmers" },
                    { icon: "🚚", label: "Same-Day Delivery" },
                    { icon: "🌱", label: "100% Natural" },
                ].map((s) => (
                    <div key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "7px 14px", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)" }}>
                        {s.icon} {s.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const FarmerUserStore = () => {
    const [active, setActive] = useState("Crops");

    const renderPage = () => {
        switch (active) {
            case "Crops": return <CropPage />;
            case "Vegetables": return <VegetablesPage />;
            case "Fruits": return <FruitPage />;
            case "Pulses": return <PulsesPage />;
            default: return <CropPage />;
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn    { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tabFadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes pulseDot  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes scanLine  { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.28); border-radius: 99px; }
      `}</style>

            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #020c06 0%, #041510 40%, #030d08 100%)",
                fontFamily: "'Syne', 'Segoe UI', sans-serif",
                color: "#fff",
                position: "relative",
            }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Sticky category nav */}
                    <CategoryNav active={active} setActive={setActive} />

                    {/* Hero strip — updates per category */}
                    <HeroStrip active={active} key={active + "_hero"} />

                    {/* Divider */}
                    <div style={{ maxWidth: "1200px", margin: "0 auto 8px", padding: "0 28px" }}>
                        <div style={{ height: "1px", background: "rgba(52,211,153,0.10)" }} />
                    </div>

                    {/* Page content */}
                    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 28px 80px" }}>
                        <PageWrapper key={active} categoryKey={active}>
                            {renderPage()}
                        </PageWrapper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FarmerUserStore;
import React, { useState, useEffect } from "react";
import GlassCard from "../components/ui/GlassCard";
import CropSelector from "../components/irrigation/CropSelector";
import DayCard from "../components/irrigation/DayCard";
import { fetchIrrigationSchedule } from "../api/mockApi";

// ── Animated background ────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "580px", h: "580px", top: "-18%", left: "-12%", bg: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "400px", h: "400px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 65%)", anim: "orbFloat2 26s ease-in-out infinite" },
            { w: "280px", h: "280px", top: "28%", left: "42%", bg: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
            { w: "220px", h: "220px", bottom: "6%", left: "12%", bg: "radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 65%)", anim: "orbFloat1 19s ease-in-out infinite reverse" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(50)].map((_, i) => (
            <div key={i} style={{
                position: "absolute",
                borderRadius: Math.random() > 0.5 ? "50% 50% 50% 0" : "50%",
                background: `rgba(${Math.random() > 0.5 ? "56,189,248" : "14,165,233"},${Math.random() * 0.18 + 0.04})`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `particleFall ${5 + Math.random() * 8}s ${Math.random() * 6}s ease-in-out infinite alternate`,
            }} />
        ))}
        {[{ top: "20%", left: "75%" }, { top: "70%", left: "20%" }].map((pos, i) => (
            <div key={i} style={{ position: "absolute", ...pos }}>
                {[0, 1, 2].map(r => (
                    <div key={r} style={{ position: "absolute", borderRadius: "50%", border: "1px solid rgba(56,189,248,0.10)", width: `${80 + r * 60}px`, height: `${80 + r * 60}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `ripple 3s ${r * 1}s ease-out infinite` }} />
                ))}
            </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.13), transparent)", animation: "scanLine 9s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
    </div>
));

// ── Shared atoms ───────────────────────────────────────────────────────────────
const SectionDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ height: "1px", flex: 1, background: "rgba(56,189,248,0.18)" }} />
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(56,189,248,0.55)" }}>{label}</span>
        <div style={{ height: "1px", flex: 1, background: "rgba(56,189,248,0.18)" }} />
    </div>
);

const StatusBadge = ({ children, color = "#38bdf8" }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: `${color}18`, border: `1px solid ${color}35`,
        borderRadius: "99px", padding: "3px 12px",
        fontSize: "11px", fontWeight: "700", color, letterSpacing: "1px", textTransform: "uppercase",
    }}>
        {children}
    </span>
);

const Panel = ({ children, accent = false, style: extraStyle = {} }) => (
    <div style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accent ? "rgba(56,189,248,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "24px",
        padding: "28px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.4s",
        ...extraStyle,
    }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: accent ? "linear-gradient(90deg, transparent, rgba(56,189,248,0.55), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }} />
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        {children}
    </div>
);

// ── Land size options ──────────────────────────────────────────────────────────
const LAND_OPTIONS = [
    { label: "0.5 Acres", value: "0.5" },
    { label: "1 Acre", value: "1" },
    { label: "2 Acres", value: "2" },
    { label: "3 Acres", value: "3" },
    { label: "5 Acres", value: "5" },
    { label: "10 Acres", value: "10" },
    { label: "20 Acres", value: "20" },
    { label: "50 Acres", value: "50" },
    { label: "100 Acres", value: "100" },
];

// ── Styled select — supports plain string[] OR { label, value }[] ──────────────
const StyledSelect = ({ label, value, onChange, options }) => {
    const [focused, setFocused] = useState(false);

    // Normalise options to always be { label, value }
    const normalised = options.map(o =>
        typeof o === "string" ? { label: o, value: o } : o
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "160px" }}>
            <label style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(56,189,248,0.55)" }}>{label}</label>
            <div style={{ position: "relative" }}>
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        borderRadius: "14px",
                        border: `1.5px solid ${focused ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.12)"}`,
                        background: "rgba(255,255,255,0.06)",
                        color: value ? "#fff" : "rgba(255,255,255,0.35)",
                        fontSize: "14px",
                        fontWeight: "600",
                        fontFamily: "inherit",
                        outline: "none",
                        backdropFilter: "blur(10px)",
                        cursor: "pointer",
                        appearance: "none",
                        WebkitAppearance: "none",
                        transition: "border-color 0.2s, background 0.2s",
                    }}
                >
                    <option value="" style={{ background: "#0c1a2e", color: "rgba(255,255,255,0.5)" }}>Select {label}</option>
                    {normalised.map(o => (
                        <option key={o.value} value={o.value} style={{ background: "#0c1a2e", color: "#fff" }}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "rgba(56,189,248,0.6)", pointerEvents: "none" }}>▾</span>
            </div>
        </div>
    );
};

// ── Animated day card wrapper ──────────────────────────────────────────────────
const AnimatedDay = ({ children, index }) => (
    <div style={{ animation: `dayCardIn 0.45s ${index * 70}ms both ease` }}>
        {children}
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function IrrigationScheduler() {
    const [crop, setCrop] = useState("");
    const [soil, setSoil] = useState("");
    const [land, setLand] = useState("");          // stored as string e.g. "2"
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [genCount, setGenCount] = useState(0);
    const [time, setTime] = useState(new Date());
    const [totalWater, setTotalWater] = useState(null);

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // Derive display label from value
    const landLabel = land
        ? LAND_OPTIONS.find(o => o.value === land)?.label ?? `${land} Acres`
        : "";

    const load = async (c, s, l) => {
        if (!c || !s || !l) return;
        setLoading(true);
        setSchedule(null);
        setTotalWater(null);
        try {
            const res = await fetchIrrigationSchedule({ crop: c, soil: s, landAcres: parseFloat(l) });
            setSchedule(res);
            setGenCount(n => n + 1);
            const total = res.reduce((acc, d) => acc + (d.waterMm || d.water_mm || d.amount || 0), 0);
            if (total > 0) setTotalWater(total);
        } catch (err) {
            setSchedule(null);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(crop, soil, land); }, [crop, soil, land]);

    const allSelected = crop && soil && land;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #020810 0%, #041525 42%, #020c1a 100%)",
            fontFamily: "'Syne', 'Segoe UI', sans-serif",
            position: "relative",
            color: "#fff",
        }}>
            <Particles />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "1180px", margin: "0 auto", padding: "44px 24px 72px" }}>

                {/* ── Page header ── */}
                <div style={{ marginBottom: "36px", animation: "headerIn 0.8s both ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#38bdf8", display: "inline-block", boxShadow: "0 0 8px #38bdf8", animation: "pulseDot 2s infinite" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", letterSpacing: "2px", textTransform: "uppercase" }}>Smart Scheduling · Active</span>
                            </div>
                            <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,4.5vw,48px)", fontWeight: "800", lineHeight: 1.05, letterSpacing: "-1px" }}>
                                Irrigation
                                <span style={{ display: "block", background: "linear-gradient(90deg, #38bdf8, #7dd3fc, #bae6fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    Scheduler
                                </span>
                            </h1>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: "15px", maxWidth: "440px", lineHeight: 1.65 }}>
                                Select your crop, soil type, and land size to auto-generate an optimised 7-day irrigation schedule tailored to your field.
                            </p>
                        </div>

                        {/* Clock + badge */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "1.5px" }}>
                                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                </div>
                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.5px" }}>
                                    {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                                </div>
                            </div>
                            {genCount > 0 && (
                                <StatusBadge color="#38bdf8">
                                    ✓ {genCount} {genCount === 1 ? "Schedule" : "Schedules"} generated
                                </StatusBadge>
                            )}
                        </div>
                    </div>

                    {/* Metric chips */}
                    <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {[
                            { icon: "🌾", label: "Crops Supported", value: "4+" },
                            { icon: "🪨", label: "Soil Types", value: "4" },
                            { icon: "📐", label: "Land Sizes", value: "9" },
                            { icon: "📅", label: "Schedule Length", value: "7 Days" },
                            { icon: "💧", label: "Water Saved (avg)", value: "~18%" },
                        ].map((m, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "14px", padding: "10px 16px",
                                animation: `headerIn 0.6s ${200 + i * 80}ms both ease`,
                                transition: "border-color 0.2s, background 0.2s",
                                cursor: "default",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.28)"; e.currentTarget.style.background = "rgba(56,189,248,0.07)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                            >
                                <span style={{ fontSize: "18px" }}>{m.icon}</span>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8" }}>{m.value}</div>
                                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.5px" }}>{m.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Controls panel ── */}
                <div style={{ animation: "panelIn 0.7s 120ms both ease", marginBottom: "24px" }}>
                    <Panel accent={!!allSelected}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                            {/* Top row — title + selects */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-end", justifyContent: "space-between" }}>
                                <div>
                                    <SectionDivider label="Configuration" />
                                    <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: 1.5, maxWidth: "320px" }}>
                                        Choose your crop, soil type, and land size. A 7-day schedule generates automatically.
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                    <StyledSelect
                                        label="Crop"
                                        value={crop}
                                        onChange={setCrop}
                                        options={["Wheat", "Rice", "Maize", "Cotton"]}
                                    />
                                    <StyledSelect
                                        label="Soil Type"
                                        value={soil}
                                        onChange={setSoil}
                                        options={["Loamy", "Sandy", "Clayey", "Silty"]}
                                    />
                                    {/* ✅ Land size — uses normalised { label, value } options */}
                                    <StyledSelect
                                        label="Land Size"
                                        value={land}
                                        onChange={setLand}
                                        options={LAND_OPTIONS}
                                    />
                                </div>
                            </div>

                            {/* Selection summary pills */}
                            {(crop || soil || land) && (
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", animation: "fadeIn 0.3s both ease" }}>
                                    {crop && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "99px", padding: "5px 14px", fontSize: "12px", fontWeight: "700", color: "#7dd3fc" }}>
                                            🌾 {crop}
                                        </div>
                                    )}
                                    {soil && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "99px", padding: "5px 14px", fontSize: "12px", fontWeight: "700", color: "#7dd3fc" }}>
                                            🪨 {soil}
                                        </div>
                                    )}
                                    {land && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)", borderRadius: "99px", padding: "5px 14px", fontSize: "12px", fontWeight: "700", color: "#7dd3fc" }}>
                                            📐 {landLabel}
                                        </div>
                                    )}
                                    {allSelected && !loading && schedule && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: "99px", padding: "5px 14px", fontSize: "12px", fontWeight: "700", color: "#6ee7b7" }}>
                                            ✓ Schedule ready
                                        </div>
                                    )}
                                    {totalWater > 0 && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", borderRadius: "99px", padding: "5px 14px", fontSize: "12px", fontWeight: "700", color: "#7dd3fc" }}>
                                            💧 {totalWater} mm total
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Panel>
                </div>

                {/* ── Schedule area ── */}
                <div style={{ animation: "panelIn 0.7s 200ms both ease" }}>

                    {/* Loading */}
                    {loading && (
                        <Panel>
                            <div style={{ padding: "28px 0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "28px" }}>
                                    <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(56,189,248,0.12)" }} />
                                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#38bdf8", animation: "spin 0.9s linear infinite" }} />
                                        <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(56,189,248,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
                                        <div style={{ position: "absolute", inset: "19px", borderRadius: "50%", background: "rgba(56,189,248,0.15)" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Generating schedule…</div>
                                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: "4px" }}>
                                            Optimising irrigation for {crop} on {soil} soil · {landLabel}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px" }}>
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} style={{ height: "130px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", animation: `skeletonPulse 1.4s ${i * 120}ms ease-in-out infinite` }} />
                                    ))}
                                </div>
                            </div>
                        </Panel>
                    )}

                    {/* Empty — nothing selected yet */}
                    {!loading && !schedule && !allSelected && !crop && !soil && !land && (
                        <Panel>
                            <div style={{ textAlign: "center", padding: "60px 24px" }}>
                                <div style={{ fontSize: "60px", marginBottom: "18px", opacity: 0.5 }}>💧</div>
                                <div style={{ fontSize: "17px", fontWeight: "700", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>Select crop, soil & land size to begin</div>
                                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.7, maxWidth: "340px", margin: "0 auto" }}>
                                    Use the dropdowns above to choose your crop type, soil composition, and land size in acres. Your 7-day irrigation plan generates instantly.
                                </div>
                            </div>
                        </Panel>
                    )}

                    {/* Partially selected — waiting */}
                    {!loading && !schedule && !allSelected && (crop || soil || land) && (
                        <Panel>
                            <div style={{ textAlign: "center", padding: "40px 24px" }}>
                                <div style={{ fontSize: "40px", marginBottom: "14px" }}>⏳</div>
                                <div style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.45)" }}>
                                    {!crop ? "Select a crop" : !soil ? "Select a soil type" : "Select a land size"}
                                </div>
                            </div>
                        </Panel>
                    )}

                    {/* Schedule grid */}
                    {!loading && schedule && (
                        <div>
                            <SectionDivider label={`7-Day Schedule · ${crop} · ${soil} Soil · ${landLabel}`} />
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "14px" }}>
                                {schedule.map((d, idx) => (
                                    <AnimatedDay key={d.day} index={idx}>
                                        <DayCard day={d} index={idx} />
                                    </AnimatedDay>
                                ))}
                            </div>

                            {/* Summary footer */}
                            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                                {[
                                    { icon: "📋", text: "7 days planned" },
                                    { icon: "📐", text: `${landLabel} field` },
                                    { icon: "🌡️", text: "Temperature-adjusted" },
                                    { icon: "🔄", text: "Auto-updates on change" },
                                    { icon: "✅", text: "Field-ready output" },
                                ].map((t, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.04)", borderRadius: "99px", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                                        <span>{t.icon}</span> {t.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Keyframes ── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes headerIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dayCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 7px #38bdf8; }
          50%       { opacity: 0.4; box-shadow: 0 0 18px #38bdf8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.75; }
        }
        @keyframes scanLine {
          from { top: -2px; }
          to   { top: 100%; }
        }
        @keyframes ripple {
          0%   { transform: translate(-50%,-50%) scale(0.4); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(30px,-20px) scale(1.05); }
          66%       { transform: translate(-14px,24px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-22px,18px) scale(1.04); }
          66%       { transform: translate(20px,-28px) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(14px,-14px) scale(1.06); }
        }
        @keyframes particleFall {
          from { transform: translateY(0) translateX(0); opacity: 0.06; }
          to   { transform: translateY(25px) translateX(-8px); opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.28); border-radius: 99px; }
        select option { background: #0c1a2e; }
      `}</style>
        </div>
    );
}
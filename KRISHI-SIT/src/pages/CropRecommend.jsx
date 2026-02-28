import React, { useState, useEffect, useRef } from "react";
import CropForm from "../components/crop/CropForm";
import CropResultCard from "../components/crop/CropResultCard";
import GlassCard from "../components/ui/GlassCard";
import { fetchCropRecommendations } from "../api/mockApi";

// ── Animated particle field ────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Organic floating orbs */}
        {[
            { w: "520px", h: "520px", top: "-12%", left: "-8%", bg: "radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 65%)", anim: "orbFloat1 18s ease-in-out infinite" },
            { w: "400px", h: "400px", top: "55%", right: "-5%", bg: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)", anim: "orbFloat2 22s ease-in-out infinite" },
            { w: "320px", h: "320px", top: "30%", left: "40%", bg: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 65%)", anim: "orbFloat3 26s ease-in-out infinite" },
            { w: "240px", h: "240px", bottom: "5%", left: "15%", bg: "radial-gradient(circle, rgba(52,211,153,0.09) 0%, transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite reverse" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {/* Fine grain dots */}
        {[...Array(40)].map((_, i) => (
            <div key={i} style={{
                position: "absolute",
                borderRadius: "50%",
                background: `rgba(${Math.random() > 0.5 ? "52,211,153" : "255,255,255"},${Math.random() * 0.25 + 0.05})`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 6}s ease-in-out infinite alternate`,
            }} />
        ))}
        {/* Horizontal scan line */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.15), transparent)", animation: "scanLine 8s linear infinite" }} />
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
    </div>
));

// ── Result card wrapper ────────────────────────────────────────────────────────
const AnimatedResult = ({ children, index }) => (
    <div style={{ animation: `resultSlide 0.5s ${index * 100}ms both ease` }}>
        {children}
    </div>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ children, color = "#34d399" }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: `${color}18`, border: `1px solid ${color}35`,
        borderRadius: "99px", padding: "3px 11px",
        fontSize: "11px", fontWeight: "700", color, letterSpacing: "1px", textTransform: "uppercase",
    }}>
        {children}
    </span>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 16px" }}>
        <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.15)" }} />
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.5)" }}>{label}</span>
        <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.15)" }} />
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CropRecommendation() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const [time, setTime] = useState(new Date());
    const resultsRef = useRef(null);

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const onSubmit = async (payload) => {
        setLoading(true);
        setResults(null);
        setSubmitCount(c => c + 1);
        try {
            const res = await fetchCropRecommendations(payload);
            setResults(res);
            // Scroll to results on mobile
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err) {
            setResults([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #020c06 0%, #041510 40%, #021008 100%)",
            fontFamily: "'Syne', 'Segoe UI', sans-serif",
            position: "relative",
            color: "#fff",
        }}>
            <Particles />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "44px 24px 72px" }}>

                {/* ── Page header ── */}
                <div style={{ marginBottom: "48px", animation: "headerIn 0.8s both ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>AI-Powered Analysis</span>
                            </div>

                            <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px,4.5vw,48px)", fontWeight: "800", lineHeight: 1.05, letterSpacing: "-1px" }}>
                                Crop Recommendation
                                <span style={{ display: "block", background: "linear-gradient(90deg, #34d399, #6ee7b7, #a7f3d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    Intelligence
                                </span>
                            </h1>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "15px", maxWidth: "480px", lineHeight: 1.6 }}>
                                Enter your soil and environmental parameters to receive AI-curated crop recommendations optimised for your conditions.
                            </p>
                        </div>

                        {/* Live clock + stats */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "1.5px" }}>
                                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                </div>
                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>
                                    {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                                </div>
                            </div>
                            {submitCount > 0 && (
                                <StatusBadge color="#34d399">
                                    <span>✓</span> {submitCount} {submitCount === 1 ? "Analysis" : "Analyses"} run
                                </StatusBadge>
                            )}
                        </div>
                    </div>

                    {/* Metric bar */}
                    <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {[
                            { icon: "🌱", label: "Crops Supported", value: "22+" },
                            { icon: "🧪", label: "Soil Parameters", value: "7" },
                            { icon: "⚡", label: "Model Accuracy", value: "94.2%" },
                            { icon: "🌍", label: "Climate Zones", value: "12" },
                        ].map((m, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "14px", padding: "10px 16px",
                                animation: `headerIn 0.6s ${200 + i * 80}ms both ease`,
                                transition: "border-color 0.2s, background 0.2s",
                                cursor: "default",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; e.currentTarget.style.background = "rgba(52,211,153,0.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                            >
                                <span style={{ fontSize: "18px" }}>{m.icon}</span>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#34d399" }}>{m.value}</div>
                                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.5px" }}>{m.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>

                    {/* Left — form panel */}
                    <div style={{ animation: "panelIn 0.7s 100ms both ease" }}>
                        <div style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(52,211,153,0.15)",
                            borderRadius: "24px",
                            padding: "28px",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            {/* Card accent glow */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
                            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

                            <SectionDivider label="Input Parameters" />
                            <CropForm onSubmit={onSubmit} />
                        </div>
                    </div>

                    {/* Right — results panel */}
                    <div ref={resultsRef} style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "panelIn 0.7s 200ms both ease" }}>

                        {/* Results card */}
                        <div style={{
                            background: "rgba(255,255,255,0.04)",
                            border: `1px solid ${results && results.length > 0 ? "rgba(52,211,153,0.20)" : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "24px",
                            padding: "28px",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                            transition: "border-color 0.5s",
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: results && results.length > 0 ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <div>
                                    <SectionDivider label="Recommendations" />
                                </div>
                                {results && results.length > 0 && (
                                    <StatusBadge color="#34d399">
                                        {results.length} crops found
                                    </StatusBadge>
                                )}
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div style={{ padding: "20px 0" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                                        <div style={{ position: "relative", width: "48px", height: "48px", flexShrink: 0 }}>
                                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.15)" }} />
                                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                                            <div style={{ position: "absolute", inset: "8px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.4)", animation: "spin 1.5s linear infinite reverse" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Analysing conditions…</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>Running AI model against your parameters</div>
                                        </div>
                                    </div>
                                    {/* Skeleton rows */}
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} style={{ height: "68px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", marginBottom: "10px", animation: `skeletonPulse 1.4s ${i * 200}ms ease-in-out infinite` }} />
                                    ))}
                                </div>
                            )}

                            {/* Empty state — no query yet */}
                            {!loading && !results && (
                                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                                    <div style={{ fontSize: "52px", marginBottom: "16px", opacity: 0.6 }}>🌾</div>
                                    <div style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Ready to analyse</div>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Fill in the soil and climate parameters on the left and hit <strong style={{ color: "rgba(52,211,153,0.7)" }}>Analyse</strong> to get your recommendations.</div>
                                </div>
                            )}

                            {/* Empty results */}
                            {!loading && results && results.length === 0 && (
                                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                                    <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔍</div>
                                    <div style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>No crops matched</div>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Try adjusting your parameters and running the analysis again.</div>
                                </div>
                            )}

                            {/* Results list */}
                            {!loading && results && results.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {results.map((r, i) => (
                                        <AnimatedResult key={r.name + i} index={i}>
                                            <CropResultCard crop={r} index={i + 1} />
                                        </AnimatedResult>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notes / info card */}
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "20px",
                            padding: "22px 24px",
                            backdropFilter: "blur(12px)",
                            animation: "panelIn 0.7s 320ms both ease",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                                <span style={{ fontSize: "16px" }}>💡</span>
                                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Notes</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {[
                                    "Mock results are illustrative — replace with your real model endpoint for production use.",
                                    "Confidence scores in each card reflect model certainty for your specific input set.",
                                ].map((note, i) => (
                                    <div key={i} style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                                        <span style={{ color: "rgba(52,211,153,0.5)", flexShrink: 0, marginTop: "1px" }}>›</span>
                                        {note}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Global keyframes ── */}
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
        @keyframes resultSlide {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #34d399; }
          50%       { opacity: 0.4; box-shadow: 0 0 16px #34d399; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
        @keyframes scanLine {
          from { top: -2px; }
          to   { top: 100%; }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.05); }
          66%       { transform: translate(-15px, 25px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-25px, 20px) scale(1.04); }
          66%       { transform: translate(20px, -30px) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(15px, -15px) scale(1.06); }
        }
        @keyframes particleDrift {
          from { transform: translateY(0) translateX(0); opacity: 0.1; }
          to   { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.25); border-radius: 99px; }
      `}</style>
        </div>
    );
}
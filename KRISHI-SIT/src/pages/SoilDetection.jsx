import React, { useState, useEffect } from "react";
import SoilUploader from "../components/soil/SoilUploader";
import SoilResultCard from "../components/soil/SoilResultCard";
import { detectSoilFromImage } from "../api/mockApi";

// ── Animated background ────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Breathing orbs — earthy amber/brown/terracotta palette */}
        {[
            { w: "560px", h: "560px", top: "-15%", left: "-10%", bg: "radial-gradient(circle, rgba(180,83,9,0.12) 0%, transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite" },
            { w: "380px", h: "380px", top: "60%", right: "-6%", bg: "radial-gradient(circle, rgba(217,119,6,0.10) 0%, transparent 65%)", anim: "orbFloat2 25s ease-in-out infinite" },
            { w: "300px", h: "300px", top: "25%", left: "45%", bg: "radial-gradient(circle, rgba(120,53,15,0.09) 0%, transparent 65%)", anim: "orbFloat3 28s ease-in-out infinite" },
            { w: "220px", h: "220px", bottom: "8%", left: "10%", bg: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)", anim: "orbFloat1 18s ease-in-out infinite reverse" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}

        {/* Soil-toned floating particles */}
        {[...Array(45)].map((_, i) => (
            <div key={i} style={{
                position: "absolute",
                borderRadius: Math.random() > 0.6 ? "2px" : "50%",
                background: `rgba(${Math.random() > 0.5 ? "217,119,6" : "180,83,9"},${Math.random() * 0.2 + 0.05})`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `particleDrift ${7 + Math.random() * 9}s ${Math.random() * 6}s ease-in-out infinite alternate`,
            }} />
        ))}

        {/* Subtle scan line */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(217,119,6,0.12), transparent)", animation: "scanLine 10s linear infinite" }} />

        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(180,83,9,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180,83,9,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
    </div>
));

// ── Shared UI atoms ────────────────────────────────────────────────────────────
const SectionDivider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ height: "1px", flex: 1, background: "rgba(217,119,6,0.18)" }} />
        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(217,119,6,0.55)" }}>{label}</span>
        <div style={{ height: "1px", flex: 1, background: "rgba(217,119,6,0.18)" }} />
    </div>
);

const StatusBadge = ({ children, color = "#f59e0b" }) => (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: `${color}18`, border: `1px solid ${color}35`,
        borderRadius: "99px", padding: "3px 12px",
        fontSize: "11px", fontWeight: "700", color, letterSpacing: "1px", textTransform: "uppercase",
    }}>
        {children}
    </span>
);

// ── Panel card wrapper ─────────────────────────────────────────────────────────
const Panel = ({ children, accent = false, style = {} }) => (
    <div style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accent ? "rgba(217,119,6,0.22)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "24px",
        padding: "28px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.4s",
        ...style,
    }}>
        {/* Top edge glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: accent ? "linear-gradient(90deg, transparent, rgba(217,119,6,0.55), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }} />
        {/* Corner ambient */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        {children}
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SoilDetection() {
    const [result, setResult] = useState(null);
    const [detecting, setDetecting] = useState(false);
    const [scanCount, setScanCount] = useState(0);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const handleDetect = (res) => {
        setResult(res);
        setScanCount(c => c + 1);
        setDetecting(false);
    };

    const handleDetecting = () => {
        setDetecting(true);
        setResult(null);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #0a0500 0%, #150a02 40%, #0d0601 100%)",
            fontFamily: "'Syne', 'Segoe UI', sans-serif",
            position: "relative",
            color: "#fff",
        }}>
            <Particles />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "1160px", margin: "0 auto", padding: "44px 24px 72px" }}>

                {/* ── Page header ── */}
                <div style={{ marginBottom: "48px", animation: "headerIn 0.8s both ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>

                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.10)", border: "1px solid rgba(217,119,6,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", display: "inline-block", boxShadow: "0 0 8px #f59e0b", animation: "pulseDot 2s infinite" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", letterSpacing: "2px", textTransform: "uppercase" }}>Vision AI · Active</span>
                            </div>

                            <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,4.5vw,48px)", fontWeight: "800", lineHeight: 1.05, letterSpacing: "-1px" }}>
                                Soil Type
                                <span style={{ display: "block", background: "linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    Detection
                                </span>
                            </h1>
                            <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: "15px", maxWidth: "440px", lineHeight: 1.65 }}>
                                Upload a soil image and our computer vision model will classify the soil type, texture, and composition to guide better farming decisions.
                            </p>
                        </div>

                        {/* Clock + scan counter */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "1.5px" }}>
                                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                </div>
                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.5px" }}>
                                    {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                                </div>
                            </div>
                            {scanCount > 0 && (
                                <StatusBadge color="#f59e0b">
                                    ✓ {scanCount} {scanCount === 1 ? "Scan" : "Scans"} completed
                                </StatusBadge>
                            )}
                        </div>
                    </div>

                    {/* Metric chips */}
                    <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {[
                            { icon: "🪨", label: "Soil Classes", value: "12+" },
                            { icon: "🔬", label: "Texture Analysis", value: "3-tier" },
                            { icon: "⚡", label: "Detection Speed", value: "< 2 sec" },
                            { icon: "🎯", label: "Model Accuracy", value: "96.8%" },
                        ].map((m, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "14px", padding: "10px 16px",
                                animation: `headerIn 0.6s ${200 + i * 80}ms both ease`,
                                transition: "border-color 0.2s, background 0.2s",
                                cursor: "default",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.28)"; e.currentTarget.style.background = "rgba(217,119,6,0.07)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                            >
                                <span style={{ fontSize: "18px" }}>{m.icon}</span>
                                <div>
                                    <div style={{ fontSize: "15px", fontWeight: "800", color: "#f59e0b" }}>{m.value}</div>
                                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.5px" }}>{m.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>

                    {/* Left — uploader panel */}
                    <div style={{ animation: "panelIn 0.7s 100ms both ease" }}>
                        <Panel accent={detecting}>
                            <SectionDivider label="Upload Soil Image" />
                            <SoilUploader
                                detectFn={detectSoilFromImage}
                                onDetect={handleDetect}
                                onDetecting={handleDetecting}
                            />
                        </Panel>

                        {/* How it works */}
                        <div style={{
                            marginTop: "18px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "20px",
                            padding: "22px 24px",
                            backdropFilter: "blur(12px)",
                            animation: "panelIn 0.7s 280ms both ease",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                <span style={{ fontSize: "15px" }}>🗺️</span>
                                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(217,119,6,0.55)" }}>How It Works</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    { step: "01", label: "Upload", desc: "Take or upload a clear photo of your soil sample." },
                                    { step: "02", label: "Detect", desc: "Vision AI classifies type, texture, and properties." },
                                    { step: "03", label: "Act", desc: "Use insights to select the right crops and amendments." },
                                ].map((s, i) => (
                                    <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                        <div style={{ flexShrink: 0, width: "30px", height: "30px", borderRadius: "8px", background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#f59e0b", letterSpacing: "0.5px" }}>{s.step}</div>
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.75)", marginBottom: "2px" }}>{s.label}</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{s.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — result panel */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "panelIn 0.7s 200ms both ease" }}>
                        <Panel accent={!!result}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <SectionDivider label="Detection Result" />
                                {result && <StatusBadge color="#f59e0b">Analysis complete</StatusBadge>}
                            </div>

                            {/* Detecting state */}
                            {detecting && (
                                <div style={{ padding: "24px 0" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                                        <div style={{ position: "relative", width: "52px", height: "52px", flexShrink: 0 }}>
                                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(217,119,6,0.15)" }} />
                                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#f59e0b", animation: "spin 0.9s linear infinite" }} />
                                            <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(245,158,11,0.4)", animation: "spin 1.6s linear infinite reverse" }} />
                                            <div style={{ position: "absolute", inset: "18px", borderRadius: "50%", background: "rgba(245,158,11,0.15)" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Scanning soil image…</div>
                                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: "3px" }}>Vision model analysing texture and composition</div>
                                        </div>
                                    </div>
                                    {/* Skeleton rows */}
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} style={{ height: "52px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", marginBottom: "10px", animation: `skeletonPulse 1.4s ${i * 180}ms ease-in-out infinite` }} />
                                    ))}
                                </div>
                            )}

                            {/* Empty — no image yet */}
                            {!detecting && !result && (
                                <div style={{ textAlign: "center", padding: "52px 24px" }}>
                                    <div style={{ fontSize: "56px", marginBottom: "16px", opacity: 0.55, filter: "grayscale(0.3)" }}>🪨</div>
                                    <div style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>Awaiting soil image</div>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.65, maxWidth: "280px", margin: "0 auto" }}>
                                        Upload a clear photo of your soil on the left to begin detection and get a full analysis.
                                    </div>
                                </div>
                            )}

                            {/* Result */}
                            {!detecting && result && (
                                <div style={{ animation: "resultSlide 0.5s both ease" }}>
                                    <SoilResultCard result={result} />
                                </div>
                            )}
                        </Panel>

                        {/* Notes card */}
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "20px",
                            padding: "22px 24px",
                            backdropFilter: "blur(12px)",
                            animation: "panelIn 0.7s 340ms both ease",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                                <span style={{ fontSize: "15px" }}>💡</span>
                                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(217,119,6,0.5)" }}>Notes</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                {[
                                    "For best results, photograph soil in natural daylight with good contrast.",
                                    "Mock detection is illustrative — replace with your real computer vision endpoint in production.",
                                ].map((note, i) => (
                                    <div key={i} style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                                        <span style={{ color: "rgba(217,119,6,0.55)", flexShrink: 0, marginTop: "1px" }}>›</span>
                                        {note}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

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
        @keyframes resultSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 7px #f59e0b; }
          50%       { opacity: 0.4; box-shadow: 0 0 18px #f59e0b; }
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
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(28px,-18px) scale(1.05); }
          66%       { transform: translate(-14px,22px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-22px,18px) scale(1.04); }
          66%       { transform: translate(18px,-28px) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(12px,-12px) scale(1.06); }
        }
        @keyframes particleDrift {
          from { transform: translateY(0) translateX(0); opacity: 0.08; }
          to   { transform: translateY(-22px) translateX(8px); opacity: 0.45; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 99px; }
      `}</style>
        </div>
    );
}
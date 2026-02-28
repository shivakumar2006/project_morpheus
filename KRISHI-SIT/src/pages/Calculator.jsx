import { useState, useEffect, useRef } from "react";

// ── Conversion table (all → sq meters as base) ────────────────────────────────
const UNITS = [
    { key: "acre", label: "Acre", symbol: "ac", toSqm: 4046.8564, emoji: "🌾" },
    { key: "sqft", label: "Sq. Foot", symbol: "ft²", toSqm: 0.092903, emoji: "📐" },
    { key: "hectare", label: "Hectare", symbol: "ha", toSqm: 10000, emoji: "🗺️" },
    { key: "sqm", label: "Sq. Meter", symbol: "m²", toSqm: 1, emoji: "📏" },
    { key: "sqyd", label: "Sq. Yard", symbol: "yd²", toSqm: 0.836127, emoji: "📌" },
    { key: "bigha", label: "Bigha (IN)", symbol: "bh", toSqm: 2508.382, emoji: "🏡" },
    { key: "guntha", label: "Guntha", symbol: "gu", toSqm: 101.1714, emoji: "🌿" },
    { key: "kanal", label: "Kanal", symbol: "kn", toSqm: 505.857, emoji: "🌱" },
];

const convert = (value, fromKey) => {
    const num = parseFloat(value);
    if (!num || isNaN(num)) return {};
    const from = UNITS.find(u => u.key === fromKey);
    const sqm = num * from.toSqm;
    const result = {};
    UNITS.forEach(u => {
        result[u.key] = sqm / u.toSqm;
    });
    return result;
};

const fmt = (n) => {
    if (n === undefined || n === null) return "—";
    if (n >= 1e9) return (n / 1e9).toFixed(3) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(4) + "M";
    if (n >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 4 });
    if (n < 0.0001) return n.toExponential(4);
    return n.toLocaleString("en-IN", { maximumFractionDigits: 6 });
};

// ── Animated counter ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, unit }) => {
    const [display, setDisplay] = useState("—");
    const raf = useRef(null);
    const prev = useRef(0);

    useEffect(() => {
        if (!value) { setDisplay("—"); return; }
        const target = value;
        const start = prev.current || 0;
        const duration = 600;
        const startTime = performance.now();

        const step = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            const current = start + (target - start) * eased;
            setDisplay(fmt(current));
            if (t < 1) raf.current = requestAnimationFrame(step);
            else { prev.current = target; setDisplay(fmt(target)); }
        };

        raf.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf.current);
    }, [value]);

    return <span>{display}</span>;
};

// ── Circular unit selector ────────────────────────────────────────────────────
const UnitDial = ({ selected, onSelect }) => {
    return (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {UNITS.map((u, i) => {
                const active = selected === u.key;
                return (
                    <button
                        key={u.key}
                        onClick={() => onSelect(u.key)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "99px",
                            border: `1.5px solid ${active ? "rgba(217,160,60,0.8)" : "rgba(255,255,255,0.10)"}`,
                            background: active
                                ? "linear-gradient(135deg, rgba(217,160,60,0.25), rgba(180,120,30,0.20))"
                                : "rgba(255,255,255,0.04)",
                            color: active ? "#f0c060" : "rgba(255,255,255,0.45)",
                            fontSize: "12px",
                            fontWeight: active ? "800" : "500",
                            fontFamily: "'DM Mono', monospace",
                            cursor: "pointer",
                            letterSpacing: active ? "0.5px" : "0",
                            transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)",
                            transform: active ? "scale(1.08)" : "scale(1)",
                            boxShadow: active ? "0 4px 18px rgba(217,160,60,0.25)" : "none",
                            display: "flex", alignItems: "center", gap: "5px",
                            animation: `dialIn 0.4s ${i * 40}ms both ease`,
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(217,160,60,0.4)"; e.currentTarget.style.color = "rgba(240,192,96,0.7)"; e.currentTarget.style.transform = "scale(1.05)"; } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.transform = "scale(1)"; } }}
                    >
                        <span style={{ fontSize: "13px" }}>{u.emoji}</span>
                        <span>{u.label}</span>
                        <span style={{ fontSize: "10px", opacity: 0.6 }}>({u.symbol})</span>
                    </button>
                );
            })}
        </div>
    );
};

// ── Result card ───────────────────────────────────────────────────────────────
const ResultCard = ({ unit, value, isSource, index }) => {
    const colors = {
        acre: { c: "#f0c060", g: "rgba(240,192,96,0.12)", b: "rgba(240,192,96,0.3)" },
        sqft: { c: "#6ee7b7", g: "rgba(110,231,183,0.10)", b: "rgba(110,231,183,0.25)" },
        hectare: { c: "#7dd3fc", g: "rgba(125,211,252,0.10)", b: "rgba(125,211,252,0.25)" },
        sqm: { c: "#c4b5fd", g: "rgba(196,181,253,0.10)", b: "rgba(196,181,253,0.25)" },
        sqyd: { c: "#fda4af", g: "rgba(253,164,175,0.10)", b: "rgba(253,164,175,0.25)" },
        bigha: { c: "#86efac", g: "rgba(134,239,172,0.10)", b: "rgba(134,239,172,0.25)" },
        guntha: { c: "#fdba74", g: "rgba(253,186,116,0.10)", b: "rgba(253,186,116,0.25)" },
        kanal: { c: "#a5f3fc", g: "rgba(165,243,252,0.10)", b: "rgba(165,243,252,0.25)" },
    };
    const { c, g, b } = colors[unit.key] || colors.sqm;

    return (
        <div
            style={{
                background: isSource
                    ? `linear-gradient(135deg, ${g.replace("0.12", "0.22")}, rgba(255,255,255,0.04))`
                    : "rgba(255,255,255,0.035)",
                border: `1px solid ${isSource ? b.replace("0.3", "0.5") : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px",
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
                animation: `cardGrow 0.5s ${index * 55}ms both cubic-bezier(.34,1.56,.64,1)`,
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                cursor: "default",
                backdropFilter: "blur(16px)",
                boxShadow: isSource ? `0 8px 32px ${g.replace("0.12", "0.3")}` : "0 4px 16px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 16px 44px ${g.replace("0.12", "0.35")}`;
                e.currentTarget.style.borderColor = b;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = isSource ? `0 8px 32px ${g.replace("0.12", "0.3")}` : "0 4px 16px rgba(0,0,0,0.2)";
                e.currentTarget.style.borderColor = isSource ? b.replace("0.3", "0.5") : "rgba(255,255,255,0.08)";
            }}
        >
            {/* Corner glow */}
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${c}18 0%, transparent 70%)`, pointerEvents: "none" }} />

            {/* Top shimmer on source */}
            {isSource && (
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: `linear-gradient(90deg, transparent, ${c}88, transparent)` }} />
            )}

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                    {/* Unit header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{unit.emoji}</span>
                        <div>
                            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: `${c}bb` }}>{unit.label}</div>
                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{unit.symbol}</div>
                        </div>
                        {isSource && (
                            <span style={{ marginLeft: "4px", fontSize: "9px", fontWeight: "800", letterSpacing: "1.5px", background: `${c}25`, border: `1px solid ${c}55`, borderRadius: "99px", padding: "2px 8px", color: c, textTransform: "uppercase" }}>
                                INPUT
                            </span>
                        )}
                    </div>

                    {/* Value */}
                    <div style={{
                        fontSize: "clamp(20px, 3.5vw, 28px)",
                        fontWeight: "900",
                        color: value !== undefined ? "#fff" : "rgba(255,255,255,0.2)",
                        letterSpacing: "-0.5px",
                        lineHeight: 1,
                        fontFamily: "'DM Mono', monospace",
                        textShadow: value !== undefined ? `0 0 20px ${c}44` : "none",
                    }}>
                        <AnimatedNumber value={value} unit={unit} />
                    </div>
                </div>

                {/* Symbol badge */}
                <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: `${c}18`, border: `1px solid ${c}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: c, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
                    {unit.symbol}
                </div>
            </div>
        </div>
    );
};

// ── Main calculator ───────────────────────────────────────────────────────────
export default function LandCalculator() {
    const [inputVal, setInputVal] = useState("");
    const [fromUnit, setFromUnit] = useState("acre");
    const [results, setResults] = useState({});
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputVal && parseFloat(inputVal) > 0) {
            setResults(convert(inputVal, fromUnit));
        } else {
            setResults({});
        }
    }, [inputVal, fromUnit]);

    const selectedUnit = UNITS.find(u => u.key === fromUnit);
    const hasValue = inputVal && parseFloat(inputVal) > 0;

    const handleUnitChange = (key) => {
        // If we have results, convert the current display value to the new unit
        if (hasValue && results[key]) {
            setInputVal(String(parseFloat(results[key].toFixed(8))));
        }
        setFromUnit(key);
        inputRef.current?.focus();
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes bgPulse {
          0%,100% { opacity:0.6; transform:scale(1); }
          50%       { opacity:1;   transform:scale(1.08); }
        }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardGrow {
          from { opacity:0; transform:scale(0.88) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes dialIn {
          from { opacity:0; transform:scale(0.7) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes inputPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(217,160,60,0.2); }
          50%      { box-shadow: 0 0 0 6px rgba(217,160,60,0.04); }
        }
        @keyframes rulerSlide {
          from { transform:scaleX(0); opacity:0; }
          to   { transform:scaleX(1); opacity:1; }
        }
        @keyframes scanLine {
          from { top:-2px; }
          to   { top:100%; }
        }
        @keyframes orbFloat {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(20px,-14px) scale(1.04); }
          66%      { transform:translate(-12px,18px) scale(0.97); }
        }
        @keyframes gridFade {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }

        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(217,160,60,0.3); border-radius:99px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
        input::placeholder { color:rgba(255,255,255,0.2); }
      `}</style>

            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #0d0a04 0%, #1a1206 35%, #0f0d05 70%, #130e04 100%)",
                fontFamily: "'DM Sans', sans-serif",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
            }}>

                {/* ── Atmospheric background ── */}
                <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                    {/* Orbs */}
                    {[
                        { w: "650px", t: "-20%", l: "-15%", bg: "radial-gradient(circle, rgba(217,160,60,0.08) 0%, transparent 65%)", d: "26s" },
                        { w: "500px", t: "60%", r: "-10%", bg: "radial-gradient(circle, rgba(120,180,60,0.06) 0%, transparent 65%)", d: "32s" },
                        { w: "350px", t: "35%", l: "38%", bg: "radial-gradient(circle, rgba(200,140,40,0.05) 0%, transparent 65%)", d: "20s" },
                        { w: "280px", b: "5%", l: "5%", bg: "radial-gradient(circle, rgba(160,200,80,0.04) 0%, transparent 65%)", d: "24s" },
                    ].map((o, i) => (
                        <div key={i} style={{
                            position: "absolute", width: o.w, height: o.w,
                            top: o.t, left: o.l, right: o.r, bottom: o.b,
                            borderRadius: "50%", background: o.bg,
                            animation: `orbFloat ${o.d} ease-in-out infinite`,
                        }} />
                    ))}

                    {/* Topographic grid */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "linear-gradient(rgba(217,160,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(217,160,60,0.025) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        animation: "gridFade 1.5s both ease",
                    }} />

                    {/* Scan line */}
                    <div style={{
                        position: "absolute", left: 0, right: 0, height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(217,160,60,0.08), transparent)",
                        animation: "scanLine 14s linear infinite",
                    }} />

                    {/* Grain texture overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
                        opacity: 0.4,
                    }} />
                </div>

                {/* ── Content ── */}
                <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", padding: "52px 24px 80px" }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: "44px", animation: "fadeDown 0.8s both ease" }}>

                        {/* Instrument badge */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            background: "rgba(217,160,60,0.10)", border: "1px solid rgba(217,160,60,0.28)",
                            borderRadius: "99px", padding: "6px 18px", marginBottom: "20px",
                        }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f0c060", boxShadow: "0 0 8px #f0c060", display: "inline-block", animation: "inputPulse 2s infinite" }} />
                            <span style={{ fontSize: "10px", fontWeight: "700", color: "#f0c060", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Land Measurement Instrument</span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(36px,6vw,64px)",
                            fontWeight: "900",
                            letterSpacing: "-1.5px",
                            lineHeight: 1.05,
                            margin: "0 0 14px",
                        }}>
                            Land{" "}
                            <span style={{
                                background: "linear-gradient(90deg, #f0c060, #fde68a, #d4a017, #f0c060)",
                                backgroundSize: "300% 100%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                animation: "shimmer 4s linear infinite",
                            }}>
                                Converter
                            </span>
                        </h1>

                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.75, fontWeight: "300" }}>
                            Enter any land measurement — instantly see it in every unit farmers, surveyors & developers use.
                        </p>

                        {/* Ruler decoration */}
                        <div style={{ margin: "24px auto 0", maxWidth: "280px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(217,160,60,0.5), transparent)", transformOrigin: "left", animation: "rulerSlide 1.2s 0.4s both ease" }} />
                    </div>

                    {/* ── Input section ── */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(217,160,60,0.08) 0%, rgba(180,120,30,0.04) 100%)",
                        border: "1px solid rgba(217,160,60,0.22)",
                        borderRadius: "28px",
                        padding: "32px",
                        marginBottom: "28px",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(217,160,60,0.10)",
                        animation: "fadeDown 0.8s 80ms both ease",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        {/* Top shimmer */}
                        <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(217,160,60,0.7), transparent)", borderRadius: "99px" }} />

                        {/* Corner decoration */}
                        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,160,60,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

                        {/* Input label */}
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(217,160,60,0.6)", marginBottom: "12px", fontFamily: "'DM Mono', monospace" }}>
                            Enter Value
                        </label>

                        {/* Input row */}
                        <div style={{ display: "flex", gap: "12px", alignItems: "stretch", marginBottom: "28px", flexWrap: "wrap" }}>
                            {/* Number input */}
                            <div style={{ flex: "1 1 200px", position: "relative" }}>
                                <input
                                    ref={inputRef}
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    style={{
                                        width: "100%",
                                        padding: "20px 24px 20px 20px",
                                        borderRadius: "18px",
                                        border: `2px solid ${focused ? "rgba(217,160,60,0.65)" : "rgba(217,160,60,0.22)"}`,
                                        background: focused ? "rgba(217,160,60,0.07)" : "rgba(0,0,0,0.25)",
                                        color: "#fff",
                                        fontSize: "clamp(28px,5vw,42px)",
                                        fontWeight: "900",
                                        fontFamily: "'DM Mono', monospace",
                                        letterSpacing: "-1px",
                                        outline: "none",
                                        backdropFilter: "blur(10px)",
                                        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                                        boxShadow: focused ? "0 0 0 4px rgba(217,160,60,0.08), 0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.3)",
                                        animation: hasValue ? "inputPulse 3s ease-in-out infinite" : "none",
                                    }}
                                />
                                {/* Unit label inside input */}
                                <div style={{
                                    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                                    fontSize: "13px", fontWeight: "700", color: "rgba(217,160,60,0.55)",
                                    fontFamily: "'DM Mono', monospace", pointerEvents: "none",
                                    letterSpacing: "1px",
                                }}>
                                    {selectedUnit?.symbol}
                                </div>
                            </div>

                            {/* Active unit display */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: "rgba(217,160,60,0.12)", border: "1px solid rgba(217,160,60,0.30)",
                                borderRadius: "18px", padding: "16px 20px",
                                flexShrink: 0,
                            }}>
                                <span style={{ fontSize: "28px" }}>{selectedUnit?.emoji}</span>
                                <div>
                                    <div style={{ fontSize: "11px", color: "rgba(217,160,60,0.6)", letterSpacing: "1.5px", fontWeight: "700", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>FROM</div>
                                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#f0c060", letterSpacing: "-0.3px" }}>{selectedUnit?.label}</div>
                                </div>
                            </div>
                        </div>

                        {/* Unit selector dial */}
                        <div>
                            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "12px", fontFamily: "'DM Mono', monospace" }}>
                                Select Input Unit
                            </div>
                            <UnitDial selected={fromUnit} onSelect={handleUnitChange} />
                        </div>
                    </div>

                    {/* ── Quick presets ── */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px", animation: "fadeDown 0.7s 160ms both ease" }}>
                        {[0.5, 1, 2, 5, 10, 25, 50, 100].map((v) => (
                            <button
                                key={v}
                                onClick={() => setInputVal(String(v))}
                                style={{
                                    padding: "7px 16px", borderRadius: "99px",
                                    border: `1px solid ${inputVal == v ? "rgba(217,160,60,0.6)" : "rgba(255,255,255,0.10)"}`,
                                    background: inputVal == v ? "rgba(217,160,60,0.15)" : "rgba(255,255,255,0.04)",
                                    color: inputVal == v ? "#f0c060" : "rgba(255,255,255,0.4)",
                                    fontSize: "12px", fontWeight: "700", cursor: "pointer",
                                    fontFamily: "'DM Mono', monospace",
                                    transition: "all 0.15s",
                                    transform: inputVal == v ? "scale(1.05)" : "scale(1)",
                                }}
                                onMouseEnter={e => { if (inputVal != v) { e.currentTarget.style.borderColor = "rgba(217,160,60,0.35)"; e.currentTarget.style.color = "rgba(217,160,60,0.7)"; } }}
                                onMouseLeave={e => { if (inputVal != v) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; } }}
                            >
                                {v} {selectedUnit?.symbol}
                            </button>
                        ))}
                        {inputVal && (
                            <button
                                onClick={() => setInputVal("")}
                                style={{ padding: "7px 16px", borderRadius: "99px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.07)", color: "rgba(239,68,68,0.6)", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; e.currentTarget.style.color = "#f87171"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.color = "rgba(239,68,68,0.6)"; }}
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>

                    {/* ── Results header ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px", animation: "fadeDown 0.7s 200ms both ease" }}>
                        <div style={{ height: "1px", flex: 1, background: "rgba(217,160,60,0.14)" }} />
                        <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(217,160,60,0.45)", fontFamily: "'DM Mono', monospace" }}>
                            {hasValue ? `Conversions for ${inputVal} ${selectedUnit?.symbol}` : "All Conversions"}
                        </span>
                        <div style={{ height: "1px", flex: 1, background: "rgba(217,160,60,0.14)" }} />
                    </div>

                    {/* ── Results grid ── */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "14px",
                        animation: "fadeDown 0.7s 240ms both ease",
                    }}>
                        {UNITS.map((unit, index) => (
                            <ResultCard
                                key={unit.key}
                                unit={unit}
                                value={hasValue ? results[unit.key] : undefined}
                                isSource={unit.key === fromUnit}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* ── Reference table (always visible) ── */}
                    <div style={{
                        marginTop: "40px",
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "24px",
                        padding: "28px",
                        backdropFilter: "blur(16px)",
                        animation: "fadeDown 0.7s 320ms both ease",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
                            <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>Reference: 1 Acre =</span>
                            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                            {UNITS.filter(u => u.key !== "acre").map((u) => {
                                const val = 4046.8564 / u.toSqm;
                                return (
                                    <div key={u.key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "background 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(217,160,60,0.06)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                    >
                                        <span style={{ fontSize: "14px" }}>{u.emoji}</span>
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", fontFamily: "'DM Mono', monospace" }}>{fmt(val)}</div>
                                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>{u.label}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", marginTop: "36px", fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                        Land Measurement Instrument · All conversions via sq. meter base
                    </div>
                </div>
            </div>
        </>
    );
}
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetRentalByIdQuery } from "../store/api/RentalsApi";

// ── Animated background ───────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "520px", h: "520px", top: "-16%", left: "-10%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "380px", h: "380px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
            { w: "260px", h: "260px", top: "25%", left: "45%", bg: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(28)].map((_, i) => (
            <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: `rgba(52,211,153,${Math.random() * 0.12 + 0.03})`,
                width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
            }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.10),transparent)", animation: "scanLine 12s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Styled input field ────────────────────────────────────────────────────────
const Field = ({ label, icon, type = "text", value, onChange, placeholder, min, disabled, prefilled }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "8px" }}>
                {label}
                {/* ✅ Badge shown when value came from booking widget */}
                {prefilled && (
                    <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "1px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "99px", padding: "2px 8px", color: "#34d399", textTransform: "uppercase" }}>
                        Auto-filled
                    </span>
                )}
            </label>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    min={min}
                    disabled={disabled}
                    style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "14px 18px 14px 46px",
                        borderRadius: "14px",
                        border: `1.5px solid ${prefilled && !focused
                            ? "rgba(52,211,153,0.35)"
                            : focused
                                ? "rgba(52,211,153,0.5)"
                                : "rgba(255,255,255,0.10)"
                            }`,
                        background: prefilled && !focused
                            ? "rgba(52,211,153,0.05)"
                            : "rgba(255,255,255,0.05)",
                        color: "#fff", fontSize: "14px", fontFamily: "inherit",
                        outline: "none", backdropFilter: "blur(10px)",
                        transition: "border-color 0.2s, background 0.2s",
                        boxShadow: focused ? "0 0 0 3px rgba(52,211,153,0.08)" : "none",
                    }}
                />
            </div>
        </div>
    );
};

// ── Day stepper ───────────────────────────────────────────────────────────────
const DayStepper = ({ days, setDays, prefilled }) => (
    <div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "8px" }}>
            Number of Days
            {prefilled && (
                <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "1px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "99px", padding: "2px 8px", color: "#34d399", textTransform: "uppercase" }}>
                    Auto-filled
                </span>
            )}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0", background: prefilled ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.05)", border: `1.5px solid ${prefilled ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.10)"}`, borderRadius: "14px", overflow: "hidden" }}>
            <button onClick={() => setDays(d => Math.max(1, d - 1))} style={{ width: "52px", height: "52px", background: "rgba(255,255,255,0.04)", border: "none", borderRight: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "22px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s", flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.color = "#34d399"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>−</button>
            <div style={{ flex: 1, textAlign: "center", fontSize: "20px", fontWeight: "900", color: "#fff", letterSpacing: "-0.5px" }}>
                {days}
                <span style={{ fontSize: "12px", fontWeight: "500", color: "rgba(255,255,255,0.35)", marginLeft: "6px" }}>{days === 1 ? "day" : "days"}</span>
            </div>
            <button onClick={() => setDays(d => d + 1)} style={{ width: "52px", height: "52px", background: "rgba(255,255,255,0.04)", border: "none", borderLeft: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "22px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, color 0.2s", flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.color = "#34d399"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>+</button>
        </div>
    </div>
);

// ── Date range display (read-only, shown when prefilled) ──────────────────────
const DateRangeDisplay = ({ startDate, endDate }) => {
    const fmt = (d) => d instanceof Date
        ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "8px" }}>
                Rental Period
                <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "1px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "99px", padding: "2px 8px", color: "#34d399", textTransform: "uppercase" }}>
                    Auto-filled
                </span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(52,211,153,0.05)", border: "1.5px solid rgba(52,211,153,0.30)", borderRadius: "14px", padding: "13px 18px" }}>
                <span style={{ fontSize: "16px" }}>📅</span>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>{fmt(startDate)}</span>
                        <span style={{ fontSize: "12px", color: "rgba(52,211,153,0.5)" }}>→</span>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>{fmt(endDate)}</span>
                    </div>
                </div>
                {/* Days pill */}
                <div style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "99px", padding: "4px 12px", fontSize: "12px", fontWeight: "800", color: "#34d399", whiteSpace: "nowrap" }}>
                    {Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))} days
                </div>
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const RentVehicle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Read prefill data forwarded from BookingPage via router state
    const prefill = location.state?.prefill ?? null;

    const { data: vehicle, isLoading } = useGetRentalByIdQuery(Number(id));

    // ✅ Initialise fields from prefill if available, else empty/defaults
    const [pickup, setPickup] = useState(prefill?.pickup ?? "");
    const [destination, setDestination] = useState(prefill?.destination ?? "");
    const [days, setDays] = useState(prefill?.days ?? 1);

    const totalFare = days * (vehicle?.rentalPricePerDay || 0);
    const canContinue = pickup.trim() && destination.trim();

    const handleNext = () => {
        navigate("/select-partner", {
            state: {
                vehicle, pickup, destination, days, totalFare,
                ...(prefill?.startDate && { startDate: prefill.startDate, endDate: prefill.endDate }),
            },
        });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn    { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes panelIn   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes pulseDot  { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes scanLine  { from { top:-2px; } to { top:100%; } }
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        @keyframes fareGlow { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.2); } 50% { box-shadow:0 0 24px 4px rgba(52,211,153,0.12); } }
        @keyframes prefillSlide { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "56px 24px 80px" }}>

                    {isLoading && (
                        <div style={{ textAlign: "center", padding: "80px 0" }}>
                            <div style={{ display: "inline-flex", position: "relative", width: "56px", height: "56px", marginBottom: "20px" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.12)" }} />
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                                <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
                            </div>
                            <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>Loading vehicle details…</div>
                        </div>
                    )}

                    {!isLoading && !vehicle && (
                        <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "24px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "14px" }}>🚜</div>
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#f87171" }}>Vehicle not found</div>
                            <button onClick={() => navigate("/booking")} style={{ marginTop: "18px", padding: "10px 24px", borderRadius: "99px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.10)", color: "#f87171", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>← Back to Booking</button>
                        </div>
                    )}

                    {!isLoading && vehicle && (
                        <>
                            {/* Page header */}
                            <div style={{ marginBottom: "32px", animation: "heroIn 0.7s both ease" }}>
                                <button onClick={() => navigate("/booking")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", marginBottom: "20px", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.color = "#34d399"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}>
                                    ← Back to Booking
                                </button>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite", display: "inline-block" }} />
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Equipment Rental</span>
                                </div>
                                <h1 style={{ margin: "0", fontSize: "clamp(26px,4.5vw,44px)", fontWeight: "900", lineHeight: 1.05, letterSpacing: "-1px" }}>
                                    Rent:{" "}
                                    <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                                        {vehicle.name}
                                    </span>
                                </h1>
                            </div>

                            {/* ✅ Prefill banner — shown when data came from BookingPage */}
                            {prefill && (
                                <div style={{
                                    marginBottom: "20px",
                                    background: "linear-gradient(135deg, rgba(52,211,153,0.10), rgba(16,185,129,0.06))",
                                    border: "1px solid rgba(52,211,153,0.28)",
                                    borderRadius: "18px", padding: "14px 18px",
                                    display: "flex", alignItems: "flex-start", gap: "12px",
                                    animation: "prefillSlide 0.4s both ease",
                                    boxShadow: "0 4px 24px rgba(52,211,153,0.08)",
                                }}>
                                    {/* Left icon */}
                                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>✨</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "12px", fontWeight: "800", color: "#34d399", letterSpacing: "0.5px", marginBottom: "8px" }}>
                                            Fields pre-filled from your booking search
                                        </div>
                                        {/* Detail chips */}
                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", color: "#6ee7b7" }}>
                                                📍 {prefill.pickup}
                                            </span>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255,140,66,0.10)", border: "1px solid rgba(255,140,66,0.22)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", color: "#fbbf24" }}>
                                                🏁 {prefill.destination}
                                            </span>
                                            {prefill.startDate && prefill.endDate && (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", color: "#6ee7b7" }}>
                                                    📅 {prefill.days} days
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Dismiss */}
                                    <div style={{ fontSize: "11px", color: "rgba(52,211,153,0.45)", fontWeight: "600", whiteSpace: "nowrap", marginTop: "2px" }}>You can edit below</div>
                                </div>
                            )}

                            {/* Vehicle image */}
                            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", marginBottom: "28px", animation: "panelIn 0.7s 80ms both ease", boxShadow: "0 24px 64px rgba(0,0,0,0.55)", border: "1px solid rgba(52,211,153,0.15)" }}>
                                <div style={{ height: "280px", overflow: "hidden" }}>
                                    <img src={`http://localhost:8095/images/${vehicle.image}`} alt={vehicle.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                                </div>
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,12,6,0.75) 0%, transparent 55%)" }} />
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)" }} />
                                <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
                                    <div style={{ background: "rgba(2,12,6,0.85)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "16px", padding: "12px 20px", backdropFilter: "blur(12px)" }}>
                                        <div style={{ fontSize: "28px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px", lineHeight: 1 }}>₹{vehicle.rentalPricePerDay}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>per day</div>
                                    </div>
                                </div>
                                <div style={{ position: "absolute", top: "16px", right: "16px", padding: "5px 14px", borderRadius: "99px", background: vehicle.availability ? "rgba(52,211,153,0.18)" : "rgba(239,68,68,0.18)", border: `1px solid ${vehicle.availability ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`, color: vehicle.availability ? "#34d399" : "#f87171", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px", backdropFilter: "blur(8px)" }}>
                                    {vehicle.availability ? "✓ Available" : "✗ Unavailable"}
                                </div>
                                {vehicle.category && (
                                    <div style={{ position: "absolute", top: "16px", left: "16px", padding: "5px 14px", borderRadius: "99px", background: "rgba(2,12,6,0.80)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)", fontSize: "11px", fontWeight: "700", backdropFilter: "blur(8px)" }}>
                                        🚜 {vehicle.category}
                                    </div>
                                )}
                            </div>

                            {/* Booking form panel */}
                            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", animation: "panelIn 0.7s 160ms both ease" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.35),transparent)" }} />
                                <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />

                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
                                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>Booking Details</span>
                                    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {/* ✅ Pickup field — prefilled & highlighted */}
                                    <Field
                                        label="Pickup Location"
                                        icon="📍"
                                        value={pickup}
                                        onChange={e => setPickup(e.target.value)}
                                        placeholder="Enter pickup location"
                                        prefilled={!!prefill?.pickup}
                                    />
                                    {/* ✅ Destination field — prefilled & highlighted */}
                                    <Field
                                        label="Destination"
                                        icon="🏁"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                        placeholder="Enter destination location"
                                        prefilled={!!prefill?.destination}
                                    />
                                    {/* ✅ Date range display (read-only) — only shown when prefilled */}
                                    {prefill?.startDate && prefill?.endDate && (
                                        <DateRangeDisplay startDate={prefill.startDate} endDate={prefill.endDate} />
                                    )}
                                    {/* ✅ Day stepper — initialised from prefill */}
                                    <DayStepper days={days} setDays={setDays} prefilled={!!prefill?.days} />
                                </div>
                            </div>

                            {/* Fare summary */}
                            <div style={{ marginTop: "16px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.20)", borderRadius: "20px", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", animation: "fareGlow 3s ease-in-out infinite" }}>
                                <div>
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "4px" }}>Estimated Fare</div>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>₹{vehicle.rentalPricePerDay} × {days} {days === 1 ? "day" : "days"}</div>
                                </div>
                                <div style={{ fontSize: "clamp(32px,5vw,44px)", fontWeight: "900", color: "#34d399", letterSpacing: "-1px", lineHeight: 1 }}>₹{totalFare.toLocaleString()}</div>
                            </div>

                            {/* Continue button */}
                            <button onClick={handleNext} disabled={!canContinue} style={{ marginTop: "16px", width: "100%", padding: "17px", borderRadius: "16px", border: "none", background: canContinue ? "linear-gradient(135deg,#059669,#047857)" : "rgba(255,255,255,0.06)", color: canContinue ? "#fff" : "rgba(255,255,255,0.25)", fontSize: "16px", fontWeight: "800", fontFamily: "inherit", cursor: canContinue ? "pointer" : "not-allowed", letterSpacing: "0.3px", boxShadow: canContinue ? "0 6px 28px rgba(5,150,105,0.40)" : "none", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", animation: "panelIn 0.7s 280ms both ease" }} onMouseEnter={e => { if (canContinue) { e.currentTarget.style.boxShadow = "0 10px 36px rgba(5,150,105,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; } }} onMouseLeave={e => { e.currentTarget.style.boxShadow = canContinue ? "0 6px 28px rgba(5,150,105,0.40)" : "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                                {canContinue ? "Continue to Select Partner →" : "Enter pickup & destination to continue"}
                            </button>

                            {!canContinue && (
                                <div style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.25)", animation: "fadeIn 0.3s both ease" }}>
                                    Both pickup and destination are required to proceed.
                                </div>
                            )}

                            {/* Trust badges */}
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "24px" }}>
                                {[{ icon: "✅", text: "Verified Equipment" }, { icon: "🔒", text: "Secure Booking" }, { icon: "💬", text: "24/7 Support" }].map((b) => (
                                    <div key={b.text} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.38)", fontWeight: "600" }}>{b.icon} {b.text}</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default RentVehicle;
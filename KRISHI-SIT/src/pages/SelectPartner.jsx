import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const partners = [
    { id: 1, name: "Ravi Tractor Services", rating: 4.8, distance: "1.5 km", trips: 120, specialty: "Heavy Equipment", badge: "Top Rated" },
    { id: 2, name: "AgroMachine Partners", rating: 4.7, distance: "2.1 km", trips: 98, specialty: "Irrigation Tools", badge: "Verified" },
    { id: 3, name: "Kisan Rental Hub", rating: 4.5, distance: "3.4 km", trips: 87, specialty: "Seed Machinery", badge: "Trusted" },
];

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "500px", h: "500px", top: "-16%", left: "-10%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "360px", h: "360px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)", anim: "orbFloat2 26s ease-in-out infinite" },
            { w: "240px", h: "240px", top: "30%", left: "44%", bg: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(25)].map((_, i) => (
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

// ── Star rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
    const full = Math.floor(rating);
    const partial = rating - full;
    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
                <span key={i} style={{ fontSize: "13px", color: i < full ? "#fbbf24" : i === full && partial > 0 ? "#fbbf24" : "rgba(255,255,255,0.15)", opacity: i === full && partial > 0 ? partial : 1 }}>★</span>
            ))}
        </div>
    );
};

// ── Partner card ──────────────────────────────────────────────────────────────
const PartnerCard = ({ partner, onSelect, index }) => {
    const [hovered, setHovered] = React.useState(false);
    const badgeColors = { "Top Rated": "#fbbf24", "Verified": "#34d399", "Trusted": "#818cf8" };
    const color = badgeColors[partner.badge] || "#34d399";

    return (
        <div
            onClick={() => onSelect(partner)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(52,211,153,0.28)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "22px",
                padding: "24px 28px",
                cursor: "pointer",
                backdropFilter: "blur(18px)",
                boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.5)" : "0 6px 24px rgba(0,0,0,0.3)",
                transform: hovered ? "translateY(-5px) scale(1.005)" : "translateY(0) scale(1)",
                transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
                animation: `cardIn 0.5s ${index * 100}ms both ease`,
                position: "relative", overflow: "hidden",
            }}
        >
            {/* Top glow */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", transition: "background 0.3s" }} />
            {/* Corner orb */}
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: `radial-gradient(circle,${color}10 0%,transparent 65%)`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.35s", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>

                {/* Left — avatar + info */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1, minWidth: 0 }}>
                    {/* Avatar circle */}
                    <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${color}18`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0, transition: "transform 0.3s", transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0)" }}>
                        🚜
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px" }}>{partner.name}</span>
                            <span style={{ padding: "2px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", background: `${color}18`, border: `1px solid ${color}35`, color }}>{partner.badge}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Stars rating={partner.rating} />
                                <span style={{ fontSize: "13px", fontWeight: "700", color: "#fbbf24" }}>{partner.rating}</span>
                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>({partner.trips} trips)</span>
                            </div>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", display: "flex", alignItems: "center", gap: "4px" }}>
                                📍 {partner.distance}
                            </span>
                        </div>

                        <div style={{ marginTop: "6px", fontSize: "11px", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, display: "inline-block" }} />
                            {partner.specialty}
                        </div>
                    </div>
                </div>

                {/* Right — select button */}
                <div style={{
                    padding: "11px 22px", borderRadius: "12px",
                    background: hovered ? "linear-gradient(135deg,#059669,#047857)" : "rgba(52,211,153,0.09)",
                    border: `1px solid ${hovered ? "transparent" : "rgba(52,211,153,0.22)"}`,
                    color: "#fff", fontSize: "13px", fontWeight: "800",
                    boxShadow: hovered ? "0 4px 18px rgba(5,150,105,0.4)" : "none",
                    transition: "all 0.25s", flexShrink: 0,
                    display: "flex", alignItems: "center", gap: "6px",
                }}>
                    Select <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(3px)" : "translateX(0)", display: "inline-block" }}>→</span>
                </div>
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const SelectPartner = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSelect = (partner) => {
        navigate("/confirm-ride", { state: { ...state, partner } });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(22px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(28px,-18px); } 66% { transform:translate(-14px,22px); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(-22px,18px); } 66% { transform:translate(18px,-26px); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(12px,-12px); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-20px); opacity:0.3; } }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "56px 24px 80px" }}>

                    {/* Missing state */}
                    {!state && (
                        <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "24px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "14px" }}>🚫</div>
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#f87171" }}>Missing booking data</div>
                        </div>
                    )}

                    {state && (
                        <>
                            {/* Header */}
                            <div style={{ marginBottom: "40px", animation: "heroIn 0.7s both ease" }}>
                                <button
                                    onClick={() => navigate(-1)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", marginBottom: "22px", transition: "all 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.color = "#34d399"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
                                >
                                    ← Back
                                </button>

                                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "14px" }}>
                                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Step 2 of 3</span>
                                </div>

                                <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,5vw,46px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.05 }}>
                                    Select a
                                    <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> Partner</span>
                                </h1>
                                <p style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
                                    Choose a trusted rental partner for <strong style={{ color: "rgba(255,255,255,0.65)" }}>{state.vehicle?.name}</strong>. All partners are verified and rated by real farmers.
                                </p>
                            </div>

                            {/* Summary strip */}
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px", animation: "cardIn 0.5s 80ms both ease" }}>
                                {[
                                    { icon: "📍", label: "Pickup", value: state.pickup },
                                    { icon: "🏁", label: "Destination", value: state.destination },
                                    { icon: "📅", label: "Days", value: `${state.days} ${state.days === 1 ? "day" : "days"}` },
                                    { icon: "💰", label: "Fare", value: `₹${state.totalFare}` },
                                ].map((s) => (
                                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "8px 14px", fontSize: "12px" }}>
                                        <span>{s.icon}</span>
                                        <div>
                                            <div style={{ fontSize: "10px", color: "rgba(52,211,153,0.5)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
                                            <div style={{ fontWeight: "700", color: "#fff", marginTop: "1px" }}>{s.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.45)" }}>{partners.length} Partners Nearby</span>
                                <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
                            </div>

                            {/* Partner cards */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {partners.map((p, i) => (
                                    <PartnerCard key={p.id} partner={p} onSelect={handleSelect} index={i} />
                                ))}
                            </div>

                            {/* Trust note */}
                            <div style={{ marginTop: "28px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.22)", lineHeight: 1.6, animation: "cardIn 0.5s 400ms both ease" }}>
                                🔒 All partners are background-verified and insured. Your booking is protected.
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectPartner;
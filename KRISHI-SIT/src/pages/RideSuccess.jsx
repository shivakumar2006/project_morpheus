import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifySessionQuery } from "../store/api/PaymentApi";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "500px", h: "500px", top: "-16%", left: "-10%", bg: "radial-gradient(circle,rgba(34,197,94,0.09) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "360px", h: "360px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 65%)", anim: "orbFloat2 26s ease-in-out infinite" },
            { w: "240px", h: "240px", top: "30%", left: "44%", bg: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
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

// ── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, accent, delay, badge }) => (
    <div style={{
        background: "rgba(255,255,255,0.04)", border: `1px solid ${accent ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px", padding: "18px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
        animation: `rowIn 0.5s ${delay}ms both ease`,
        position: "relative", overflow: "hidden",
    }}>
        {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)" }} />}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            <div>
                <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: accent ? "rgba(52,211,153,0.55)" : "rgba(255,255,255,0.35)", marginBottom: "3px" }}>{label}</div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px" }}>{value}</div>
            </div>
        </div>
        {badge && (
            <div style={{ padding: "4px 12px", borderRadius: "99px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: "10px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>
                {badge}
            </div>
        )}
    </div>
);

// ── Success checkmark ─────────────────────────────────────────────────────────
const SuccessIcon = () => (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px", animation: "checkIn 0.6s both cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ position: "relative", width: "88px", height: "88px" }}>
            {/* Outer ring */}
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.2)", animation: "ringPulse 2.5s ease-in-out infinite" }} />
            {/* Middle ring */}
            <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "1px solid rgba(52,211,153,0.3)" }} />
            {/* Inner circle */}
            <div style={{ position: "absolute", inset: "18px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", boxShadow: "0 8px 28px rgba(5,150,105,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
        </div>
    </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const RideSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = params.get("session_id");
    const { data, isLoading } = useVerifySessionQuery(sessionId);

    if (typeof window !== "undefined" && sessionId) {
        localStorage.setItem("last_session_id", sessionId);
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn   { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes rowIn    { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes checkIn  { from { opacity:0; transform:scale(0.5) rotate(-10deg); } to { opacity:1; transform:scale(1) rotate(0); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes ringPulse { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.08); opacity:0.2; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes confettiFloat { 0% { transform:translateY(0) rotate(0deg); opacity:1; } 100% { transform:translateY(-120px) rotate(360deg); opacity:0; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(28px,-18px); } 66% { transform:translate(-14px,22px); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(-22px,18px); } 66% { transform:translate(18px,-26px); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(12px,-12px); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-20px); opacity:0.3; } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
                <Particles />

                {/* Loading */}
                {isLoading && (
                    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                        <div style={{ display: "inline-flex", position: "relative", width: "60px", height: "60px", marginBottom: "22px" }}>
                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.12)" }} />
                            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                            <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>Fetching booking details…</div>
                    </div>
                )}

                {/* Content */}
                {!isLoading && data && (() => {
                    const meta = data?.metadata;
                    return (
                        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "560px", animation: "heroIn 0.7s both ease" }}>

                            {/* Card */}
                            <div style={{
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                                borderRadius: "28px", padding: "40px 36px",
                                backdropFilter: "blur(24px)",
                                boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
                                position: "relative", overflow: "hidden",
                            }}>
                                {/* Top glow */}
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)" }} />
                                {/* Corner orb */}
                                <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />

                                {/* Success checkmark */}
                                <SuccessIcon />

                                {/* Step badge */}
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 14px" }}>
                                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Booking Confirmed</span>
                                    </div>
                                </div>

                                {/* Headline */}
                                <h1 style={{ margin: "0 0 8px", textAlign: "center", fontSize: "clamp(26px,5vw,38px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.05 }}>
                                    Booking{" "}
                                    <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                                        Successful!
                                    </span>
                                </h1>
                                <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif", marginBottom: "32px", lineHeight: 1.6 }}>
                                    Your farming vehicle is confirmed and ready 🚜✨
                                </p>

                                {/* Info rows */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                                    <InfoRow icon="🚜" label="Vehicle" value={meta?.vehicleName} accent delay={0} />
                                    <InfoRow icon="📍" label="Route" value={`${meta?.pickup} → ${meta?.destination}`} delay={80} />
                                    <InfoRow icon="📅" label="Booking Duration" value={`${meta?.days} ${meta?.days == 1 ? "day" : "days"}`} delay={160} />
                                    <InfoRow icon="👨‍🌾" label="Partner" value={meta?.partnerName} delay={240} badge="Verified" />
                                </div>

                                {/* Total paid */}
                                <div style={{
                                    background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.22)",
                                    borderRadius: "18px", padding: "22px 24px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    marginBottom: "24px", position: "relative", overflow: "hidden",
                                }}>
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.45),transparent)" }} />
                                    <div>
                                        <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "4px" }}>Total Paid</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>via Stripe · Secured</div>
                                    </div>
                                    <div style={{ fontSize: "clamp(28px,5vw,36px)", fontWeight: "900", color: "#34d399", letterSpacing: "-1px" }}>
                                        ₹{meta?.totalFare}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => navigate("/booking")}
                                    style={{ width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 26px rgba(5,150,105,0.40)", transition: "transform 0.2s,box-shadow 0.2s", letterSpacing: "0.3px", marginBottom: "16px" }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 34px rgba(5,150,105,0.55)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 26px rgba(5,150,105,0.40)"; }}
                                >
                                    ← Back to Bookings
                                </button>

                                {/* Secondary links */}
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                                    {[
                                        { icon: "🏠", label: "Home", path: "/" },
                                        { icon: "🛒", label: "Store", path: "/store" },
                                    ].map(l => (
                                        <button key={l.label} onClick={() => navigate(l.path)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.color = "#34d399"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
                                        >
                                            {l.icon} {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </>
    );
};

export default RideSuccess;
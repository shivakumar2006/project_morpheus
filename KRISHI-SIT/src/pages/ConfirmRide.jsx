import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateCheckoutSessionMutation } from "../store/api/PaymentApi";

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

// ── Info panel ────────────────────────────────────────────────────────────────
const InfoPanel = ({ title, icon, children, delay = 0 }) => (
    <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "22px", padding: "24px 26px",
        backdropFilter: "blur(18px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative", overflow: "hidden",
        animation: `cardIn 0.5s ${delay}ms both ease`,
    }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.3),transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{ fontSize: "13px", fontWeight: "800", letterSpacing: "0.5px", color: "rgba(255,255,255,0.65)" }}>{title}</span>
        </div>
        {children}
    </div>
);

// ── Detail row ────────────────────────────────────────────────────────────────
const Row = ({ icon, label, value, highlight }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.45)", fontSize: "13px", fontWeight: "500" }}>
            <span>{icon}</span> {label}
        </div>
        <span style={{ fontSize: "14px", fontWeight: "700", color: highlight ? "#34d399" : "#fff" }}>{value}</span>
    </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const ConfirmRide = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Extract data safely
    const vehicle = state?.vehicle;
    const partner = state?.partner;
    const pickup = state?.pickup;
    const destination = state?.destination;
    const days = state?.days;
    const totalFare = state?.totalFare;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await createCheckoutSession({
                mode: "booking",
                items: [
                    { title: vehicle.name, price: totalFare, quantity: 1 }
                ],
                rideData: {
                    vehicleName: vehicle.name,
                    vehicleCategory: vehicle.category,
                    pickup,
                    destination,
                    days,
                    partnerName: partner.name,
                    totalFare
                }
            }).unwrap();

            // ✅ Redirect to Stripe Checkout
            window.location.href = response.url;

        } catch (err) {
            console.error("Payment Error:", err);
            setError("Payment failed. Please try again.");
            setLoading(false);
        }
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
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fareGlow { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.15); } 50% { box-shadow:0 0 28px 4px rgba(52,211,153,0.10); } }
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
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#f87171" }}>Missing booking information</div>
                        </div>
                    )}

                    {state && (() => {
                        const { vehicle, partner, pickup, destination, days, totalFare } = state;
                        return (
                            <>
                                {/* Header */}
                                <div style={{ marginBottom: "36px", animation: "heroIn 0.7s both ease" }}>
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
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Step 3 of 3 · Final Review</span>
                                    </div>

                                    <h1 style={{ margin: "0 0 8px", fontSize: "clamp(26px,5vw,44px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.05 }}>
                                        Confirm Your
                                        <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> Booking</span>
                                    </h1>
                                    <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                                        Review all your details before we proceed to payment.
                                    </p>
                                </div>

                                {/* ── Vehicle card ── */}
                                <InfoPanel title="Vehicle Details" icon="🚜" delay={0}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div style={{ width: "100px", height: "72px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(52,211,153,0.18)", flexShrink: 0 }}>
                                            <img
                                                src={`http://localhost:8095/images/${vehicle.image}`}
                                                alt={vehicle.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>{vehicle.name}</div>
                                            {vehicle.category && (
                                                <div style={{ fontSize: "11px", color: "rgba(52,211,153,0.55)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{vehicle.category}</div>
                                            )}
                                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                                <span style={{ fontSize: "20px", fontWeight: "900", color: "#34d399" }}>₹{vehicle.rentalPricePerDay}</span>
                                                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>/ day</span>
                                            </div>
                                        </div>
                                    </div>
                                </InfoPanel>

                                {/* ── Partner card ── */}
                                <InfoPanel title="Partner Information" icon="🤝" delay={80}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>👨‍🌾</div>
                                            <div>
                                                <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>{partner.name}</div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span style={{ color: "#fbbf24", fontSize: "13px" }}>⭐ {partner.rating}</span>
                                                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>· {partner.distance} away</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: "5px 14px", borderRadius: "99px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.28)", color: "#34d399", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>
                                            ✓ Verified Partner
                                        </div>
                                    </div>
                                </InfoPanel>

                                {/* ── Ride details ── */}
                                <InfoPanel title="Ride Details" icon="📋" delay={160}>
                                    <div>
                                        <Row icon="📍" label="Pickup" value={pickup} />
                                        <Row icon="🏁" label="Destination" value={destination} />
                                        <Row icon="📅" label="Duration" value={`${days} ${days === 1 ? "day" : "days"}`} />
                                        <div style={{ borderBottom: "none" }}>
                                            <Row icon="🚜" label="Vehicle" value={vehicle.name} />
                                        </div>
                                    </div>
                                </InfoPanel>

                                {/* ── Fare summary ── */}
                                <div style={{
                                    background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)",
                                    borderRadius: "22px", padding: "24px 26px",
                                    animation: `cardIn 0.5s 240ms both ease, fareGlow 3s ease-in-out infinite`,
                                    position: "relative", overflow: "hidden",
                                }}>
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)" }} />
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.5)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "15px" }}>💰</span> Fare Summary
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                                        <span>Base Fare × {days} {days === 1 ? "day" : "days"}</span>
                                        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>₹{vehicle.rentalPricePerDay * days}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                                        <span>Partner Service Fee</span>
                                        <span style={{ color: "#34d399", fontWeight: "700" }}>Free</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", marginTop: "4px" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "700", color: "rgba(255,255,255,0.7)" }}>Total</span>
                                        <span style={{ fontSize: "clamp(28px,5vw,38px)", fontWeight: "900", color: "#34d399", letterSpacing: "-1px" }}>₹{totalFare.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", animation: "cardIn 0.3s both ease" }}>
                                        <span style={{ fontSize: "18px" }}>❌</span>
                                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#f87171" }}>{error}</span>
                                    </div>
                                )}

                                {/* ── Confirm button ── */}
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading || !state}
                                    style={{
                                        marginTop: "16px", width: "100%",
                                        padding: "17px",
                                        borderRadius: "16px", border: "none",
                                        background: loading ? "rgba(52,211,153,0.12)" : "linear-gradient(135deg,#059669,#047857)",
                                        color: loading ? "rgba(52,211,153,0.5)" : "#fff",
                                        fontSize: "16px", fontWeight: "800", fontFamily: "inherit",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        letterSpacing: "0.3px",
                                        boxShadow: loading ? "none" : "0 6px 28px rgba(5,150,105,0.40)",
                                        transition: "all 0.25s",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                        animation: "cardIn 0.5s 320ms both ease",
                                    }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 10px 36px rgba(5,150,105,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? "none" : "0 6px 28px rgba(5,150,105,0.40)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                >
                                    {loading ? (
                                        <>
                                            <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(52,211,153,0.25)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                            Redirecting to payment…
                                        </>
                                    ) : (
                                        <>✔ Confirm & Pay ₹{totalFare.toLocaleString()}</>
                                    )}
                                </button>

                                {/* Trust badges */}
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px", animation: "cardIn 0.5s 380ms both ease" }}>
                                    {[
                                        { icon: "🔒", text: "Stripe Secured" },
                                        { icon: "✅", text: "Instant Confirmation" },
                                        { icon: "↩️", text: "Easy Cancellation" },
                                    ].map((b) => (
                                        <div key={b.text} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: "600" }}>
                                            {b.icon} {b.text}
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
};

export default ConfirmRide;
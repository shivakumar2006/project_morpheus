import React, { useState } from "react";
import { useGetCartQuery } from "../store/api/CartApi";
import { useCreateCheckoutSessionMutation } from "../store/api/PaymentApi";

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
        {[...Array(24)].map((_, i) => (
            <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: `rgba(52,211,153,${Math.random() * 0.10 + 0.03})`,
                width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
            }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.10),transparent)", animation: "scanLine 12s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Service config ────────────────────────────────────────────────────────────
const SERVICE_META = {
    crop: { icon: "🌾", color: "#34d399" },
    fruit: { icon: "🍎", color: "#f9a8d4" },
    vegetable: { icon: "🥦", color: "#86efac" },
    rental: { icon: "🚜", color: "#fdba74" },
    tool: { icon: "⚙️", color: "#c4b5fd" },
    essential: { icon: "🧴", color: "#fcd34d" },
};

const SERVICE_IMAGE_URL = {
    crop: "http://localhost:8000/images/",
    fruit: "http://localhost:8002/images/",
    vegetable: "http://localhost:8001/images/",
    rental: "http://localhost:8095/images/",
    tool: "http://localhost:8004/images/",
};

const resolveImage = (item) => {
    if (!item?.image) return null;
    const key = String(item.service).toLowerCase().trim();
    const base = SERVICE_IMAGE_URL[key];
    return base ? base + item.image : null;
};

// ── Order row ─────────────────────────────────────────────────────────────────
const OrderRow = ({ item, index }) => {
    const [hovered, setHovered] = React.useState(false);
    const meta = SERVICE_META[String(item.service).toLowerCase().trim()] || { icon: "🛍️", color: "#34d399" };
    const imgSrc = resolveImage(item);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "16px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                animation: `cardIn 0.4s ${index * 70}ms both ease`,
                transition: "background 0.2s",
                borderRadius: "4px",
            }}
        >
            {/* Image / fallback */}
            <div style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", flexShrink: 0, background: "rgba(0,0,0,0.3)", border: `1px solid ${meta.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imgSrc ? (
                    <img src={imgSrc} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
                ) : (
                    <span style={{ fontSize: "28px" }}>{meta.icon}</span>
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", marginBottom: "4px" }}>{item.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "11px", color: meta.color, fontWeight: "700", background: `${meta.color}14`, border: `1px solid ${meta.color}30`, borderRadius: "99px", padding: "2px 8px" }}>
                        {meta.icon} Qty: {item.quantity}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>₹{item.price} each</div>
                </div>
            </div>

            {/* Line total */}
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px", flexShrink: 0 }}>
                ₹{item.itemTotal}
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const { data, isLoading } = useGetCartQuery();
    const [createSession] = useCreateCheckoutSessionMutation();
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        setPaying(true);
        setError(null);
        try {
            const res = await createSession({
                mode: "cart",
                items: items.map(i => ({ title: i.name, price: i.price, quantity: i.quantity })),
                rideData: null,
            }).unwrap();
            window.location.href = res.url;
        } catch (err) {
            console.error("Payment error:", err);
            setError("Payment failed. Please try again.");
            setPaying(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(18px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes fareGlow { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.15); } 50% { box-shadow:0 0 28px 4px rgba(52,211,153,0.10); } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(28px,-18px); } 66% { transform:translate(-14px,22px); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(-22px,18px); } 66% { transform:translate(18px,-26px); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(12px,-12px); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-20px); opacity:0.3; } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "56px 24px 80px" }}>

                    {/* Loading */}
                    {isLoading && (
                        <div style={{ textAlign: "center", padding: "80px 0" }}>
                            <div style={{ display: "inline-flex", position: "relative", width: "52px", height: "52px", marginBottom: "18px" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.12)" }} />
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                                <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
                            </div>
                            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", fontWeight: "600" }}>Loading checkout…</div>
                        </div>
                    )}

                    {!isLoading && (() => {
                        if (!data?.items?.length) return (
                            <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px" }}>
                                <div style={{ fontSize: "56px", marginBottom: "18px" }}>🛒</div>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: "rgba(255,255,255,0.4)" }}>Your cart is empty</div>
                            </div>
                        );

                        const { items, subtotal, platformFee, finalAmount } = data;

                        return (
                            <>
                                {/* Header */}
                                <div style={{ marginBottom: "36px", animation: "heroIn 0.7s both ease" }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "16px" }}>
                                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Final Step · Payment</span>
                                    </div>
                                    <h1 style={{ margin: "0", fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", letterSpacing: "-1.2px", lineHeight: 1.05 }}>
                                        Checkout
                                    </h1>
                                    <p style={{ margin: "10px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                                        Review your order and complete payment securely via Stripe.
                                    </p>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

                                    {/* ── Left: Order summary ── */}
                                    <div style={{
                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "22px", padding: "28px",
                                        backdropFilter: "blur(18px)",
                                        boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                                        position: "relative", overflow: "hidden",
                                        animation: "cardIn 0.5s both ease",
                                    }}>
                                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.35),transparent)" }} />

                                        {/* Section label */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: "800", color: "rgba(255,255,255,0.65)" }}>🧾 Order Summary</span>
                                            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: "600" }}>{items.length} {items.length === 1 ? "item" : "items"}</span>
                                        </div>

                                        {/* Items */}
                                        <div>
                                            {items.map((item, i) => (
                                                <OrderRow key={item.itemId} item={item} index={i} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Right: Price + Pay ── */}
                                    <div style={{ position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "14px", animation: "cardIn 0.5s 100ms both ease" }}>

                                        {/* Price breakdown */}
                                        <div style={{
                                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "22px", padding: "24px 26px",
                                            backdropFilter: "blur(18px)",
                                            boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                                            position: "relative", overflow: "hidden",
                                        }}>
                                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.35),transparent)" }} />

                                            <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "18px" }}>
                                                Price Details
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Subtotal</span>
                                                <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>₹{subtotal}</span>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Platform Fee</span>
                                                <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>₹{platformFee}</span>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", animation: "fareGlow 3s ease-in-out infinite" }}>
                                                <span style={{ fontSize: "15px", fontWeight: "800", color: "rgba(255,255,255,0.7)" }}>Total</span>
                                                <span style={{ fontSize: "30px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.8px" }}>₹{finalAmount}</span>
                                            </div>
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <div style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span>❌</span>
                                                <span style={{ fontSize: "13px", fontWeight: "700", color: "#f87171" }}>{error}</span>
                                            </div>
                                        )}

                                        {/* Pay button */}
                                        <button
                                            onClick={handlePayment}
                                            disabled={paying}
                                            style={{
                                                width: "100%", padding: "17px",
                                                borderRadius: "16px", border: "none",
                                                background: paying ? "rgba(52,211,153,0.12)" : "linear-gradient(135deg,#059669,#047857)",
                                                color: paying ? "rgba(52,211,153,0.5)" : "#fff",
                                                fontSize: "16px", fontWeight: "800", fontFamily: "inherit",
                                                cursor: paying ? "not-allowed" : "pointer",
                                                boxShadow: paying ? "none" : "0 6px 28px rgba(5,150,105,0.40)",
                                                transition: "all 0.25s",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                                letterSpacing: "0.3px",
                                            }}
                                            onMouseEnter={e => { if (!paying) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 34px rgba(5,150,105,0.55)"; } }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = paying ? "none" : "0 6px 28px rgba(5,150,105,0.40)"; }}
                                        >
                                            {paying ? (
                                                <>
                                                    <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(52,211,153,0.25)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                                    Redirecting…
                                                </>
                                            ) : (
                                                <>🔒 Pay ₹{finalAmount}</>
                                            )}
                                        </button>

                                        {/* Trust */}
                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                                            {["🔒 Stripe Secured", "⚡ Instant", "↩️ Easy Returns"].map(t => (
                                                <div key={t} style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontWeight: "600", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "99px", padding: "4px 12px" }}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
}
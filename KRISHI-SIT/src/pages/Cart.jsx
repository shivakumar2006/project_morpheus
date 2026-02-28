import React from "react";
import {
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetCartQuery,
} from "../store/api/CartApi";
import { animated, useSpring } from "@react-spring/web";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { w: "520px", h: "520px", top: "-16%", left: "-10%", bg: "radial-gradient(circle,rgba(34,197,94,0.09) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
      { w: "380px", h: "380px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 65%)", anim: "orbFloat2 26s ease-in-out infinite" },
      { w: "260px", h: "260px", top: "30%", left: "44%", bg: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
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

// ── Service badge config ──────────────────────────────────────────────────────
const SERVICE_META = {
  crop: { label: "Crop", icon: "🌾", color: "#34d399" },
  fruit: { label: "Fruit", icon: "🍎", color: "#f9a8d4" },
  vegetable: { label: "Vegetable", icon: "🥦", color: "#86efac" },
  rental: { label: "Rental", icon: "🚜", color: "#fdba74" },
  tool: { label: "Tool", icon: "⚙️", color: "#c4b5fd" },
  essential: { label: "Essential", icon: "🧴", color: "#fcd34d" },
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

// ── Cart item card ────────────────────────────────────────────────────────────
const CartItem = ({ item, onQty, onRemove, index }) => {
  const [hovered, setHovered] = React.useState(false);
  const meta = SERVICE_META[String(item.service).toLowerCase().trim()] || { label: item.service, icon: "🛍️", color: "#34d399" };
  const imgSrc = resolveImage(item);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: "18px", alignItems: "flex-start",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(52,211,153,0.22)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "20px", padding: "20px",
        backdropFilter: "blur(16px)",
        boxShadow: hovered ? "0 16px 44px rgba(0,0,0,0.45)" : "0 4px 20px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.28s ease",
        position: "relative", overflow: "hidden",
        animation: `cardIn 0.5s ${index * 80}ms both ease`,
      }}
    >
      {/* Top glow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? "linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", transition: "background 0.3s" }} />

      {/* Image */}
      <div style={{ width: "110px", height: "130px", borderRadius: "14px", overflow: "hidden", flexShrink: 0, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hovered ? "scale(1.07)" : "scale(1)" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ fontSize: "32px" }}>{meta.icon}</span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 6px", lineHeight: 1.3 }}>{item.name}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(2,12,6,0.55) 0%,transparent 50%)", pointerEvents: "none" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Service badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${meta.color}18`, border: `1px solid ${meta.color}35`, borderRadius: "99px", padding: "2px 10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px" }}>{meta.icon}</span>
          <span style={{ fontSize: "10px", fontWeight: "700", color: meta.color, letterSpacing: "0.5px", textTransform: "uppercase" }}>{meta.label}</span>
        </div>

        <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", marginBottom: "4px", lineHeight: 1.2 }}>
          {item.name}
        </div>

        {item.category && (
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginBottom: "14px" }}>
            {item.category}
          </div>
        )}

        {/* Quantity stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "12px", overflow: "hidden", width: "fit-content", marginBottom: "14px" }}>
          <button
            onClick={() => onQty(item.itemId, "dec")}
            style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.04)", border: "none", borderRight: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "18px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s,color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.color = "#34d399"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >−</button>
          <div style={{ width: "40px", textAlign: "center", fontSize: "15px", fontWeight: "800", color: "#fff" }}>{item.quantity}</div>
          <button
            onClick={() => onQty(item.itemId, "inc")}
            style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.04)", border: "none", borderLeft: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: "18px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s,color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.color = "#34d399"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >+</button>
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ fontSize: "22px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
          {item.quantity > 1 && (
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)" }}>₹{item.price} each</span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.itemId)}
        style={{ position: "absolute", top: "14px", right: "14px", width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s,border-color 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.20)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; }}
      >
        <X size={14} color="#f87171" />
      </button>
    </div>
  );
};

// ── Main Cart ─────────────────────────────────────────────────────────────────
export default function Cart() {
  const { data, isLoading } = useGetCartQuery();
  const cart = data?.items || [];
  const subtotal = data?.subtotal || 0;
  const platformFee = data?.platformFee || 20;
  const finalAmount = data?.finalAmount || 0;

  const [updateQty] = useUpdateCartQuantityMutation();
  const [removeItem] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const navigate = useNavigate();

  const totalSpring = useSpring({
    val: finalAmount,
    config: { tension: 170, friction: 26 },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(22px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes fareGlow { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.15); } 50% { box-shadow:0 0 28px 4px rgba(52,211,153,0.10); } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(28px,-18px); } 66% { transform:translate(-14px,22px); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(-22px,18px); } 66% { transform:translate(18px,-26px); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(12px,-12px); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-20px); opacity:0.3; } }
        @keyframes emptyFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
        <Particles />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 80px" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "36px", animation: "heroIn 0.7s both ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 14px", marginBottom: "16px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Shopping Bag</span>
            </div>
            <h1 style={{ margin: "0", fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", letterSpacing: "-1.2px", lineHeight: 1.05 }}>
              Your Cart
              {cart.length > 0 && (
                <span style={{ marginLeft: "12px", fontSize: "clamp(16px,2.5vw,22px)", fontWeight: "700", color: "rgba(52,211,153,0.6)", letterSpacing: "0" }}>
                  ({cart.length} {cart.length === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
          </div>

          {/* ── Loading ── */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ display: "inline-flex", position: "relative", width: "52px", height: "52px", marginBottom: "18px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.12)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
              </div>
              <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", fontWeight: "600" }}>Loading your cart…</div>
            </div>
          )}

          {!isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: cart.length > 0 ? "1fr 340px" : "1fr", gap: "24px", alignItems: "start" }}>

              {/* ── Left: Items ── */}
              <div>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", animation: "cardIn 0.5s both ease" }}>
                    <div style={{ fontSize: "72px", marginBottom: "20px", animation: "emptyFloat 3s ease-in-out infinite" }}>🛒</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>Your cart is empty</div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", marginBottom: "28px", lineHeight: 1.6 }}>
                      Explore our marketplace and add fresh produce or farming essentials.
                    </p>
                    <button
                      onClick={() => navigate("/store")}
                      style={{ padding: "13px 32px", borderRadius: "99px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 24px rgba(5,150,105,0.4)", transition: "transform 0.2s,box-shadow 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(5,150,105,0.55)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,150,105,0.4)"; }}
                    >
                      Shop Now →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {cart.map((item, i) => (
                      <CartItem
                        key={item.itemId}
                        item={item}
                        index={i}
                        onQty={updateQty}
                        onRemove={removeItem}
                      />
                    ))}

                    {/* Clear cart button below items */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                      <button
                        onClick={() => clearCart()}
                        style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.22)", background: "rgba(239,68,68,0.07)", color: "#f87171", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.22)"; }}
                      >
                        <X size={14} /> Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right: Summary ── */}
              {cart.length > 0 && (
                <div style={{ position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "14px", animation: "cardIn 0.5s 120ms both ease" }}>

                  {/* Price details panel */}
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "22px", padding: "24px 26px",
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.35),transparent)" }} />

                    <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "18px" }}>
                      Price Details · {cart.length} {cart.length === 1 ? "item" : "items"}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Subtotal</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>Platform Fee</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>₹{platformFee}</span>
                    </div>

                    {/* Animated total */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "16px 0 0",
                      animation: "fareGlow 3s ease-in-out infinite",
                    }}>
                      <span style={{ fontSize: "15px", fontWeight: "800", color: "rgba(255,255,255,0.75)" }}>Total</span>
                      <animated.span style={{ fontSize: "28px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.8px" }}>
                        {totalSpring.val.to(v => `₹${v.toFixed(2)}`)}
                      </animated.span>
                    </div>
                  </div>

                  {/* Savings chip */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "14px", padding: "10px 16px" }}>
                    <span style={{ fontSize: "16px" }}>✅</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "rgba(52,211,153,0.75)" }}>You're saving with direct farm prices!</span>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={() => navigate("/checkout")}
                    style={{ width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 26px rgba(5,150,105,0.40)", transition: "transform 0.2s,box-shadow 0.2s", letterSpacing: "0.3px" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 34px rgba(5,150,105,0.55)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 26px rgba(5,150,105,0.40)"; }}
                  >
                    Proceed to Checkout →
                  </button>

                  {/* Trust strip */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    {["🔒 Secure", "🚚 Fast Delivery", "↩️ Easy Returns"].map(t => (
                      <div key={t} style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontWeight: "600", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "99px", padding: "4px 12px" }}>{t}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
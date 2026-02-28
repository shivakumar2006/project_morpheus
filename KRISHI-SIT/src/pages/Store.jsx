import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated background ────────────────────────────────────────────────────────
const Particles = React.memo(() => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { w: "580px", h: "580px", top: "-18%", left: "-12%", bg: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
      { w: "420px", h: "420px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
      { w: "300px", h: "300px", top: "30%", left: "42%", bg: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
      { w: "240px", h: "240px", bottom: "5%", left: "8%", bg: "radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 65%)", anim: "orbFloat1 19s ease-in-out infinite reverse" },
    ].map((o, i) => (
      <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
    ))}
    {[...Array(35)].map((_, i) => (
      <div key={i} style={{
        position: "absolute", borderRadius: "50%",
        background: `rgba(${i % 2 === 0 ? "52,211,153" : "129,140,248"},${Math.random() * 0.12 + 0.03})`,
        width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
        animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
      }} />
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.10), transparent)", animation: "scanLine 12s linear infinite" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
  </div>
));

// ── Store card ────────────────────────────────────────────────────────────────
const StoreCard = ({ onClick, accent, icon, title, desc, tag, features, delay }) => {
  const [hovered, setHovered] = useState(false);

  const colors = {
    green: { primary: "#34d399", grad: "linear-gradient(135deg,#059669,#047857)", glow: "rgba(52,211,153,0.4)", border: "rgba(52,211,153,0.22)", bgHover: "rgba(52,211,153,0.08)", tagBg: "rgba(52,211,153,0.12)", tagColor: "#34d399", tagBorder: "rgba(52,211,153,0.3)" },
    indigo: { primary: "#818cf8", grad: "linear-gradient(135deg,#4f46e5,#3730a3)", glow: "rgba(129,140,248,0.4)", border: "rgba(129,140,248,0.22)", bgHover: "rgba(129,140,248,0.08)", tagBg: "rgba(129,140,248,0.12)", tagColor: "#818cf8", tagBorder: "rgba(129,140,248,0.3)" },
  }[accent];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flex: "1 1 340px",
        maxWidth: "460px",
        background: hovered ? colors.bgHover : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? colors.border : "rgba(255,255,255,0.08)"}`,
        borderRadius: "28px",
        padding: "40px 36px",
        cursor: "pointer",
        backdropFilter: "blur(20px)",
        boxShadow: hovered ? `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${colors.border}` : "0 16px 48px rgba(0,0,0,0.35)",
        transform: hovered ? "translateY(-10px) scale(1.015)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        overflow: "hidden",
        animation: `cardIn 0.7s ${delay}ms both ease`,
      }}
    >
      {/* Top edge glow line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", transition: "background 0.35s" }} />

      {/* Background corner accent */}
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: `radial-gradient(circle, ${colors.primary}12 0%, transparent 65%)`, transition: "opacity 0.35s", opacity: hovered ? 1 : 0.4, pointerEvents: "none" }} />

      {/* Tag */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: colors.tagBg, border: `1px solid ${colors.tagBorder}`, borderRadius: "99px", padding: "4px 12px", marginBottom: "28px", fontSize: "11px", fontWeight: "700", color: colors.tagColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: colors.primary, display: "inline-block", boxShadow: `0 0 6px ${colors.primary}` }} />
        {tag}
      </div>

      {/* Icon bubble */}
      <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: hovered ? colors.grad : "rgba(255,255,255,0.06)", border: `1px solid ${hovered ? "transparent" : "rgba(255,255,255,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: hovered ? `0 8px 28px ${colors.glow}` : "none", transition: "all 0.35s", transform: hovered ? "scale(1.1) rotate(-3deg)" : "scale(1) rotate(0)" }}>
        {icon(hovered)}
      </div>

      {/* Title */}
      <h2 style={{ margin: "0 0 10px", fontSize: "clamp(22px,3vw,28px)", fontWeight: "900", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
        {title}
      </h2>

      {/* Desc */}
      <p style={{ margin: "0 0 28px", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
        {desc}
      </p>

      {/* Feature list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.55)", fontWeight: "500" }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: colors.tagBg, border: `1px solid ${colors.tagBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0 }}>✓</span>
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ padding: "12px 24px", borderRadius: "99px", background: hovered ? colors.grad : "rgba(255,255,255,0.06)", border: `1px solid ${hovered ? "transparent" : "rgba(255,255,255,0.12)"}`, color: "#fff", fontSize: "14px", fontWeight: "800", boxShadow: hovered ? `0 6px 24px ${colors.glow}` : "none", transition: "all 0.3s", letterSpacing: "0.3px" }}>
          Explore →
        </div>
        <div style={{ fontSize: "28px", opacity: hovered ? 1 : 0.4, transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "all 0.3s" }}>
          {accent === "green" ? "🌾" : "⚙️"}
        </div>
      </div>
    </div>
  );
};

// ── Stat chip ─────────────────────────────────────────────────────────────────
const StatChip = ({ icon, value, label, delay }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "12px 18px", animation: `cardIn 0.5s ${delay}ms both ease`, transition: "border-color 0.2s, background 0.2s, transform 0.2s", cursor: "default" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; e.currentTarget.style.background = "rgba(52,211,153,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <span style={{ fontSize: "20px" }}>{icon}</span>
    <div>
      <div style={{ fontSize: "16px", fontWeight: "900", color: "#34d399", lineHeight: 1, letterSpacing: "-0.3px" }}>{value}</div>
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const Store = () => {
  const navigate = useNavigate();

  const greenIcon = (hovered) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "#34d399"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );

  const indigoIcon = (hovered) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={hovered ? "#fff" : "#818cf8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn    { from { opacity:0; transform:translateY(-22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn    { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot  { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes scanLine  { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.35; } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
        <Particles />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "80px 28px 100px" }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: "72px", animation: "heroIn 0.8s both ease" }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 18px", marginBottom: "24px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Dual Marketplace · Live</span>
            </div>

            <h1 style={{ margin: "0 0 16px", fontSize: "clamp(40px,7vw,76px)", fontWeight: "900", lineHeight: 1.0, letterSpacing: "-2px" }}>
              Krishi{" "}
              <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                Store
              </span>
            </h1>

            <p style={{ margin: "0 auto 40px", maxWidth: "560px", fontSize: "clamp(15px,2.5vw,18px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
              Explore our dual marketplace —{" "}
              <span style={{ color: "#34d399", fontWeight: "600" }}>fresh produce directly from farmers</span>{" "}
              and{" "}
              <span style={{ color: "#818cf8", fontWeight: "600" }}>essential tools for smarter farming</span>.
              <br />
              <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: "600" }}>Buy smart, farm smart.</span>
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <StatChip icon="🛒" value="12K+" label="Orders Placed" delay={0} />
              <StatChip icon="👨‍🌾" value="3K+" label="Partner Farmers" delay={80} />
              <StatChip icon="⚙️" value="500+" label="Products Listed" delay={160} />
              <StatChip icon="⭐" value="4.9" label="Avg Rating" delay={240} />
            </div>
          </div>

          {/* ── Two store cards ── */}
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "72px" }}>

            <StoreCard
              onClick={() => navigate("/farmer-user")}
              accent="green"
              tag="Farm Fresh"
              icon={greenIcon}
              title="Farmer to Users"
              desc="Buy fresh, seasonal produce directly from trusted, verified farmers near you. No middlemen — just honest food at fair prices."
              features={[
                "100% farm-fresh produce",
                "Verified farmer network",
                "Same-day local delivery",
                "Seasonal & organic options",
              ]}
              delay={100}
            />

            <StoreCard
              onClick={() => navigate("/product")}
              accent="indigo"
              tag="Farming Tools"
              icon={indigoIcon}
              title="Farmer Essentials"
              desc="Everything a modern farmer needs — from seeds and fertilizers to precision tools, machinery, and smart farming equipment."
              features={[
                "Curated tool & seed catalog",
                "Bulk pricing available",
                "Expert product guidance",
                "Fast nationwide delivery",
              ]}
              delay={200}
            />
          </div>

          {/* ── Bottom info strip ── */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "24px 32px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(12px)",
            animation: "cardIn 0.6s 320ms both ease",
          }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>Need help choosing?</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Our team is available to guide you through the right marketplace.</div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { icon: "🔒", text: "Secure Payments" },
                { icon: "🚚", text: "Fast Delivery" },
                { icon: "↩️", text: "Easy Returns" },
                { icon: "💬", text: "24/7 Support" },
              ].map((b) => (
                <div key={b.text} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Store;
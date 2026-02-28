import food from '../assets/fsd1.jpeg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { w: "580px", h: "580px", top: "-18%", left: "-12%", bg: "radial-gradient(circle,rgba(34,197,94,0.09) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
      { w: "420px", h: "420px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
      { w: "300px", h: "300px", top: "30%", left: "42%", bg: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
      { w: "220px", h: "220px", bottom: "5%", left: "8%", bg: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 65%)", anim: "orbFloat1 19s ease-in-out infinite reverse" },
    ].map((o, i) => (
      <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
    ))}
    {[...Array(30)].map((_, i) => (
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

// ── Feature card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, onClick, color = "#34d399", index }) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}0a` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? `${color}35` : "rgba(255,255,255,0.08)"}`,
        borderRadius: "22px",
        padding: "28px 26px",
        cursor: isClickable ? "pointer" : "default",
        backdropFilter: "blur(16px)",
        boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.45)" : "0 4px 20px rgba(0,0,0,0.28)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        animation: `cardIn 0.5s ${index * 80}ms both ease`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top glow line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? `linear-gradient(90deg,transparent,${color},transparent)` : "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", transition: "background 0.3s" }} />
      {/* Corner orb */}
      <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "130px", height: "130px", borderRadius: "50%", background: `radial-gradient(circle,${color}12 0%,transparent 65%)`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.35s", pointerEvents: "none" }} />

      {/* Icon bubble */}
      <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: hovered ? `${color}20` : "rgba(255,255,255,0.06)", border: `1px solid ${hovered ? `${color}40` : "rgba(255,255,255,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "18px", transition: "all 0.3s", transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0)" }}>
        {icon}
      </div>

      <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{desc}</div>

      {isClickable && (
        <div style={{ marginTop: "16px", fontSize: "12px", fontWeight: "700", color, display: "flex", alignItems: "center", gap: "5px", opacity: hovered ? 1 : 0.5, transition: "opacity 0.25s" }}>
          Learn more <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "translateX(0)", display: "inline-block" }}>→</span>
        </div>
      )}
    </div>
  );
};

// ── Card color palette (per feature) ─────────────────────────────────────────
const CARD_COLORS = ["#34d399", "#6ee7b7", "#fcd34d", "#86efac", "#a7f3d0", "#fdba74"];

// ── Main component ─────────────────────────────────────────────────────────────
export default function FoodSupplyChain() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: "🌾",
      title: t("directFarmMarket"),
      desc: t("directFarmMarketDesc"),
      onClick: () => window.open("https://fasalmandi.com/#:~:text=At%20FasalMandi%2C%20we%20are%20committed,middleman%20and%20keeping%20prices%20fair", "_blank"),
    },
    {
      icon: "💰",
      title: t("transparentPricing"),
      desc: t("transparentPricingDesc"),
      onClick: () => navigate("/pricing-system"),
    },
    {
      icon: "📦",
      title: t("digitalInventory"),
      desc: t("digitalInventoryDesc"),
      onClick: null,
    },
    {
      icon: "🚚",
      title: t("logisticsDelivery"),
      desc: t("logisticsDeliveryDesc"),
      onClick: null,
    },
    {
      icon: "❄️",
      title: t("coldStorageSupport"),
      desc: t("coldStorageSupportDesc"),
      onClick: () => navigate("/cold-storage"),
    },
    {
      icon: "♻️",
      title: t("reducedWaste"),
      desc: t("reducedWasteDesc"),
      onClick: null,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn    { from { opacity:0; transform:translateY(-24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn    { from { opacity:0; transform:translateY(22px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes imgIn     { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes pulseDot  { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes scanLine  { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
        <Particles />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ══════════════════════════════════════
              HERO
          ══════════════════════════════════════ */}
          <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 28px 0", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center", justifyContent: "center" }}>

            {/* Left copy */}
            <div style={{ flex: "1 1 340px", maxWidth: "560px", animation: "heroIn 0.8s both ease" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "22px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Krishi · Food Supply Chain</span>
              </div>

              <h1 style={{ margin: "0 0 18px", fontSize: "clamp(32px,5.5vw,60px)", fontWeight: "900", letterSpacing: "-2px", lineHeight: 1.0 }}>
                {t("foodSupplyChain")}
                <span style={{ display: "block", background: "linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                  Reimagined
                </span>
              </h1>

              <p style={{ margin: "0 0 36px", fontSize: "16px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif", maxWidth: "460px" }}>
                {t("foodSupplySubheading")}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/farmer-user")}
                  style={{ padding: "14px 30px", borderRadius: "99px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: "14px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 26px rgba(5,150,105,0.40)", transition: "transform 0.2s,box-shadow 0.2s", letterSpacing: "0.3px" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(5,150,105,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 26px rgba(5,150,105,0.40)"; }}
                >
                  {t("listYourProduce")} →
                </button>
                <button
                  onClick={() => navigate("/product")}
                  style={{ padding: "14px 28px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.35)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  {t("viewInventory")}
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "28px", marginTop: "36px", flexWrap: "wrap" }}>
                {[
                  { value: "50K+", label: "Farmers" },
                  { value: "0%", label: "Middlemen" },
                  { value: "40%", label: "Less Waste" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hero image */}
            <div style={{ flex: "1 1 300px", maxWidth: "500px", animation: "imgIn 0.9s 120ms both ease", position: "relative" }}>
              <div style={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", border: "1px solid rgba(52,211,153,0.18)", position: "relative" }}>
                <img
                  src={food}
                  alt="Food Supply Chain"
                  style={{ width: "100%", height: "420px", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(2,12,6,0.55) 0%,transparent 50%)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)" }} />

                {/* Floating chip on image */}
                <div style={{ position: "absolute", bottom: "20px", left: "20px", background: "rgba(2,12,6,0.88)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "16px", padding: "12px 18px", backdropFilter: "blur(12px)" }}>
                  <div style={{ fontSize: "12px", color: "rgba(52,211,153,0.7)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>Farm to Table</div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff" }}>Direct · Fresh · Fair</div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              SECTION DIVIDER
          ══════════════════════════════════════ */}
          <div style={{ maxWidth: "1200px", margin: "72px auto 0", padding: "0 28px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.45)" }}>Core Features</span>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
          </div>

          {/* ══════════════════════════════════════
              FEATURE CARDS
          ══════════════════════════════════════ */}
          <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 28px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "18px" }}>
              {features.map((f, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  onClick={f.onClick}
                  color={CARD_COLORS[i % CARD_COLORS.length]}
                />
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════
              CTA BANNER
          ══════════════════════════════════════ */}
          <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 100px" }}>
            <div style={{
              background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)",
              borderRadius: "28px", padding: "56px 48px",
              textAlign: "center", position: "relative", overflow: "hidden",
              animation: "cardIn 0.6s both ease",
            }}>
              {/* Decorative orbs inside CTA */}
              <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.45),transparent)" }} />

              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "24px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Get Started Today</span>
              </div>

              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(26px,4vw,44px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.05, position: "relative" }}>
                {t("getStartedWithKrishi")}
              </h2>

              <p style={{ margin: "0 auto 40px", maxWidth: "520px", fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
                {t("ctaSubheading")}
              </p>

              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
                <button
                  onClick={() => navigate("/farmer-user")}
                  style={{ padding: "15px 36px", borderRadius: "99px", border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 28px rgba(5,150,105,0.45)", transition: "transform 0.2s,box-shadow 0.2s", letterSpacing: "0.3px" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 38px rgba(5,150,105,0.6)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(5,150,105,0.45)"; }}
                >
                  🌾 {t("listYourProduce")}
                </button>
                <button
                  onClick={() => navigate("/product")}
                  style={{ padding: "15px 34px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.10)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.38)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                >
                  📦 {t("viewInventory")}
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
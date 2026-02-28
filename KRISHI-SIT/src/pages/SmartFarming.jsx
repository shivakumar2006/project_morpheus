import React, { useState, useEffect } from "react";
// import WeatherForecast from "../components/WeatherForecast";
import WeatherForcast from "../components/WeatherForecast";
import CropRecommendation from "./CropRecommend";  // spelling fixed
import SoilHealth from "./SoilDetection";
import IrrigationScheduler from "./IrrigationSchedule";
import { useTranslation } from "react-i18next";
import Calculator from "./Calculator";

// ── Animated background ────────────────────────────────────────────────────────
const Particles = React.memo(() => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { w: "700px", h: "700px", top: "-20%", left: "-15%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 24s ease-in-out infinite" },
      { w: "500px", h: "500px", top: "50%", right: "-10%", bg: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
      { w: "380px", h: "380px", top: "30%", left: "38%", bg: "radial-gradient(circle, rgba(180,83,9,0.06) 0%, transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
      { w: "260px", h: "260px", bottom: "5%", left: "8%", bg: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite reverse" },
    ].map((o, i) => (
      <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
    ))}
    {[...Array(35)].map((_, i) => (
      <div key={i} style={{
        position: "absolute",
        borderRadius: "50%",
        background: `rgba(${["34,197,94", "14,165,233", "52,211,153"][i % 3]},${Math.random() * 0.15 + 0.04})`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 6}s ease-in-out infinite alternate`,
      }} />
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.12), transparent)", animation: "scanLine 12s linear infinite" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
  </div>
));

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  {
    key: "crop",
    icon: "🌾",
    labelKey: "cropRecommendation",
    color: "#34d399",
    shadow: "rgba(52,211,153,0.35)",
    bg: "linear-gradient(135deg,rgba(52,211,153,0.18),rgba(16,185,129,0.08))",
    activeBg: "linear-gradient(135deg,#059669,#047857)",
  },
  {
    key: "soil",
    icon: "🧪",
    labelKey: "soilHealth",
    color: "#f59e0b",
    shadow: "rgba(245,158,11,0.35)",
    bg: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(180,83,9,0.08))",
    activeBg: "linear-gradient(135deg,#d97706,#b45309)",
  },
  {
    key: "irrigation",
    icon: "💧",
    labelKey: "irrigationScheduler",
    color: "#38bdf8",
    shadow: "rgba(56,189,248,0.35)",
    bg: "linear-gradient(135deg,rgba(56,189,248,0.18),rgba(14,165,233,0.08))",
    activeBg: "linear-gradient(135deg,#0ea5e9,#0284c7)",
  },
  {
    key: "calculator",
    icon: "🟰",
    labelKey: "calculator",
    color: "#f59e0b",
    shadow: "rgba(245,158,11,0.35)",
    bg: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(180,83,9,0.08))",
    activeBg: "linear-gradient(135deg,#d97706,#b45309)",
  }
];

// ── Stat pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ icon, label, value, delay = 0 }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "16px", padding: "12px 18px",
    animation: `headerIn 0.6s ${delay}ms both ease`,
    transition: "border-color 0.2s, background 0.2s, transform 0.2s",
    cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.28)"; e.currentTarget.style.background = "rgba(52,211,153,0.07)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <span style={{ fontSize: "20px" }}>{icon}</span>
    <div>
      <div style={{ fontSize: "16px", fontWeight: "800", color: "#34d399", letterSpacing: "-0.3px" }}>{value}</div>
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const SmartFarming = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("crop");
  const [time, setTime] = useState(new Date());
  const [prevTab, setPrevTab] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleTab = (key) => {
    if (key === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(key);
  };

  const activeTabMeta = TABS.find(t => t.key === activeTab);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020c06 0%, #041510 38%, #030d08 100%)",
      fontFamily: "'Syne', 'Segoe UI', sans-serif",
      position: "relative",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <Particles />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ════════════════════════════════════════
            HERO HEADER
        ════════════════════════════════════════ */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "52px 28px 0" }}>

          {/* Badge + title */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "36px", animation: "headerIn 0.8s both ease" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "16px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 10px #34d399", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2.5px", textTransform: "uppercase" }}>AgriTech Intelligence Platform</span>
              </div>

              <h1 style={{ margin: "0 0 10px", fontSize: "clamp(32px,5vw,58px)", fontWeight: "900", lineHeight: 1.0, letterSpacing: "-1.5px" }}>
                {t("smartFarmingDashboard")}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ height: "2px", width: "36px", background: "linear-gradient(90deg,#34d399,transparent)", borderRadius: "99px" }} />
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "15px", lineHeight: 1.6 }}>
                  {t("smartFarmingSubtitle")}
                </p>
              </div>
            </div>

            {/* Live clock */}
            <div style={{ textAlign: "right", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "16px 24px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: "11px", color: "rgba(52,211,153,0.6)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", fontWeight: "700" }}>Local Time</div>
              <div style={{ fontSize: "30px", fontWeight: "900", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "2px", lineHeight: 1 }}>
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "5px" }}>
                {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "44px", animation: "headerIn 0.7s 100ms both ease" }}>
            <StatPill icon="🌾" label="Crops Monitored" value="22+" delay={0} />
            <StatPill icon="🌤️" label="Weather Zones" value="Live" delay={80} />
            <StatPill icon="🧪" label="Soil Classes" value="12+" delay={160} />
            <StatPill icon="💧" label="Water Saved" value="~18%" delay={240} />
            <StatPill icon="⚡" label="AI Accuracy" value="96.8%" delay={320} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            WEATHER — always pinned above tabs
        ════════════════════════════════════════ */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 36px", animation: "panelIn 0.7s 160ms both ease" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🌤️</span>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>
                {t("weatherMonitoring")}
              </span>
            </div>
            <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(52,211,153,0.14)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
            <WeatherForcast />
          </div>
        </div>

        {/* ════════════════════════════════════════
            TAB NAVIGATION
        ════════════════════════════════════════ */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 28px 0", animation: "panelIn 0.7s 240ms both ease" }}>

          {/* Tab strip */}
          <div style={{
            display: "flex",
            gap: "10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "22px",
            padding: "8px",
            backdropFilter: "blur(16px)",
            marginBottom: "0",
            flexWrap: "wrap",
          }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTab(tab.key)}
                  style={{
                    flex: "1 1 160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "14px 20px",
                    borderRadius: "16px",
                    border: isActive ? `1px solid ${tab.color}40` : "1px solid transparent",
                    background: isActive ? tab.activeBg : "transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                    fontSize: "14px",
                    fontWeight: "700",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    boxShadow: isActive ? `0 6px 24px ${tab.shadow}` : "none",
                    transition: "all 0.25s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = tab.bg; e.currentTarget.style.color = tab.color; e.currentTarget.style.border = `1px solid ${tab.color}25`; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.border = "1px solid transparent"; } }}
                >
                  <span style={{ fontSize: "20px" }}>{tab.icon}</span>
                  <span>{t(tab.labelKey)}</span>
                  {isActive && (
                    <span style={{ position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)", width: "20px", height: "2px", borderRadius: "99px", background: "rgba(255,255,255,0.6)" }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active tab colour bar */}
          <div style={{ height: "3px", borderRadius: "0 0 99px 99px", background: `linear-gradient(90deg, transparent, ${activeTabMeta?.color}, transparent)`, opacity: 0.5, transition: "background 0.4s", marginBottom: "0" }} />
        </div>

        {/* ════════════════════════════════════════
            TAB CONTENT PANEL
        ════════════════════════════════════════ */}
        <div style={{ animation: "tabFadeIn 0.4s both ease" }} key={activeTab}>
          {activeTab === "soil" && <SoilHealth />}
          {activeTab === "crop" && <CropRecommendation />}
          {activeTab === "irrigation" && <IrrigationScheduler />}
          {activeTab === "calculator" && <Calculator />}
        </div>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <div style={{ textAlign: "center", padding: "36px 28px 52px", color: "rgba(255,255,255,0.14)", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <span>AgriTech Intelligence Platform</span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(52,211,153,0.3)", display: "inline-block" }} />
            <span>Powered by AI · Real-time Data</span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(52,211,153,0.3)", display: "inline-block" }} />
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>

      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes headerIn {
          from { opacity: 0; transform: translateY(-22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #34d399; }
          50%       { opacity: 0.4; box-shadow: 0 0 20px #34d399; }
        }
        @keyframes scanLine {
          from { top: -2px; }
          to   { top: 100%; }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(32px,-22px) scale(1.05); }
          66%       { transform: translate(-16px,26px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-24px,20px) scale(1.04); }
          66%       { transform: translate(22px,-30px) scale(0.96); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(16px,-16px) scale(1.06); }
        }
        @keyframes particleDrift {
          from { transform: translateY(0) translateX(0); opacity: 0.06; }
          to   { transform: translateY(-24px) translateX(10px); opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.28); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default SmartFarming;
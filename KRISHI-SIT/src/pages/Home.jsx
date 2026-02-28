import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import heroImage from "../assets/hero.jpg";
import image from "../assets/image.jpg";
import image1 from "../assets/image1.jpg";
import image5 from "../assets/image5.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import InfiniteScroll from "../components/InfiniteScroll";
import { useTranslation } from "react-i18next";

// ── Animated counter hook ────────────────────────────────────────────────────
const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

// ── Intersection observer hook ───────────────────────────────────────────────
const useInView = (threshold = 0.2) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ── Stat counter card ────────────────────────────────────────────────────────
const StatCard = ({ value, suffix, label, icon, delay, inView }) => {
  const count = useCounter(value, 1600, inView);
  return (
    <div style={{
      textAlign: "center", padding: "28px 20px",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.14)",
      borderRadius: "20px", backdropFilter: "blur(12px)",
      animation: inView ? `cardIn 0.6s ${delay}ms both ease` : "none",
      transition: "transform 0.2s, border-color 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.14)"; }}
    >
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: "900", color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
        {count.toLocaleString()}<span style={{ color: "#34d399", fontSize: "0.6em" }}>{suffix}</span>
      </div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", marginTop: "8px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}>{label}</div>
    </div>
  );
};

// ── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ src, alt, title, desc, delay, inView }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    animation: inView ? `cardIn 0.6s ${delay}ms both ease` : "none",
  }}>
    <div style={{ position: "relative", width: "100%", maxWidth: "280px", marginBottom: "20px" }}>
      <div style={{ borderRadius: "20px", overflow: "hidden", aspectRatio: "4/5", boxShadow: "0 20px 48px rgba(0,0,0,0.5)" }}>
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", display: "block" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
      </div>
      {/* Frame accent */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "20px", border: "1px solid rgba(52,211,153,0.18)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", borderRadius: "20px 20px 0 0", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)" }} />
    </div>
    <h3 style={{ fontWeight: "800", fontSize: "17px", color: "#fff", marginBottom: "8px", letterSpacing: "-0.2px" }}>{title}</h3>
    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, textAlign: "center", maxWidth: "240px" }}>{desc}</p>
  </div>
);

// ── Section divider ──────────────────────────────────────────────────────────
const SectionDivider = ({ label, color = "rgba(52,211,153,0.55)" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color }}>{label}</span>
    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.12)" }} />
  </div>
);

// ── Main Home page ────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation();
  const [statsRef, statsInView] = useInView(0.2);
  const [whyRef, whyInView] = useInView(0.2);
  const [galleryRef, galleryInView] = useInView(0.15);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes heroIn   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn   { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 6px #34d399; } 50% { box-shadow:0 0 16px #34d399; } }
        @keyframes orbFloat { 0%,100% { transform:translate(0,0); } 50% { transform:translate(20px,-15px); } }
        @keyframes shimmerBg {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .leaflet-container { border-radius: 24px; }
      `}</style>

      <div style={{ fontFamily: "'Syne', 'Segoe UI', sans-serif", background: "#020c06", color: "#fff", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

          {/* Hero image with overlay */}
          <div style={{ position: "absolute", inset: 0 }}>
            <img src={heroImage} alt="Smart Farming" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            {/* Multi-layer overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(2,12,6,0.80) 0%, rgba(4,21,10,0.60) 50%, rgba(2,10,5,0.85) 100%)" }} />
            {/* Animated scan line */}
            <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)", animation: "scanLine 8s linear infinite" }} />
            {/* Grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          {/* Floating orbs */}
          <div style={{ position: "absolute", top: "10%", left: "5%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 65%)", animation: "orbFloat 12s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "5%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)", animation: "orbFloat 16s ease-in-out infinite reverse", pointerEvents: "none" }} />

          {/* Hero content */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "780px", padding: "0 28px" }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "6px 18px", marginBottom: "28px", animation: "heroIn 0.8s both ease" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>AgriTech Intelligence</span>
            </div>

            <h1 style={{ margin: "0 0 16px", fontSize: "clamp(36px,7vw,76px)", fontWeight: "900", lineHeight: 1.0, letterSpacing: "-2px", animation: "heroIn 0.8s 80ms both ease" }}>
              {t("homeSlogan1")}
              <span style={{ display: "block", background: "linear-gradient(90deg,#34d399 0%,#6ee7b7 40%,#a7f3d0 100%)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>
                {t("homeGreeting")}
              </span>
            </h1>

            <p style={{ margin: "0 0 10px", fontSize: "clamp(16px,2.5vw,22px)", color: "rgba(255,255,255,0.65)", fontWeight: "400", fontFamily: "'DM Sans', sans-serif", animation: "heroIn 0.8s 160ms both ease" }}>
              {t("homeSlogan2")}
            </p>

            <p style={{ margin: "0 0 44px", fontSize: "clamp(14px,2vw,16px)", color: "rgba(255,255,255,0.38)", fontStyle: "italic", fontFamily: "'DM Sans', sans-serif", animation: "heroIn 0.8s 220ms both ease" }}>
              {t("homeSlogan3")}
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", animation: "heroIn 0.8s 300ms both ease" }}>
              <a href="/smart-farming" style={{ padding: "14px 32px", borderRadius: "99px", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontWeight: "800", fontSize: "15px", textDecoration: "none", boxShadow: "0 6px 28px rgba(5,150,105,0.4)", transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "inherit", letterSpacing: "0.3px" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(5,150,105,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(5,150,105,0.4)"; }}
              >
                🌾 Explore Smart Farming
              </a>
              <a href="/store" style={{ padding: "14px 32px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontWeight: "700", fontSize: "15px", textDecoration: "none", transition: "all 0.2s", fontFamily: "inherit", letterSpacing: "0.3px" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
              >
                Visit Store →
              </a>
            </div>
          </div>

          {/* Bottom fade */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "180px", background: "linear-gradient(to top, #020c06, transparent)", pointerEvents: "none" }} />

          {/* Scroll cue */}
          <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", animation: "fadeIn 1s 800ms both ease" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</div>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(52,211,153,0.5), transparent)" }} />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TRUSTED BY
        ══════════════════════════════════════════════ */}
        <section style={{ padding: "60px 28px 0", maxWidth: "1200px", margin: "0 auto" }}>
          <SectionDivider label={t("trustedBy")} />
          <InfiniteScroll />
        </section>

        {/* ══════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════ */}
        <section ref={statsRef} style={{ padding: "80px 28px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { value: 50000, suffix: "+", label: "Farmers Served", icon: "👨‍🌾", delay: 0 },
              { value: 22, suffix: "+", label: "Crop Varieties", icon: "🌾", delay: 100 },
              { value: 96, suffix: "%", label: "AI Accuracy", icon: "⚡", delay: 200 },
              { value: 18, suffix: "%", label: "Water Saved (avg)", icon: "💧", delay: 300 },
            ].map((s) => (
              <StatCard key={s.label} {...s} inView={statsInView} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WHY CHOOSE US
        ══════════════════════════════════════════════ */}
        <section ref={whyRef} style={{ padding: "80px 28px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "60px", alignItems: "center", justifyContent: "center" }}>

            {/* Image cluster */}
            <div style={{ position: "relative", flexShrink: 0, width: "300px", height: "360px", animation: whyInView ? "cardIn 0.7s both ease" : "none" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "240px", height: "300px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 56px rgba(0,0,0,0.5)" }}>
                <img src={image1} alt="Farmer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(52,211,153,0.20)", borderRadius: "20px" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "160px", height: "200px", borderRadius: "16px", overflow: "hidden", border: "3px solid #020c06", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                <img src={image} alt="Farmer 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(52,211,153,0.25)", borderRadius: "14px" }} />
              </div>
              {/* Floating badge */}
              <div style={{ position: "absolute", top: "-16px", right: "-16px", background: "linear-gradient(135deg,#059669,#047857)", borderRadius: "14px", padding: "10px 16px", boxShadow: "0 8px 24px rgba(5,150,105,0.45)" }}>
                <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>50K+</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px", textTransform: "uppercase" }}>Farmers</div>
              </div>
            </div>

            {/* Text content */}
            <div style={{ maxWidth: "480px", animation: whyInView ? "cardIn 0.7s 120ms both ease" : "none" }}>
              <SectionDivider label="Why Choose Us" />
              <h2 style={{ margin: "0 0 20px", fontSize: "clamp(28px,4vw,44px)", fontWeight: "900", lineHeight: 1.1, letterSpacing: "-1px" }}>
                {t("whyChooseUs")}
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: "32px", fontFamily: "'DM Sans', sans-serif" }}>
                {t("whyChooseDesc")}
              </p>

              {/* Feature pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  { icon: "🤖", text: "AI-Powered Insights" },
                  { icon: "🌦️", text: "Real-time Weather" },
                  { icon: "🧪", text: "Soil Analysis" },
                  { icon: "💧", text: "Smart Irrigation" },
                  { icon: "📱", text: "Mobile Friendly" },
                  { icon: "🌍", text: "12 Climate Zones" },
                ].map((f) => (
                  <div key={f.text} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "99px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.65)", transition: "all 0.2s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.10)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.35)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                  >
                    <span>{f.icon}</span> {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            GALLERY / CARDS
        ══════════════════════════════════════════════ */}
        <section ref={galleryRef} style={{ padding: "80px 28px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px", animation: galleryInView ? "cardIn 0.6s both ease" : "none" }}>
            <SectionDivider label="Our Stories" />
            <h2 style={{ margin: "0 0 12px", fontSize: "clamp(26px,4vw,40px)", fontWeight: "900", letterSpacing: "-0.8px" }}>
              Farmers We've Empowered
            </h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "15px", fontFamily: "'DM Sans', sans-serif" }}>
              Real people, real results — driven by intelligent farming technology.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px", justifyItems: "center" }}>
            {[
              { src: image5, alt: "Farmer 1", title: "Crop Yield Doubled", delay: 0 },
              { src: image3, alt: "Farmer 2", title: "Water Usage Halved", delay: 100 },
              { src: image4, alt: "Farmer 3", title: "AI-Guided Harvest", delay: 200 },
            ].map((card) => (
              <FeatureCard
                key={card.title}
                {...card}
                desc={t("loremCard")}
                inView={galleryInView}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            MAP
        ══════════════════════════════════════════════ */}
        <section style={{ padding: "80px 28px 100px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <SectionDivider label={t("ourLocation")} />
            <h2 style={{ margin: "0 0 10px", fontSize: "clamp(26px,4vw,40px)", fontWeight: "900", letterSpacing: "-0.8px" }}>
              {t("ourLocation")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
              Serving farmers across India and beyond.
            </p>
          </div>

          {/* Map wrapper */}
          <div style={{
            borderRadius: "24px", overflow: "hidden",
            border: "1px solid rgba(52,211,153,0.18)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            position: "relative",
          }}>
            {/* Top glow line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)", zIndex: 999 }} />
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[20.5937, 78.9629]}>
                <Popup>
                  <strong>{t("mapPopup")}</strong><br />{t("mapPopupDesc")}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Location info cards below map */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
            {[
              { icon: "📍", label: "Headquarters", value: "India, IN" },
              { icon: "🗺️", label: "Coverage", value: "12+ States" },
              { icon: "👨‍🌾", label: "Active Farmers", value: "50,000+" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.12)", borderRadius: "14px", padding: "12px 20px", transition: "border-color 0.2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(52,211,153,0.28)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(52,211,153,0.12)"}
              >
                <span style={{ fontSize: "20px" }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#fff" }}>{l.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}>{l.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
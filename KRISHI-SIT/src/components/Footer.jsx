// src/components/Footer.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LINKS = [
  { key: "aboutUs", href: "/about", icon: "✦" },
  { key: "contactUs", href: "/contact", icon: "✦" },
  { key: "services", href: "/services", icon: "✦" },
  { key: "faq", href: "/faq", icon: "✦" },
];

const SOCIALS = [
  {
    label: "Twitter/X", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.012 2.25h6.945l4.27 5.65zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    )
  },
  {
    label: "Instagram", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
    )
  },
  {
    label: "YouTube", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    )
  },
  {
    label: "WhatsApp", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
    )
  },
];

const FooterLink = ({ href, children }) => (
  <a href={href} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.45)", fontSize: "14px", fontWeight: "500", textDecoration: "none", padding: "8px 0", transition: "color 0.2s, transform 0.2s", fontFamily: "inherit" }}
    onMouseEnter={e => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.transform = "translateX(4px)"; }}
    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.transform = "translateX(0)"; }}
  >
    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(52,211,153,0.5)", display: "inline-block", flexShrink: 0 }} />
    {children}
  </a>
);

const Footer = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes footerIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 6px #34d399; } 50% { box-shadow:0 0 14px #34d399; } }
        @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        @keyframes checkIn { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <footer style={{
        background: "linear-gradient(180deg, #020c06 0%, #030e08 60%, #020a05 100%)",
        fontFamily: "'Syne', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}>

        {/* Background orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-20%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        {/* Top border glow */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)" }} />

        {/* ── Main content ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 28px 40px", position: "relative", zIndex: 1 }}>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px", marginBottom: "64px" }}>

            {/* Col 1 — Brand */}
            <div style={{ animation: "footerIn 0.6s both ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.3px" }}>Krishi</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginBottom: "24px", maxWidth: "220px" }}>
                AI-powered precision agriculture for smarter, more sustainable farming decisions.
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} style={{ width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; e.currentTarget.style.color = "#34d399"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Links */}
            <div style={{ animation: "footerIn 0.6s 80ms both ease" }}>
              <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "18px" }}>
                {t("ourLinks")}
              </h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {LINKS.map(({ key, href }) => (
                  <FooterLink key={key} href={href}>{t(key)}</FooterLink>
                ))}
              </div>
            </div>

            {/* Col 3 — Greeting card */}
            <div style={{ animation: "footerIn 0.6s 160ms both ease" }}>
              <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "18px" }}>
                Welcome
              </h3>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(52,211,153,0.15)",
                borderRadius: "20px",
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>👋</div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                  Hello,<br />
                  <span style={{ background: "linear-gradient(90deg,#34d399,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {user?.first_name || "Guest"} {user?.last_name || ""}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px", lineHeight: 1.5 }}>
                  {user ? "Welcome back to your Krishi dashboard." : "Sign in to access your personalised farm insights."}
                </p>
                {!user && (
                  <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", color: "#34d399", textDecoration: "none", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; }}
                  >
                    Sign in →
                  </a>
                )}
              </div>
            </div>

            {/* Col 4 — Newsletter */}
            <div style={{ animation: "footerIn 0.6s 240ms both ease" }}>
              <h3 style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", marginBottom: "18px" }}>
                {t("newsletter")}
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: 1.65, marginBottom: "18px" }}>
                {t("newsletterDesc")}
              </p>

              {submitted ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "14px", animation: "checkIn 0.3s both ease" }}>
                  <span style={{ fontSize: "18px" }}>✅</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#34d399" }}>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={t("yourEmail")}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: `1.5px solid ${focused ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.10)"}`,
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "12px",
                      borderRadius: "14px",
                      border: "none",
                      background: "linear-gradient(135deg,#059669,#047857)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "700",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      boxShadow: "0 4px 18px rgba(5,150,105,0.35)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(5,150,105,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(5,150,105,0.35)"; }}
                  >
                    {t("send")} →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.5px" }}>
              © {new Date().getFullYear()} Krishi · {t("allRightsReserved")}
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#34d399"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.22)"}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import img from "../assets/Krishi Logo.png";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGetCartQuery } from "../store/api/CartApi";
import { toast, Bounce } from "react-toastify";

const LANGUAGES = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "HI", full: "हिंदी" },
  { code: "mr", label: "MR", full: "मराठी" },
  { code: "pa", label: "PA", full: "ਪੰਜਾਬੀ" },
];

const SERVICES = [
  { to: "/smart-farming", key: "smartFarming", icon: "🌾" },
  { to: "/farming-support", key: "farmingSupport", icon: "🤝" },
  { to: "/food-supply", key: "foodSupply", icon: "🚜" },
];

// ── Shared pill style ──────────────────────────────────────────────────────────
const pillBase = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  borderRadius: "99px", padding: "7px 16px",
  fontSize: "13px", fontWeight: "700", letterSpacing: "0.3px",
  cursor: "pointer", transition: "all 0.2s ease",
  border: "1px solid transparent",
  fontFamily: "inherit",
  background: "transparent",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

export default function Navbar() {
  const cart = useSelector((state) => state.cart.cartItems);
  const { user } = useSelector((state) => state.auth);
  const { data } = useGetCartQuery();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("krishi_lang")?.toUpperCase() || "EN"
  );

  const servicesRef = useRef();
  const langRef = useRef();

  const handleClick = () => {
    if (!user) {
      toast.info('⚠️ Please login first!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } else {
      navigate("/profile");
    }
  }

  const handleSmartFarming = () => {
    if (!user) {
      toast.info('⚠️ Please login first! for access services', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  }

  const handleCart = () => {
    if (!user) {
      toast.info('⚠️ Please login first! for access cart', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } else {
      navigate("/cart");
    }
  }


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("krishi_lang", code);
    setLanguage(code.toUpperCase());
    setLangOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14 } },
  };

  const navItemStyle = (isActive = false) => ({
    ...pillBase,
    color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
    background: isActive ? "rgba(52,211,153,0.18)" : "transparent",
    border: isActive ? "1px solid rgba(52,211,153,0.3)" : "1px solid transparent",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        .nav-link:hover { color: #fff !important; background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.12) !important; }
        .nav-link.active { color: #fff !important; background: rgba(52,211,153,0.18) !important; border-color: rgba(52,211,153,0.3) !important; }
        .dropdown-item:hover { background: rgba(52,211,153,0.10) !important; color: #fff !important; }
        .lang-item:hover { background: rgba(52,211,153,0.10) !important; }
        .cart-btn:hover { background: rgba(52,211,153,0.15) !important; border-color: rgba(52,211,153,0.35) !important; }
        @keyframes navIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseBadge { 0%,100% { transform:scale(1); } 50% { transform:scale(1.15); } }
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        fontFamily: "'Syne', 'Segoe UI', sans-serif",
        background: scrolled
          ? "rgba(3,10,5,0.88)"
          : "linear-gradient(180deg, rgba(3,10,5,0.98) 0%, rgba(4,21,16,0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(52,211,153,0.15)" : "1px solid rgba(52,211,153,0.08)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.3s ease",
        animation: "navIn 0.5s both ease",
      }}>

        {/* Subtle top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />

        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>

          {/* ── Logo ── */}
          <NavLink to="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img src={img} alt="Krishi Logo" style={{ height: "36px", width: "auto", filter: "brightness(1.1)" }} />
          </NavLink>

          {/* ── Desktop nav links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }} className="hidden-mobile">

            <NavLink to="/" style={({ isActive }) => navItemStyle(isActive)} className="nav-link">
              {t("home")}
            </NavLink>

            {/* Services dropdown */}
            <div onClick={handleSmartFarming} ref={servicesRef} style={{ position: "relative" }}>
              <button
                onClick={() => setServicesOpen(o => !o)}
                style={{ ...navItemStyle(servicesOpen), outline: "none" }}
                className="nav-link"
              >
                {t("services")}
                <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: servicesOpen ? "rotate(180deg)" : "rotate(0)" }} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                    style={{
                      position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
                      minWidth: "210px", background: "rgba(4,14,8,0.97)", border: "1px solid rgba(52,211,153,0.18)",
                      borderRadius: "18px", padding: "8px", backdropFilter: "blur(20px)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)" }} />
                    {SERVICES.map(({ to, key, icon }) => (
                      <NavLink
                        key={key} to={to}
                        onClick={() => setServicesOpen(false)}
                        className="dropdown-item"
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: "600", textDecoration: "none", transition: "all 0.15s" }}
                      >
                        <span style={{ fontSize: "17px" }}>{icon}</span>
                        {t(key)}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {[
              { to: "/booking", key: "booking" },
              { to: "/store", key: "store" },
              { to: "/blog", key: "blog" },
            ].map(({ to, key }) => (
              <NavLink key={key} to={to} style={({ isActive }) => navItemStyle(isActive)} className="nav-link">
                {t(key)}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop right actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }} className="hidden-mobile">

            {/* Language selector */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(o => !o)}
                style={{ ...pillBase, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", fontSize: "12px", padding: "6px 12px" }}
                className="lang-item"
              >
                🌐 {language} <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: langOpen ? "rotate(180deg)" : "rotate(0)" }} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                    style={{
                      position: "absolute", right: 0, top: "calc(100% + 10px)", minWidth: "130px",
                      background: "rgba(4,14,8,0.97)", border: "1px solid rgba(52,211,153,0.18)",
                      borderRadius: "16px", padding: "6px", backdropFilter: "blur(20px)",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
                    }}
                  >
                    {LANGUAGES.map(({ code, label, full }) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className="lang-item"
                        style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", borderRadius: "10px", background: i18n.language === code ? "rgba(52,211,153,0.12)" : "transparent", color: i18n.language === code ? "#34d399" : "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left" }}
                      >
                        <span style={{ fontWeight: "800", fontSize: "11px", letterSpacing: "1px" }}>{label}</span>
                        <span style={{ fontSize: "12px", opacity: 0.6 }}>{full}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar / auth */}
            <button
              // onClick={() => navigate(user ? "/profile" : "/login")}
              onClick={handleClick}
              style={{ ...pillBase, padding: "5px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", borderRadius: "50%", width: "36px", height: "36px", justifyContent: "center" }}
              className="cart-btn"
            >
              <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                <rect width="30" height="30" rx="15" fill="#1a3a2a" />
                <path fillRule="evenodd" clipRule="evenodd" d="M19.5 12C19.5 14.485 17.485 16.5 15 16.5C12.515 16.5 10.5 14.485 10.5 12C10.5 9.515 12.515 7.5 15 7.5C17.485 7.5 19.5 9.515 19.5 12ZM18 12C18 13.657 16.657 15 15 15C13.343 15 12 13.657 12 12C12 10.343 13.343 9 15 9C16.657 9 18 10.343 18 12Z" fill="#34d399" />
                <path d="M15 18.75C10.144 18.75 6.007 21.621 4.431 25.644C4.815 26.025 5.22 26.386 5.643 26.724C6.816 23.031 10.498 20.25 15 20.25C19.503 20.25 23.184 23.031 24.358 26.724C24.781 26.386 25.185 26.025 25.569 25.644C23.993 21.621 19.856 18.75 15 18.75Z" fill="#34d399" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={handleCart}
              style={{ ...pillBase, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", padding: "7px 14px", position: "relative" }}
              className="cart-btn"
            >
              <ShoppingCart size={16} />
              <span>{t("store") ? "Cart" : "Cart"}</span>
              {data?.items?.length > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: "10px", fontWeight: "800", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", boxShadow: "0 2px 8px rgba(239,68,68,0.5)", animation: "pulseBadge 2s infinite" }}>
                  {data.items.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ ...pillBase, padding: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", borderRadius: "12px", color: "#fff" }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden", borderTop: "1px solid rgba(52,211,153,0.10)" }}
            >
              <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>

                {[{ to: "/", key: "home" }, { to: "/booking", key: "booking" }, { to: "/store", key: "store" }, { to: "/blog", key: "blog" }].map(({ to, key }) => (
                  <NavLink
                    key={key} to={to}
                    onClick={() => setMobileOpen(false)}
                    style={({ isActive }) => ({ ...navItemStyle(isActive), justifyContent: "flex-start" })}
                    className="nav-link"
                  >
                    {t(key)}
                  </NavLink>
                ))}

                {/* Services group */}
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: "10px", color: "rgba(52,211,153,0.5)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "700", padding: "8px 16px 6px" }}>Services</div>
                  {SERVICES.map(({ to, key, icon }) => (
                    <NavLink
                      key={key} to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderRadius: "12px", color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
                      className="dropdown-item"
                    >
                      <span>{icon}</span> {t(key)}
                    </NavLink>
                  ))}
                </div>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

                {/* Language row */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {LANGUAGES.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      style={{ padding: "6px 14px", borderRadius: "99px", border: `1px solid ${i18n.language === code ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.12)"}`, background: i18n.language === code ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)", color: i18n.language === code ? "#34d399" : "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Mobile cart + auth */}
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    onClick={() => { navigate(user ? "/profile" : "/login"); setMobileOpen(false); }}
                    style={{ ...pillBase, flex: 1, justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", padding: "12px" }}
                    className="cart-btn"
                  >
                    👤 {user ? t("profile") : t("login")}
                  </button>
                  <button
                    onClick={() => { navigate("/cart"); setMobileOpen(false); }}
                    style={{ ...pillBase, flex: 1, justifyContent: "center", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", padding: "12px", position: "relative" }}
                    className="cart-btn"
                  >
                    <ShoppingCart size={16} /> Cart
                    {data?.items?.length > 0 && (
                      <span style={{ position: "absolute", top: "4px", right: "18px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "800", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                        {data.items.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Responsive hide CSS */}
        <style>{`
          .hidden-mobile { display: flex !important; }
          .mobile-toggle { display: none !important; }
          @media (max-width: 768px) {
            .hidden-mobile { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
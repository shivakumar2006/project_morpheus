import React, { useState, useRef, useEffect } from "react";
import { farmingVehicle, farmingEquipment } from "../assets/tools.js";
import krishi from "../assets/booking-image.png";
import Equipment from "../assets/equipment.png";
import crop from "../assets/crop.png";
import weather from "../assets/weather.png";
import soil from "../assets/soil.png";
import govern from "../assets/govern.png";
import farmer from "../assets/farmer.png";
import tractorImg from "../assets/tractorImg.png";
import harvesterImg from "../assets/harvesterImg.png";
import pumpImg from "../assets/pumpImg.png";
import seedDrillImg from "../assets/seedDrillImg.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetAllRentalsQuery, useGetRentalsByCategoryQuery } from "../store/api/RentalsApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

// ── Animated background ───────────────────────────────────────────────────────
const Particles = React.memo(() => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { w: "600px", h: "600px", top: "-18%", left: "-12%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
      { w: "450px", h: "450px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(180,83,9,0.07) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
      { w: "320px", h: "320px", top: "30%", left: "40%", bg: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
      { w: "240px", h: "240px", bottom: "6%", left: "8%", bg: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)", anim: "orbFloat1 19s ease-in-out infinite reverse" },
    ].map((o, i) => (
      <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom, borderRadius: "50%", background: o.bg, animation: o.anim }} />
    ))}
    {[...Array(30)].map((_, i) => (
      <div key={i} style={{
        position: "absolute", borderRadius: "50%",
        background: `rgba(52,211,153,${Math.random() * 0.12 + 0.03})`,
        width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
        animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
      }} />
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.10), transparent)", animation: "scanLine 12s linear infinite" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
  </div>
));

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)" }}>{label}</span>
    <div style={{ height: "1px", flex: 1, background: "rgba(52,211,153,0.13)" }} />
  </div>
);

const Panel = ({ children, style: extra = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px", padding: "28px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
    position: "relative", overflow: "hidden", ...extra,
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)" }} />
    {children}
  </div>
);

const SuggestionCard = ({ title, desc, image, index }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "0",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px", overflow: "hidden",
    backdropFilter: "blur(16px)",
    animation: `cardIn 0.5s ${index * 80}ms both ease`,
    transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
    cursor: "default",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; e.currentTarget.style.boxShadow = "0 18px 48px rgba(0,0,0,0.45)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
  >
    <div style={{ flex: 1, padding: "22px 22px 22px 24px" }}>
      <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", marginBottom: "8px", letterSpacing: "-0.2px" }}>{title}</div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{desc}</div>
    </div>
    <div style={{ width: "110px", height: "110px", flexShrink: 0, overflow: "hidden", background: "rgba(52,211,153,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={image} alt={title} style={{ width: "90px", height: "90px", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }} />
    </div>
  </div>
);

// ── ToolCard — now navigates WITH booking details in state ────────────────────
const ToolCard = ({ tool, t, index, bookingDetails }) => {
  const navigate = useNavigate();

  const handleRentClick = (e) => {
    if (!tool.availability) return;
    e.preventDefault();
    // ✅ Pass booking widget data through router state so RentVehicle can pre-fill
    navigate(`/rent/${tool._id}`, {
      state: {
        prefill: bookingDetails
          ? {
            pickup: bookingDetails.pickup,
            destination: bookingDetails.drop,
            startDate: bookingDetails.startDate,
            endDate: bookingDetails.endDate,
            days: bookingDetails.endDate && bookingDetails.startDate
              ? Math.max(1, Math.round((bookingDetails.endDate - bookingDetails.startDate) / (1000 * 60 * 60 * 24)))
              : 1,
          }
          : null,
      },
    });
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", overflow: "hidden",
      backdropFilter: "blur(16px)",
      animation: `cardIn 0.5s ${Math.min(index * 60, 400)}ms both ease`,
      transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
      display: "flex", flexDirection: "column",
      boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; e.currentTarget.style.boxShadow = "0 20px 52px rgba(0,0,0,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)"; }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
        <img
          src={`http://localhost:8095/images/${tool.image}`}
          alt={tool.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", top: "12px", right: "12px", padding: "4px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px", background: tool.availability ? "rgba(52,211,153,0.20)" : "rgba(239,68,68,0.20)", border: `1px solid ${tool.availability ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`, color: tool.availability ? "#34d399" : "#f87171", backdropFilter: "blur(8px)" }}>
          {tool.availability ? t("available") : t("notAvailable")}
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
      </div>
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px" }}>{tool.name}</div>
        <div style={{ fontSize: "11px", color: "rgba(52,211,153,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: "700" }}>{tool.category}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
          <div>
            <span style={{ fontSize: "22px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px" }}>₹{tool.rentalPricePerDay}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginLeft: "4px" }}>/ {t("perDay")}</span>
          </div>
        </div>
        <button
          onClick={handleRentClick}
          disabled={!tool.availability}
          style={{
            marginTop: "12px", display: "block", width: "100%", textAlign: "center",
            padding: "12px", borderRadius: "14px", border: "none",
            background: tool.availability ? "linear-gradient(135deg,#059669,#047857)" : "rgba(255,255,255,0.06)",
            color: tool.availability ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize: "13px", fontWeight: "800", textDecoration: "none",
            letterSpacing: "0.5px",
            boxShadow: tool.availability ? "0 4px 20px rgba(5,150,105,0.35)" : "none",
            cursor: tool.availability ? "pointer" : "not-allowed",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { if (tool.availability) { e.currentTarget.style.boxShadow = "0 8px 28px rgba(5,150,105,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = tool.availability ? "0 4px 20px rgba(5,150,105,0.35)" : "none"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {tool.availability ? `${t("rentNow")} →` : t("notAvailable")}
        </button>
      </div>
    </div>
  );
};

// ── Mini calendar ──────────────────────────────────────────────────────────────
const MiniCalendar = ({ startDate, endDate, onSelectDate, month, year, onPrevMonth, onNextMonth }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getDateObj = (d) => new Date(year, month, d);
  const isStart = (d) => startDate && getDateObj(d).getTime() === startDate.getTime();
  const isEnd = (d) => endDate && getDateObj(d).getTime() === endDate.getTime();
  const isInRange = (d) => startDate && endDate && getDateObj(d) > startDate && getDateObj(d) < endDate;
  const isPast = (d) => getDateObj(d) < today;

  return (
    <div style={{ userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button onClick={onPrevMonth} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", color: "#fff", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >‹</button>
        <span style={{ fontSize: "14px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" }}>{monthNames[month]} {year}</span>
        <button onClick={onNextMonth} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", color: "#fff", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: "700", color: "rgba(52,211,153,0.5)", padding: "4px 0", letterSpacing: "0.5px" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const past = isPast(d);
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          const isToday = getDateObj(d).getTime() === today.getTime();
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => !past && onSelectDate(getDateObj(d))}
              style={{
                width: "100%", aspectRatio: "1", borderRadius: "10px",
                border: isToday && !start && !end ? "1px solid rgba(52,211,153,0.4)" : "1px solid transparent",
                background: start || end ? "linear-gradient(135deg, #059669, #047857)" : inRange ? "rgba(52,211,153,0.12)" : "transparent",
                color: past ? "rgba(255,255,255,0.15)" : start || end ? "#fff" : inRange ? "#a7f3d0" : "#fff",
                fontSize: "13px", fontWeight: start || end ? "800" : "500",
                cursor: past ? "not-allowed" : "pointer",
                transition: "background 0.15s, transform 0.15s",
                boxShadow: start || end ? "0 4px 12px rgba(5,150,105,0.4)" : "none",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => { if (!past && !start && !end) e.currentTarget.style.background = "rgba(52,211,153,0.15)"; if (!past) e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { if (!start && !end) e.currentTarget.style.background = inRange ? "rgba(52,211,153,0.12)" : "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Booking widget ─────────────────────────────────────────────────────────────
const BookingWidget = ({ onSearch, itemRef }) => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calStep, setCalStep] = useState("start");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropFocused, setDropFocused] = useState(false);
  const calRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (calRef.current && !calRef.current.contains(e.target)) setShowCalendar(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDateSelect = (date) => {
    if (calStep === "start" || !startDate || date < startDate) {
      setStartDate(date); setEndDate(null); setCalStep("end");
    } else {
      setEndDate(date); setCalStep("start");
      setTimeout(() => setShowCalendar(false), 300);
    }
  };

  const formatDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : null;
  const daysBetween = startDate && endDate ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;
  const dateDisplay = startDate && endDate
    ? `${formatDate(startDate)} → ${formatDate(endDate)}  (${daysBetween}d)`
    : startDate ? `From ${formatDate(startDate)} → pick end date` : "Select dates";
  const canSearch = pickup.trim() && drop.trim() && startDate && endDate;

  const handleSearch = () => {
    if (!canSearch) return;
    onSearch({ pickup, drop, startDate, endDate });
    itemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.10) 0%, rgba(4,120,87,0.06) 100%)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "28px", padding: "28px 28px 24px", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(52,211,153,0.12)", position: "relative", overflow: "visible" }}>
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)", borderRadius: "99px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 16px rgba(5,150,105,0.4)" }}>🚜</div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" }}>Book Equipment</div>
          <div style={{ fontSize: "11px", color: "rgba(52,211,153,0.6)", letterSpacing: "0.5px" }}>Pickup · Drop · Dates</div>
        </div>
        <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "99px", padding: "4px 12px" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399", animation: "pulseDot 2s infinite", display: "inline-block" }} />
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#34d399", letterSpacing: "1.5px" }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "stretch", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", padding: "4px 0", flexShrink: 0, minWidth: "20px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.7)" }} />
          <div style={{ flex: 1, width: "2px", background: "linear-gradient(to bottom, rgba(52,211,153,0.6), rgba(52,211,153,0.15))", borderRadius: "99px", minHeight: "28px" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(255,140,66,0.9)", boxShadow: "0 0 8px rgba(255,140,66,0.6)", transform: "rotate(45deg)" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
          <div style={{ position: "relative" }}>
            <input type="text" placeholder="Pickup location — village, city, district…" value={pickup} onChange={e => setPickup(e.target.value)} onFocus={() => setPickupFocused(true)} onBlur={() => setPickupFocused(false)} style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", border: `1.5px solid ${pickupFocused ? "rgba(52,211,153,0.55)" : "rgba(255,255,255,0.10)"}`, background: pickupFocused ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box" }} />
            {pickup && <button onClick={() => setPickup("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>✕</button>}
          </div>
          <div style={{ position: "relative" }}>
            <input type="text" placeholder="Drop location — where should it be delivered?" value={drop} onChange={e => setDrop(e.target.value)} onFocus={() => setDropFocused(true)} onBlur={() => setDropFocused(false)} style={{ width: "100%", padding: "13px 16px", borderRadius: "14px", border: `1.5px solid ${dropFocused ? "rgba(255,140,66,0.55)" : "rgba(255,255,255,0.10)"}`, background: dropFocused ? "rgba(255,140,66,0.05)" : "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box" }} />
            {drop && <button onClick={() => setDrop("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }} ref={calRef}>
        <button onClick={() => { setShowCalendar(v => !v); setCalStep(startDate && !endDate ? "end" : "start"); }} style={{ width: "100%", padding: "13px 18px", borderRadius: "14px", border: `1.5px solid ${showCalendar ? "rgba(52,211,153,0.55)" : startDate ? "rgba(52,211,153,0.30)" : "rgba(255,255,255,0.10)"}`, background: showCalendar ? "rgba(52,211,153,0.07)" : startDate ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.05)", color: startDate ? "#fff" : "rgba(255,255,255,0.35)", fontSize: "14px", fontWeight: startDate ? "600" : "400", fontFamily: "inherit", cursor: "pointer", textAlign: "left", backdropFilter: "blur(10px)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px" }}>📅</span>
          <span style={{ flex: 1 }}>{dateDisplay}</span>
          {startDate && endDate && <span style={{ fontSize: "11px", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "99px", padding: "2px 10px", color: "#34d399", fontWeight: "700" }}>{daysBetween} day{daysBetween !== 1 ? "s" : ""}</span>}
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{showCalendar ? "▴" : "▾"}</span>
        </button>

        {showCalendar && (
          <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, right: 0, zIndex: 100, background: "linear-gradient(135deg, rgba(3,20,12,0.97) 0%, rgba(2,15,10,0.97) 100%)", border: "1px solid rgba(52,211,153,0.22)", borderRadius: "20px", padding: "20px", backdropFilter: "blur(32px)", boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(52,211,153,0.10)", animation: "calDrop 0.22s ease both" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
              {["Pick start date", "Pick end date"].map((label, i) => {
                const active = (i === 0 && calStep === "start") || (i === 1 && calStep === "end");
                const done = (i === 0 && startDate) || (i === 1 && endDate);
                return (
                  <div key={i} style={{ flex: 1, padding: "8px 12px", borderRadius: "11px", border: `1px solid ${active ? "rgba(52,211,153,0.5)" : done ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`, background: active ? "rgba(52,211,153,0.10)" : done ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: active ? "#34d399" : done ? "rgba(52,211,153,0.6)" : "rgba(255,255,255,0.3)", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>{done && !active ? "✓ " : ""}{label}</div>
                    {(i === 0 ? startDate : endDate) && <div style={{ fontSize: "13px", fontWeight: "800", color: "#fff", marginTop: "2px" }}>{formatDate(i === 0 ? startDate : endDate)}</div>}
                  </div>
                );
              })}
            </div>
            <MiniCalendar startDate={startDate} endDate={endDate} onSelectDate={handleDateSelect} month={calMonth} year={calYear} onPrevMonth={prevMonth} onNextMonth={nextMonth} />
            {startDate && <button onClick={() => { setStartDate(null); setEndDate(null); setCalStep("start"); }} style={{ marginTop: "14px", width: "100%", padding: "8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.10)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>Clear dates</button>}
          </div>
        )}
      </div>

      <button onClick={handleSearch} disabled={!canSearch} style={{ marginTop: "14px", width: "100%", padding: "15px", borderRadius: "16px", border: "none", background: canSearch ? "linear-gradient(135deg, #059669 0%, #047857 100%)" : "rgba(255,255,255,0.06)", color: canSearch ? "#fff" : "rgba(255,255,255,0.25)", fontSize: "15px", fontWeight: "800", fontFamily: "inherit", cursor: canSearch ? "pointer" : "not-allowed", letterSpacing: "0.3px", boxShadow: canSearch ? "0 8px 28px rgba(5,150,105,0.45)" : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} onMouseEnter={e => { if (canSearch) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(5,150,105,0.6)"; } }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = canSearch ? "0 8px 28px rgba(5,150,105,0.45)" : "none"; }}>
        <span style={{ fontSize: "18px" }}>🔍</span>
        {canSearch ? "Find Available Equipment →" : "Fill in pickup, drop & dates"}
      </button>

      {canSearch && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px", animation: "fadeInUp 0.3s both ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", color: "#6ee7b7", fontWeight: "700" }}>📍 {pickup}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.18)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", color: "#fbbf24", fontWeight: "700" }}>🏁 {drop}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "99px", padding: "4px 12px", fontSize: "11px", color: "#6ee7b7", fontWeight: "700" }}>📅 {daysBetween} days</div>
        </div>
      )}
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const BookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const itemRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inputFocused, setInputFocused] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const { data: allData, isLoading: loadingAll } = useGetAllRentalsQuery();
  const { data: categoryData } = useGetRentalsByCategoryQuery(selectedCategory, { skip: selectedCategory === "All" });
  const rentals = selectedCategory === "All" ? allData : categoryData;
  const categories = ["All", ...new Set((allData || []).map((item) => item.category))];
  const filteredTools = (rentals || []).filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = [
    { title: t("equipmentRental"), desc: t("equipmentRentalDesc"), image: Equipment },
    { title: t("soilHealthCheck"), desc: t("soilHealthCheckDesc"), image: soil },
    { title: t("farmerSupport"), desc: t("farmerSupportDesc"), image: farmer },
  ];

  const equipments = [
    { name: t("tractor"), price: t("tractorPrice"), image: tractorImg, desc: t("tractorDesc") },
    { name: t("harvester"), price: t("harvesterPrice"), image: harvesterImg, desc: t("harvesterDesc") },
    { name: t("waterPump"), price: t("waterPumpPrice"), image: pumpImg, desc: t("waterPumpDesc") },
    { name: t("seedDrill"), price: t("seedDrillPrice"), image: seedDrillImg, desc: t("seedDrillDesc") },
  ];

  const handleWidgetSearch = (details) => {
    setBookingDetails(details);
    itemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        html, body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; }
        * { box-sizing: border-box; }
        @keyframes heroIn      { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn      { from { opacity:0; transform:translateY(22px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot    { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes shimmerBg   { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes scanLine    { from { top:-2px; } to { top:100%; } }
        @keyframes orbFloat1   { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(30px,-20px) scale(1.05); } 66% { transform:translate(-14px,24px) scale(0.97); } }
        @keyframes orbFloat2   { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(20px,-28px) scale(0.96); } }
        @keyframes orbFloat3   { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(14px,-14px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.06; } to { transform:translateY(-20px); opacity:0.35; } }
        @keyframes calDrop     { from { opacity:0; transform:translateY(-8px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeInUp    { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .booking-swiper .swiper-button-next, .booking-swiper .swiper-button-prev { color: #34d399 !important; background: rgba(52,211,153,0.10); border: 1px solid rgba(52,211,153,0.25); border-radius: 50%; width: 40px !important; height: 40px !important; }
        .booking-swiper .swiper-button-next::after, .booking-swiper .swiper-button-prev::after { font-size: 14px !important; }
        .booking-swiper .swiper-pagination-bullet { background: rgba(255,255,255,0.3) !important; }
        .booking-swiper .swiper-pagination-bullet-active { background: #34d399 !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.28); border-radius: 99px; }
        input::placeholder { color: rgba(255,255,255,0.28); }
        select option { background: #0a1a0d; color: #fff; }
        @keyframes skeletonPulse { 0%,100% { opacity:0.35; } 50% { opacity:0.7; } }
      `}</style>

      <div style={{ fontFamily: "'Syne', 'Segoe UI', sans-serif", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", color: "#fff", minHeight: "100vh", position: "relative", overflowX: "hidden", width: "100%" }}>
        <Particles />

        {/* HERO */}
        <section style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "80px 28px 60px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "flex-start", justifyContent: "center" }}>
            <div style={{ flex: "1 1 340px", maxWidth: "480px", animation: "heroIn 0.8s both ease" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "22px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite", display: "inline-block" }} />
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Equipment Rentals · Live</span>
              </div>
              <h1 style={{ margin: "0 0 16px", fontSize: "clamp(32px,5vw,58px)", fontWeight: "900", lineHeight: 1.0, letterSpacing: "-1.5px" }}>
                {t("bookingHeading")}
                <span style={{ display: "block", background: "linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>at Your Doorstep</span>
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>{t("bookingSubHeading")}</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[{ icon: "✅", text: "Verified Equipment" }, { icon: "📅", text: "Flexible Booking" }, { icon: "💰", text: "Best Prices" }].map((c) => (
                  <div key={c.text} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "6px 14px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>{c.icon} {c.text}</div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 360px", maxWidth: "480px", animation: "heroIn 0.8s 100ms both ease" }}>
              <BookingWidget onSearch={handleWidgetSearch} itemRef={itemRef} />
            </div>
          </div>
        </section>

        {/* Booking details banner */}
        {bookingDetails && (
          <section style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 28px 16px", animation: "fadeInUp 0.4s both ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", background: "linear-gradient(135deg, rgba(5,150,105,0.12), rgba(4,120,87,0.08))", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "16px", padding: "14px 20px" }}>
              <span style={{ fontSize: "14px" }}>🗺️</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Showing equipment available from</span>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#34d399" }}>{bookingDetails.pickup}</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>→</span>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#fbbf24" }}>{bookingDetails.drop}</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>·</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                {bookingDetails.startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {bookingDetails.endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
              <button onClick={() => setBookingDetails(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "14px" }}>✕</button>
            </div>
          </section>
        )}

        {/* SUGGESTIONS */}
        <section style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "60px 28px" }}>
          <SectionDivider label={t("suggestions")} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {suggestions.map((item, i) => <SuggestionCard key={i} {...item} index={i} />)}
          </div>
        </section>

        {/* SWIPER */}
        <section style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 28px 80px" }}>
          <SectionDivider label="Featured Equipment" />
          <Panel style={{ padding: "28px 24px 36px" }}>
            <Swiper className="booking-swiper" modules={[Navigation, Pagination, Autoplay]} spaceBetween={20} slidesPerView="auto" navigation pagination={{ clickable: true }} grabCursor autoplay={{ delay: 3200, disableOnInteraction: false }} style={{ paddingBottom: "40px" }}>
              {equipments.map((item, index) => (
                <SwiperSlide key={index} style={{ width: "280px" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(52,211,153,0.12)", borderRadius: "20px", overflow: "hidden", transition: "transform 0.25s, border-color 0.25s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.12)"; }}>
                    <div style={{ height: "220px", overflow: "hidden", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                    </div>
                    <div style={{ padding: "16px 18px 20px" }}>
                      <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", marginBottom: "6px" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{item.desc}</div>
                      <div style={{ marginTop: "12px", fontSize: "18px", fontWeight: "900", color: "#34d399" }}>{item.price}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Panel>
        </section>

        {/* RENTAL LISTINGS */}
        <section ref={itemRef} style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 28px 80px" }}>
          <SectionDivider label="All Equipment" />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 280px", minWidth: "220px" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
              <input type="text" placeholder={t("searchHere")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} style={{ width: "100%", padding: "13px 18px 13px 44px", borderRadius: "14px", border: `1.5px solid ${inputFocused ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.10)"}`, background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s" }} />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "10px 18px", borderRadius: "99px", fontFamily: "inherit", background: selectedCategory === cat ? "linear-gradient(135deg,#059669,#047857)" : "rgba(255,255,255,0.05)", border: `1px solid ${selectedCategory === cat ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.10)"}`, color: selectedCategory === cat ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: selectedCategory === cat ? "0 4px 16px rgba(5,150,105,0.35)" : "none", transition: "all 0.2s" }} onMouseEnter={e => { if (selectedCategory !== cat) { e.currentTarget.style.background = "rgba(52,211,153,0.08)"; e.currentTarget.style.color = "#fff"; } }} onMouseLeave={e => { if (selectedCategory !== cat) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; } }}>{cat}</button>
              ))}
            </div>
            {filteredTools.length > 0 && <div style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: "600" }}>{filteredTools.length} items found</div>}
          </div>

          {loadingAll && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "20px" }}>
              {[...Array(6)].map((_, i) => <div key={i} style={{ height: "340px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", animation: `skeletonPulse 1.4s ${i * 100}ms ease-in-out infinite` }} />)}
            </div>
          )}

          {!loadingAll && filteredTools.length === 0 && (
            <Panel style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: "52px", marginBottom: "16px", opacity: 0.5 }}>🚜</div>
              <div style={{ fontSize: "17px", fontWeight: "700", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>No equipment found</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>Try adjusting your search or category filter.</div>
            </Panel>
          )}

          {!loadingAll && filteredTools.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "20px" }}>
              {/* ✅ Pass bookingDetails so ToolCard can forward them to RentVehicle */}
              {filteredTools.map((tool, i) => <ToolCard key={tool._id} tool={tool} t={t} index={i} bookingDetails={bookingDetails} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default BookingPage;
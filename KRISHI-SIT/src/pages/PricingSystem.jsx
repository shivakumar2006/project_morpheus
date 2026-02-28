import React, { useState, useMemo } from "react";
import { useGetGovDataQuery } from "../store/api/PricingSystem";
import { useTranslation } from "react-i18next";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "560px", h: "560px", top: "-18%", left: "-12%", bg: "radial-gradient(circle,rgba(34,197,94,0.09) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "400px", h: "400px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
            { w: "280px", h: "280px", top: "28%", left: "44%", bg: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(26)].map((_, i) => (
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

// ── Price badge ───────────────────────────────────────────────────────────────
const PriceBadge = ({ value, type }) => {
    const config = {
        min: { color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.28)", label: "↓" },
        max: { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", label: "↑" },
        modal: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.28)", label: "◆" },
    }[type];

    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: config.bg, border: `1px solid ${config.border}`, borderRadius: "10px", padding: "4px 10px", fontFamily: "'Syne',sans-serif" }}>
            <span style={{ fontSize: "10px", color: config.color, opacity: 0.7 }}>{config.label}</span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: config.color, letterSpacing: "-0.2px" }}>₹{value}</span>
        </div>
    );
};

// ── Stat chip ─────────────────────────────────────────────────────────────────
const StatChip = ({ icon, value, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "12px 18px", transition: "border-color 0.2s, background 0.2s, transform 0.2s", cursor: "default" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)"; e.currentTarget.style.background = "rgba(52,211,153,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <div>
            <div style={{ fontSize: "17px", fontWeight: "900", color: "#34d399", lineHeight: 1, letterSpacing: "-0.3px" }}>{value}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
        </div>
    </div>
);

// ── Table row ─────────────────────────────────────────────────────────────────
const TableRow = ({ item, index }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: hovered ? "rgba(52,211,153,0.04)" : index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                transition: "background 0.2s",
            }}
        >
            {/* Commodity */}
            <td style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: hovered ? "#34d399" : "rgba(52,211,153,0.3)", flexShrink: 0, transition: "background 0.2s", boxShadow: hovered ? "0 0 8px #34d399" : "none" }} />
                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#fff", textTransform: "capitalize", letterSpacing: "-0.2px" }}>{item.commodity}</span>
                </div>
            </td>

            {/* State */}
            <td style={{ padding: "14px 18px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{item.state}</span>
            </td>

            {/* District */}
            <td style={{ padding: "14px 18px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{item.district}</span>
            </td>

            {/* Market */}
            <td style={{ padding: "14px 18px" }}>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "3px 10px", fontSize: "12px", color: "rgba(255,255,255,0.55)", textTransform: "capitalize" }}>
                    {item.market}
                </div>
            </td>

            {/* Min price */}
            <td style={{ padding: "14px 18px", textAlign: "center" }}>
                <PriceBadge value={item.min_price} type="min" />
            </td>

            {/* Max price */}
            <td style={{ padding: "14px 18px", textAlign: "center" }}>
                <PriceBadge value={item.max_price} type="max" />
            </td>

            {/* Modal price */}
            <td style={{ padding: "14px 18px", textAlign: "center" }}>
                <PriceBadge value={item.modal_price} type="modal" />
            </td>
        </tr>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const PricingSystem = () => {
    const { data, isLoading, isError } = useGetGovDataQuery({ limit: 100 });
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const records = data?.records || [];

    const filtered = useMemo(() =>
        records.filter(r =>
            r.commodity?.toLowerCase().includes(search.toLowerCase()) ||
            r.state?.toLowerCase().includes(search.toLowerCase()) ||
            r.market?.toLowerCase().includes(search.toLowerCase())
        ), [records, search]
    );

    // Derived stats
    const avgModal = records.length ? Math.round(records.reduce((s, r) => s + Number(r.modal_price || 0), 0) / records.length) : 0;
    const uniqueStates = new Set(records.map(r => r.state)).size;
    const uniqueCommodities = new Set(records.map(r => r.commodity)).size;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes heroIn   { from { opacity:0; transform:translateY(-22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes panelIn  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #34d399; } 50% { box-shadow:0 0 18px #34d399; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes skeletonPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.65; } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(52,211,153,0.28); border-radius:99px; }
        table { border-collapse: collapse; width: 100%; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", padding: "60px 24px 80px" }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: "44px", animation: "heroIn 0.7s both ease" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "20px" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulseDot 2s infinite" }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Live · AGMARKNET Data</span>
                        </div>

                        <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px,5vw,52px)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: 1.0 }}>
                            {t("dailyMandiPriceDashboard")}
                        </h1>

                        <p style={{ margin: "0 auto", maxWidth: "540px", fontSize: "15px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
                            {t("livePricesDesc")}{" "}
                            <span style={{ color: "#34d399", fontWeight: "600" }}>{t("agmarknet")}</span>.{" "}
                            {t("updatedDaily")}
                        </p>
                    </div>

                    {/* ── Loading ── */}
                    {isLoading && (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                            <div style={{ display: "inline-flex", position: "relative", width: "56px", height: "56px", marginBottom: "20px" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(52,211,153,0.12)" }} />
                                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#34d399", animation: "spin 0.9s linear infinite" }} />
                                <div style={{ position: "absolute", inset: "9px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(52,211,153,0.35)", animation: "spin 1.6s linear infinite reverse" }} />
                            </div>
                            <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.38)", fontWeight: "600", animation: "pulseDot 1.5s infinite" }}>{t("loadingMarketPrices")}</div>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {isError && (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "24px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "14px" }}>⚠️</div>
                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f87171" }}>{t("pricingFetchFailed")}</div>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <>
                            {/* ── Stat chips ── */}
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "32px", animation: "panelIn 0.5s 80ms both ease" }}>
                                <StatChip icon="📦" value={records.length} label="Records" />
                                <StatChip icon="🌾" value={uniqueCommodities} label="Commodities" />
                                <StatChip icon="📍" value={uniqueStates} label="States" />
                                <StatChip icon="💰" value={`₹${avgModal}`} label="Avg Modal" />
                            </div>

                            {/* ── Table panel ── */}
                            <div style={{
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "24px", overflow: "hidden",
                                backdropFilter: "blur(20px)",
                                boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
                                animation: "panelIn 0.5s 140ms both ease",
                                position: "relative",
                            }}>
                                {/* Top glow */}
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.40),transparent)", zIndex: 1 }} />

                                {/* Toolbar */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "16px" }}>📊</span>
                                        <span style={{ fontSize: "14px", fontWeight: "800", color: "rgba(255,255,255,0.75)" }}>{t("marketPricesLatest")}</span>
                                        <div style={{ padding: "2px 10px", borderRadius: "99px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", fontSize: "11px", fontWeight: "700", color: "#34d399" }}>
                                            {filtered.length} {t("results")}
                                        </div>
                                    </div>

                                    {/* Search */}
                                    <div style={{ position: "relative", minWidth: "240px" }}>
                                        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Search commodity, state, market…"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onFocus={() => setSearchFocused(true)}
                                            onBlur={() => setSearchFocused(false)}
                                            style={{
                                                width: "100%", padding: "10px 16px 10px 40px",
                                                borderRadius: "12px",
                                                border: `1.5px solid ${searchFocused ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.10)"}`,
                                                background: "rgba(255,255,255,0.05)", color: "#fff",
                                                fontSize: "13px", fontFamily: "inherit", outline: "none",
                                                backdropFilter: "blur(10px)", transition: "border-color 0.2s",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Legend row */}
                                <div style={{ display: "flex", gap: "16px", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", flexWrap: "wrap" }}>
                                    {[
                                        { color: "#34d399", label: "↓ Min Price" },
                                        { color: "#f87171", label: "↑ Max Price" },
                                        { color: "#fbbf24", label: "◆ Modal Price" },
                                    ].map(l => (
                                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: l.color, fontWeight: "700", opacity: 0.8 }}>
                                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.color }} />
                                            {l.label}
                                        </div>
                                    ))}
                                </div>

                                {/* Table */}
                                <div style={{ overflowX: "auto" }}>
                                    <table>
                                        <thead>
                                            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                                                {[
                                                    { key: "commodity", label: t("commodity"), align: "left" },
                                                    { key: "state", label: t("state"), align: "left" },
                                                    { key: "district", label: t("district"), align: "left" },
                                                    { key: "market", label: t("market"), align: "left" },
                                                    { key: "min", label: t("minPrice"), align: "center" },
                                                    { key: "max", label: t("maxPrice"), align: "center" },
                                                    { key: "modal", label: t("modalPrice"), align: "center" },
                                                ].map(col => (
                                                    <th key={col.key} style={{ padding: "12px 18px", textAlign: col.align, fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(52,211,153,0.55)", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                        {col.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.3)", fontSize: "14px", fontWeight: "600" }}>
                                                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔎</div>
                                                        No results for "{search}"
                                                    </td>
                                                </tr>
                                            ) : (
                                                filtered.map((item, i) => (
                                                    <TableRow key={i} item={item} index={i} />
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footnote */}
                            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <span>📡</span>
                                {t("source")} AGMARKNET (data.gov.in)
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PricingSystem;
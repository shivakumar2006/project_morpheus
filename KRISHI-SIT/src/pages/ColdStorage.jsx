import React, { useState } from "react";
import { useGetColdStoragesQuery } from "../store/api/ColdStorageApi";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "500px", h: "500px", top: "-15%", left: "-10%", bg: "radial-gradient(circle,rgba(99,220,255,0.10) 0%,transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "380px", h: "380px", top: "55%", right: "-8%", bg: "radial-gradient(circle,rgba(52,211,153,0.08) 0%,transparent 65%)", anim: "orbFloat2 26s ease-in-out infinite" },
            { w: "250px", h: "250px", top: "32%", left: "42%", bg: "radial-gradient(circle,rgba(99,220,255,0.06) 0%,transparent 65%)", anim: "orbFloat3 30s ease-in-out infinite" },
        ].map((o, i) => (
            <div key={i} style={{ position: "absolute", width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, borderRadius: "50%", background: o.bg, animation: o.anim }} />
        ))}
        {[...Array(24)].map((_, i) => (
            <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: `rgba(99,220,255,${Math.random() * 0.10 + 0.03})`,
                width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                animation: `particleDrift ${6 + Math.random() * 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
            }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(99,220,255,0.12),transparent)", animation: "scanLine 12s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,220,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(99,220,255,0.02) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Storage card ──────────────────────────────────────────────────────────────
const StorageCard = ({ item, index }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(99,220,255,0.28)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px", padding: "24px",
                backdropFilter: "blur(16px)",
                boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.28)",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
                animation: `cardIn 0.5s ${Math.min(index * 60, 500)}ms both ease`,
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", gap: "10px",
            }}
        >
            {/* Top glow */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? "linear-gradient(90deg,transparent,rgba(99,220,255,0.55),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", transition: "background 0.3s" }} />
            {/* Corner orb */}
            <div style={{ position: "absolute", top: "-35px", right: "-35px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,220,255,0.10) 0%,transparent 65%)", opacity: hovered ? 1 : 0.3, transition: "opacity 0.35s", pointerEvents: "none" }} />

            {/* Name */}
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2, paddingRight: "20px" }}>
                {item.name}
            </div>

            {/* Location badges */}
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(99,220,255,0.10)", border: "1px solid rgba(99,220,255,0.22)", borderRadius: "99px", padding: "3px 10px", fontSize: "11px", fontWeight: "700", color: "#63dcff" }}>
                    📍 {item.city}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "99px", padding: "3px 10px", fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.5)" }}>
                    {item.state}
                </div>
            </div>

            {/* Address */}
            {item.address && (
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
                    🏠 {item.address}
                </div>
            )}

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {item.phone && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>📞 {item.phone}</div>}
                {item.email && <div style={{ fontSize: "12px", color: "rgba(99,220,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>✉️ {item.email}</div>}
            </div>

            {/* Footer badges */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                <div style={{ padding: "4px 12px", borderRadius: "99px", background: "rgba(99,220,255,0.12)", border: "1px solid rgba(99,220,255,0.25)", fontSize: "11px", fontWeight: "700", color: "#63dcff" }}>
                    ❄️ {item.type}
                </div>
                <div style={{ padding: "4px 12px", borderRadius: "99px", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.28)", fontSize: "11px", fontWeight: "700", color: "#fbbf24" }}>
                    {item.capacity_mt} MT
                </div>
            </div>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ColdStorage() {
    const { data = [], isLoading, isError } = useGetColdStoragesQuery();
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [focused, setFocused] = useState(false);

    const states = [...new Set(data.map(i => i.state))].sort();
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (stateFilter ? item.state === stateFilter : true)
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; width: 100%; }
        @keyframes heroIn   { from { opacity:0; transform:translateY(-22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn   { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulseDot { 0%,100% { box-shadow:0 0 7px #63dcff; } 50% { box-shadow:0 0 18px #63dcff; } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes shimmerBg { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes skeletonPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.65; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(26px,-16px); } 66% { transform:translate(-12px,20px); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0); } 33% { transform:translate(-20px,16px); } 66% { transform:translate(16px,-24px); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(10px,-10px); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-20px); opacity:0.3; } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background:rgba(99,220,255,0.3); border-radius:99px; }
      `}</style>

            <div style={{ minHeight: "100vh", width: "100%", overflowX: "hidden", background: "linear-gradient(160deg,#020c10 0%,#041218 40%,#020c0e 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 80px" }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: "44px", animation: "heroIn 0.7s both ease" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,220,255,0.10)", border: "1px solid rgba(99,220,255,0.28)", borderRadius: "99px", padding: "5px 16px", marginBottom: "18px" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#63dcff", display: "inline-block", boxShadow: "0 0 8px #63dcff", animation: "pulseDot 2s infinite" }} />
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#63dcff", letterSpacing: "2px", textTransform: "uppercase" }}>Cold Storage Network · India</span>
                        </div>
                        <h1 style={{ fontSize: "clamp(28px,5vw,50px)", fontWeight: "900", letterSpacing: "-1.5px", lineHeight: 1.0, marginBottom: "12px" }}>
                            Cold Storage{" "}
                            <span style={{ background: "linear-gradient(90deg,#63dcff,#34d399)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerBg 4s ease infinite" }}>Centers</span>
                        </h1>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif", maxWidth: "440px", margin: "0 auto" }}>
                            Discover refrigerated cold storage facilities across India for smarter produce preservation.
                        </p>
                    </div>

                    {/* ── Toolbar ── */}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "28px" }}>
                        {/* Search */}
                        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
                            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", pointerEvents: "none", zIndex: 1 }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search cold storage…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: "12px", border: `1.5px solid ${focused ? "rgba(99,220,255,0.5)" : "rgba(255,255,255,0.10)"}`, background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "13px", fontFamily: "'Syne',sans-serif", outline: "none", backdropFilter: "blur(10px)", transition: "border-color 0.2s" }}
                            />
                        </div>

                        {/* State pills */}
                        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", flex: "2 1 300px" }}>
                            {["", ...states.slice(0, 7)].map((st, i) => {
                                const isActive = stateFilter === st;
                                return (
                                    <button key={i} onClick={() => setStateFilter(st)}
                                        style={{ padding: "9px 14px", borderRadius: "10px", border: `1px solid ${isActive ? "rgba(99,220,255,0.45)" : "rgba(255,255,255,0.08)"}`, background: isActive ? "rgba(99,220,255,0.15)" : "rgba(255,255,255,0.04)", color: isActive ? "#63dcff" : "rgba(255,255,255,0.45)", fontSize: "12px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", boxShadow: isActive ? "0 2px 12px rgba(99,220,255,0.18)" : "none" }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
                                    >{st || "All States"}</button>
                                );
                            })}
                        </div>

                        {/* Count */}
                        {!isLoading && (
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: "600", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {filteredData.length} storages
                            </div>
                        )}
                    </div>

                    {/* ── Loading skeletons ── */}
                    {isLoading && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ height: "220px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", animation: `skeletonPulse 1.4s ${i * 100}ms ease-in-out infinite` }} />
                            ))}
                        </div>
                    )}

                    {/* ── Error ── */}
                    {isError && (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "20px" }}>
                            <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#f87171" }}>Failed to load cold storage data.</div>
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!isLoading && !isError && filteredData.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "14px" }}>❄️</div>
                            <div style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.4)" }}>No cold storage matching your search.</div>
                        </div>
                    )}

                    {/* ── Grid ── */}
                    {!isLoading && !isError && filteredData.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                            {filteredData.map((item, i) => <StorageCard key={i} item={item} index={i} />)}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
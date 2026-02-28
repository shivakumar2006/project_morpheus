import React, { useState } from "react";
import {
    useGetAllProductsQuery,
    useGetAllProductsByCategoryQuery,
} from "../store/api/ProductApi";
import { useAddToCartMutation } from "../store/api/CartApi";

// ── Animated background ───────────────────────────────────────────────────────
const Particles = React.memo(() => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
            { w: "560px", h: "560px", top: "-18%", left: "-12%", bg: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)", anim: "orbFloat1 22s ease-in-out infinite" },
            { w: "420px", h: "420px", top: "55%", right: "-8%", bg: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)", anim: "orbFloat2 28s ease-in-out infinite" },
            { w: "300px", h: "300px", top: "28%", left: "42%", bg: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 65%)", anim: "orbFloat3 32s ease-in-out infinite" },
            { w: "220px", h: "220px", bottom: "5%", left: "10%", bg: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)", anim: "orbFloat1 20s ease-in-out infinite reverse" },
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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
    </div>
));

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
    { key: "all", label: "All", icon: "🛍️", color: "#34d399" },
    { key: "pesticides", label: "Pesticides", icon: "🧴", color: "#f87171" },
    { key: "fertilizers", label: "Fertilizers", icon: "🌱", color: "#86efac" },
    { key: "seeds", label: "Seeds", icon: "🫘", color: "#fcd34d" },
    { key: "organicCropProtection", label: "Organic Protection", icon: "🛡️", color: "#6ee7b7" },
    { key: "organicCropNutrition", label: "Organic Nutrition", icon: "🥬", color: "#a7f3d0" },
    { key: "cattleFeed", label: "Cattle Feed", icon: "🐄", color: "#fdba74" },
    { key: "toolsAndMachinery", label: "Tools & Machinery", icon: "⚙️", color: "#c4b5fd" },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
    <div style={{
        position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "10px",
        background: type === "success" ? "rgba(5,150,105,0.95)" : "rgba(220,38,38,0.95)",
        border: `1px solid ${type === "success" ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`,
        borderRadius: "16px", padding: "14px 20px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
        animation: "toastIn 0.35s both ease",
        color: "#fff", fontSize: "14px", fontWeight: "700",
        fontFamily: "'Syne','Segoe UI',sans-serif",
    }}>
        <span style={{ fontSize: "18px" }}>{type === "success" ? "✅" : "❌"}</span>
        {message}
    </div>
);

// ── Product card — mirrors CropCard exactly ───────────────────────────────────
const ProductCard = ({ product, onAddToCart, adding, index }) => {
    const [hovered, setHovered] = useState(false);
    const cat = CATEGORIES.find(c => c.key === product.category) || CATEGORIES[0];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                backdropFilter: "blur(16px)",
                boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.5)" : "0 6px 24px rgba(0,0,0,0.3)",
                transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
                transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
                animation: `cardIn 0.5s ${Math.min(index * 60, 500)}ms both ease`,
                position: "relative",
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 1,
                background: hovered
                    ? "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)"
                    : "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
                transition: "background 0.3s",
            }} />

            {/* Image — same 180px height as CropCard */}
            <div style={{ position: "relative", height: "180px", overflow: "hidden", background: "rgba(0,0,0,0.3)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }}
                    />
                ) : (
                    /* Fallback placeholder when no image */
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <div style={{ fontSize: "48px", marginBottom: "8px" }}>{cat.icon}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: "600", lineHeight: 1.4 }}>{product.name}</div>
                    </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,12,6,0.6) 0%, transparent 55%)" }} />

                {/* Category badge on image — same as CropCard */}
                <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(2,12,6,0.75)", border: `1px solid ${cat.color}40`, borderRadius: "99px", padding: "3px 10px", backdropFilter: "blur(8px)" }}>
                    <span style={{ fontSize: "11px" }}>{cat.icon}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: cat.color, letterSpacing: "0.5px" }}>{cat.label}</span>
                </div>
            </div>

            {/* Body — same padding/structure as CropCard */}
            <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2 }}>
                    {product.name}
                </div>

                {/* Brand line — product-specific, replaces "category" text in CropCard */}
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", fontWeight: "500" }}>
                    {product.brand || cat.label}
                </div>

                {/* Price — same style as CropCard */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px" }}>₹{product.price}</span>
                </div>

                {/* Add to cart button — identical to CropCard */}
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={adding}
                    style={{
                        marginTop: "12px",
                        padding: "11px 16px",
                        borderRadius: "12px",
                        border: `1px solid ${adding ? "rgba(52,211,153,0.15)" : hovered ? "transparent" : "rgba(52,211,153,0.22)"}`,
                        background: adding ? "rgba(52,211,153,0.08)" : hovered ? "linear-gradient(135deg,#059669,#047857)" : "rgba(52,211,153,0.09)",
                        color: adding ? "rgba(52,211,153,0.45)" : "#fff",
                        fontSize: "13px", fontWeight: "800", fontFamily: "inherit",
                        cursor: adding ? "not-allowed" : "pointer",
                        letterSpacing: "0.3px",
                        boxShadow: hovered && !adding ? "0 4px 18px rgba(5,150,105,0.4)" : "none",
                        transition: "all 0.25s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    }}
                >
                    {adding ? (
                        <>
                            <span style={{ display: "inline-block", width: "13px", height: "13px", border: "2px solid rgba(52,211,153,0.25)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            Adding…
                        </>
                    ) : (
                        <>🛒 Add to Cart</>
                    )}
                </button>
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const Product = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [toast, setToast] = useState(null);
    const [addingId, setAddingId] = useState(null);

    const { data: allProducts, isLoading: allLoading } = useGetAllProductsQuery();
    const { data: categoryProducts, isLoading: categoryLoading } = useGetAllProductsByCategoryQuery(
        selectedCategory, { skip: selectedCategory === "all" }
    );
    const [addToCart] = useAddToCartMutation();

    const products = selectedCategory === "all" ? allProducts : categoryProducts;
    const loading = selectedCategory === "all" ? allLoading : categoryLoading;

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddToCart = async (product) => {
        setAddingId(product.id);
        const item = {
            itemId: product.id.toString(),
            service: "essential",
            name: product.name,
            price: product.price,
            image: product.imageUrl,
            category: product.category,
            quantity: 1,
        };
        try {
            await addToCart(item).unwrap();
            showToast(`${product.name} added to cart!`, "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to add to cart", "error");
        } finally {
            setAddingId(null);
        }
    };

    const activeCat = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes cardIn        { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin          { to { transform:rotate(360deg); } }
        @keyframes toastIn       { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }
        @keyframes skeletonPulse { 0%,100% { opacity:0.3; } 50% { opacity:0.65; } }
        @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(28px,-18px) scale(1.05); } 66% { transform:translate(-14px,22px) scale(0.97); } }
        @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-22px,18px) scale(1.04); } 66% { transform:translate(18px,-26px) scale(0.96); } }
        @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(12px,-12px) scale(1.06); } }
        @keyframes particleDrift { from { transform:translateY(0); opacity:0.05; } to { transform:translateY(-22px); opacity:0.3; } }
        @keyframes scanLine  { from { top:-2px; } to { top:100%; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); } ::-webkit-scrollbar-thumb { background: rgba(52,211,153,0.28); border-radius: 99px; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#020c06 0%,#041510 40%,#030d08 100%)", fontFamily: "'Syne','Segoe UI',sans-serif", color: "#fff", position: "relative" }}>
                <Particles />

                {toast && <Toast message={toast.message} type={toast.type} />}

                <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "36px 28px 80px" }}>

                    {/* ── Toolbar — identical structure to CropPage ── */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>

                        {/* Category pills */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat.key;
                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setSelectedCategory(cat.key)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "7px",
                                            padding: "9px 16px", borderRadius: "12px",
                                            border: `1px solid ${isActive ? `${cat.color}45` : "rgba(255,255,255,0.08)"}`,
                                            background: isActive ? `${cat.color}18` : "rgba(255,255,255,0.04)",
                                            color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                                            fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
                                            cursor: "pointer",
                                            boxShadow: isActive ? `0 4px 16px ${cat.color}28` : "none",
                                            transition: "all 0.2s",
                                            whiteSpace: "nowrap",
                                        }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result count */}
                        {products && (
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", fontWeight: "600", animation: "fadeIn 0.3s both ease" }}>
                                {products.length} {products.length === 1 ? "product" : "products"} found
                            </div>
                        )}
                    </div>

                    {/* ── Loading skeletons ── */}
                    {loading && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} style={{ height: "280px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", animation: `skeletonPulse 1.4s ${i * 100}ms ease-in-out infinite` }} />
                            ))}
                        </div>
                    )}

                    {/* ── Error ── */}
                    {!loading && !products && (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "20px" }}>
                            <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#f87171" }}>Failed to load products</div>
                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>Check your connection and try again.</div>
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!loading && products?.length === 0 && (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px" }}>
                            <div style={{ fontSize: "48px", marginBottom: "14px" }}>{activeCat.icon}</div>
                            <div style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.4)" }}>No products in this category</div>
                        </div>
                    )}

                    {/* ── Product grid — same columns as CropPage ── */}
                    {!loading && products?.length > 0 && (
                        <div
                            key={selectedCategory}
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}
                        >
                            {products.map((product, i) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={i}
                                    onAddToCart={handleAddToCart}
                                    adding={addingId === product.id}
                                />
                            ))}
                        </div>
                    )}

                </div>{/* /content */}
            </div>{/* /page */}
        </>
    );
};

export default Product;
import React, { useState } from "react";
import {
    useGetFruitsQuery,
    useGetFruitsByCategoryQuery,
} from "../store/api/FruitsApi";
import {
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation,
} from "../store/api/CartApi";
import { toast, Bounce } from "react-toastify";

const CATEGORIES = [
    { key: "All", icon: "🍎", color: "#34d399" },
    { key: "Orchard Fruit", icon: "🍏", color: "#86efac" },
    { key: "Exotic Fruit", icon: "🥭", color: "#fdba74" },
    { key: "Tropical Fruit", icon: "🍍", color: "#fcd34d" },
    { key: "Berry", icon: "🍓", color: "#fca5a5" },
    { key: "Citrus Fruit", icon: "🍋", color: "#fef08a" },
    { key: "Melon", icon: "🍈", color: "#6ee7b7" },
];

// ── Shared quantity stepper ───────────────────────────────────────────────────
const QuantityStepper = ({ quantity, onAdd, onIncrease, onDecrease, adding, updating, hovered }) => {
    const busy = adding || updating;

    if (quantity === 0) {
        return (
            <button onClick={onAdd} disabled={busy} style={{ marginTop: "12px", width: "100%", padding: "11px 16px", borderRadius: "12px", border: `1px solid ${hovered ? "transparent" : "rgba(52,211,153,0.22)"}`, background: busy ? "rgba(52,211,153,0.12)" : hovered ? "linear-gradient(135deg,#059669,#047857)" : "rgba(52,211,153,0.10)", color: busy ? "rgba(52,211,153,0.5)" : "#fff", fontSize: "13px", fontWeight: "800", fontFamily: "inherit", cursor: busy ? "not-allowed" : "pointer", letterSpacing: "0.3px", boxShadow: hovered && !busy ? "0 4px 18px rgba(5,150,105,0.4)" : "none", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", animation: "stepperAppear 0.3s both ease" }}>
                {busy ? <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(52,211,153,0.3)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Adding…</> : <>🛒 Add to Cart</>}
            </button>
        );
    }

    return (
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(52,211,153,0.45)", background: "rgba(5,150,105,0.15)", boxShadow: "0 4px 18px rgba(5,150,105,0.25)", animation: "stepperAppear 0.3s both cubic-bezier(.34,1.56,.64,1)", opacity: updating ? 0.7 : 1, transition: "opacity 0.15s" }}>
            <button onClick={onDecrease} disabled={updating} style={{ width: "44px", height: "42px", flexShrink: 0, background: "transparent", border: "none", borderRight: "1px solid rgba(52,211,153,0.25)", color: updating ? "rgba(52,211,153,0.4)" : "#34d399", fontSize: quantity === 1 ? "15px" : "20px", fontWeight: "700", cursor: updating ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s, transform 0.1s", lineHeight: 1 }}
                onMouseEnter={e => { if (!updating) e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onMouseDown={e => { if (!updating) e.currentTarget.style.transform = "scale(0.85)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >{quantity === 1 ? "🗑️" : "−"}</button>

            <div style={{ flex: 1, textAlign: "center", fontSize: "16px", fontWeight: "900", color: "#fff", letterSpacing: "-0.3px", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "center", height: "42px" }}>
                {updating ? <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(52,211,153,0.3)", borderTopColor: "#34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    : <span key={quantity} style={{ display: "inline-block", animation: "countPop 0.22s cubic-bezier(.34,1.8,.64,1)" }}>{quantity}</span>}
            </div>

            <button onClick={onIncrease} disabled={updating} style={{ width: "44px", height: "42px", flexShrink: 0, background: "transparent", border: "none", borderLeft: "1px solid rgba(52,211,153,0.25)", color: updating ? "rgba(52,211,153,0.4)" : "#34d399", fontSize: "20px", fontWeight: "700", cursor: updating ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s, transform 0.1s", lineHeight: 1 }}
                onMouseEnter={e => { if (!updating) e.currentTarget.style.background = "rgba(5,150,105,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onMouseDown={e => { if (!updating) e.currentTarget.style.transform = "scale(0.88)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >+</button>
        </div>
    );
};

// ── Fruit card ────────────────────────────────────────────────────────────────
const FruitCard = ({ item, onAdd, onIncrease, onDecrease, quantity, adding, updating, index }) => {
    const [hovered, setHovered] = useState(false);
    const cat = CATEGORIES.find(c => c.key === item.category) || CATEGORIES[0];

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${hovered ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", backdropFilter: "blur(16px)", boxShadow: hovered ? "0 20px 52px rgba(0,0,0,0.5)" : "0 6px 24px rgba(0,0,0,0.3)", transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)", transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)", animation: `cardIn 0.5s ${Math.min(index * 55, 500)}ms both ease`, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: hovered ? "linear-gradient(90deg,transparent,rgba(52,211,153,0.5),transparent)" : "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", transition: "background 0.3s", zIndex: 1 }} />

            <div style={{ position: "relative", height: "180px", overflow: "hidden", background: "rgba(0,0,0,0.3)", flexShrink: 0 }}>
                <img src={`http://localhost:8002/images/${item.image}`} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,12,6,0.6) 0%, transparent 55%)" }} />

                <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(2,12,6,0.75)", border: `1px solid ${cat.color}40`, borderRadius: "99px", padding: "3px 10px", backdropFilter: "blur(8px)" }}>
                    <span style={{ fontSize: "11px" }}>{cat.icon}</span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: cat.color, letterSpacing: "0.5px" }}>{item.category}</span>
                </div>

                {quantity > 0 && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", minWidth: "26px", height: "26px", borderRadius: "99px", padding: "0 6px", background: "linear-gradient(135deg,#059669,#047857)", border: "2px solid rgba(52,211,153,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900", color: "#fff", boxShadow: "0 4px 12px rgba(5,150,105,0.5)", animation: "badgePop 0.3s cubic-bezier(.34,1.8,.64,1)" }}>{quantity}</div>
                )}
            </div>

            <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2 }}>{item.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: "#34d399", letterSpacing: "-0.5px" }}>₹{item.price}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: "500" }}>/kg</span>
                </div>
                <QuantityStepper quantity={quantity} onAdd={onAdd} onIncrease={onIncrease} onDecrease={onDecrease} adding={adding} updating={updating} hovered={hovered} />
            </div>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const FruitPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [addingId, setAddingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [quantities, setQuantities] = useState({});

    const allData = useGetFruitsQuery(undefined, { skip: selectedCategory !== "All" });
    const categoryData = useGetFruitsByCategoryQuery(selectedCategory, { skip: selectedCategory === "All" });
    const [addToCart] = useAddToCartMutation();
    const [updateCartQuantity] = useUpdateCartQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const data = selectedCategory === "All" ? allData.data : categoryData.data;
    const loading = selectedCategory === "All" ? allData.isLoading : categoryData.isLoading;
    const error = selectedCategory === "All" ? allData.error : categoryData.error;
    const activeCat = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0];

    const handleAdd = async (fruit) => {
        setAddingId(fruit._id);
        try {
            await addToCart({ itemId: fruit._id.toString(), service: "fruit", name: fruit.name, price: fruit.price, image: fruit.image, category: fruit.category, quantity: 1 }).unwrap();
            setQuantities(q => ({ ...q, [fruit._id]: 1 }));
            toast.success(`${fruit.name} added to cart!`, { position: "bottom-right", autoClose: 2500, theme: "dark", transition: Bounce });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add to cart", { position: "bottom-right", autoClose: 2500, theme: "dark", transition: Bounce });
        } finally { setAddingId(null); }
    };

    const handleIncrease = async (fruit) => {
        const prev = quantities[fruit._id] || 0;
        setQuantities(q => ({ ...q, [fruit._id]: prev + 1 }));
        setUpdatingId(fruit._id);
        try {
            await updateCartQuantity({ itemId: fruit._id.toString(), action: "inc" }).unwrap();
        } catch (err) {
            setQuantities(q => ({ ...q, [fruit._id]: prev }));
            toast.error("Couldn't update quantity", { position: "bottom-right", autoClose: 2000, theme: "dark", transition: Bounce });
        } finally { setUpdatingId(null); }
    };

    const handleDecrease = async (fruit) => {
        const current = quantities[fruit._id] || 0;
        if (current <= 0) return;
        const next = current - 1;
        setQuantities(q => ({ ...q, [fruit._id]: next }));
        setUpdatingId(fruit._id);
        try {
            if (next === 0) {
                await removeFromCart(fruit._id.toString()).unwrap();
                toast.info(`${fruit.name} removed from cart`, { position: "bottom-right", autoClose: 2000, theme: "dark", transition: Bounce });
            } else {
                await updateCartQuantity({ itemId: fruit._id.toString(), action: "dec" }).unwrap();
            }
        } catch (err) {
            setQuantities(q => ({ ...q, [fruit._id]: current }));
            toast.error("Couldn't update quantity", { position: "bottom-right", autoClose: 2000, theme: "dark", transition: Bounce });
        } finally { setUpdatingId(null); }
    };

    return (
        <>
            <style>{`
                @keyframes cardIn        { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes spin          { to { transform:rotate(360deg); } }
                @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }
                @keyframes skeletonPulse { 0%,100% { opacity:0.35; } 50% { opacity:0.7; } }
                @keyframes stepperAppear { from { opacity:0; transform:scale(0.85) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes countPop      { 0% { transform:scale(1.5); opacity:0.6; } 100% { transform:scale(1); opacity:1; } }
                @keyframes badgePop      { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.2); } 100% { transform:scale(1); opacity:1; } }
            `}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {CATEGORIES.map(cat => {
                        const isActive = selectedCategory === cat.key;
                        return (
                            <button key={cat.key} onClick={() => setSelectedCategory(cat.key)} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 16px", borderRadius: "12px", border: `1px solid ${isActive ? `${cat.color}45` : "rgba(255,255,255,0.08)"}`, background: isActive ? `${cat.color}18` : "rgba(255,255,255,0.04)", color: isActive ? "#fff" : "rgba(255,255,255,0.45)", fontSize: "13px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", boxShadow: isActive ? `0 4px 16px ${cat.color}28` : "none", transition: "all 0.2s" }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; } }}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
                            ><span>{cat.icon}</span><span>{cat.key}</span></button>
                        );
                    })}
                </div>
                {data && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.32)", fontWeight: "600", animation: "fadeIn 0.3s both ease" }}>{data.length} {data.length === 1 ? "fruit" : "fruits"} found</div>}
            </div>

            {loading && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>{[...Array(8)].map((_, i) => <div key={i} style={{ height: "280px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", animation: `skeletonPulse 1.4s ${i * 100}ms ease-in-out infinite` }} />)}</div>}

            {error && <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "20px" }}><div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div><div style={{ fontSize: "15px", fontWeight: "700", color: "#f87171" }}>Failed to load fruits</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>Please check your connection and try again.</div></div>}

            {!loading && !error && data?.length === 0 && <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px" }}><div style={{ fontSize: "48px", marginBottom: "14px" }}>{activeCat.icon}</div><div style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.4)" }}>No fruits in this category</div></div>}

            {!loading && !error && data?.length > 0 && (
                <div key={selectedCategory} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
                    {data.map((fruit, i) => (
                        <FruitCard key={fruit._id} item={fruit} index={i}
                            quantity={quantities[fruit._id] || 0}
                            onAdd={() => handleAdd(fruit)}
                            onIncrease={() => handleIncrease(fruit)}
                            onDecrease={() => handleDecrease(fruit)}
                            adding={addingId === fruit._id}
                            updating={updatingId === fruit._id}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default FruitPage;
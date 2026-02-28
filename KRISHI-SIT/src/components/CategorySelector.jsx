// src/components/CategorySelector.jsx (debug)
import React from "react";
import { GiWheat } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { FaSeedling } from "react-icons/fa";

const tabs = [
    { name: "Crops", icon: <GiWheat size={20} /> },
    { name: "Vegetables", icon: <FaLeaf size={18} /> },
    { name: "Fruits", icon: <GiFruitBowl size={20} /> },
    { name: "Pulses", icon: <FaSeedling size={18} /> },
];

export default function CategorySelector({ active, setActive }) {
    console.log("CategorySelector render, active:", active);

    if (!setActive) {
        console.warn("CategorySelector: setActive is undefined!");
    }

    return (
        <div className="w-full bg-white shadow-md border-b py-3 flex justify-center">
            <div className="flex gap-6 md:gap-10">
                {tabs.map((tab) => {
                    const isActive = active === tab.name;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => { console.log("Clicked", tab.name); setActive(tab.name); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? "bg-green-600 text-white scale-105" : "text-gray-600 hover:text-green-600 hover:bg-green-100"
                                }`}
                        >
                            <span className="flex items-center">{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

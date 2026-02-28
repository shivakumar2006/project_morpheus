/**
 * Lightweight mock APIs for front-end development.
 * Replace these functions with actual fetch/axios calls to your backend/model.
 */

/**
 * fetchCropRecommendations(payload)
 * payload: { n, p, k, temp, ph, rainfall }
 * returns Promise<array of crops>
 */
export function fetchCropRecommendations(payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock base set (could be replaced by ML output)
            const pool = [
                { name: "Wheat", season: "Rabi", score: 82, tips: "Sow in cool season." },
                { name: "Rice", season: "Kharif", score: 90, tips: "Requires standing water." },
                { name: "Maize", season: "Kharif", score: 78, tips: "Prefers warm weather." },
                { name: "Chickpea", season: "Rabi", score: 68, tips: "Good for low rainfall." },
                { name: "Millet", season: "Kharif", score: 62, tips: "Drought tolerant." },
            ];

            // A simple heuristic to vary relevancy based on provided numbers
            const sum = (payload.n || 0) + (payload.p || 0) + (payload.k || 0) + (payload.rainfall || 0);
            const results = pool
                .map((c) => ({
                    ...c,
                    relevancy: Math.max(45, Math.round(c.score + (sum % 25) - (payload.ph ? payload.ph * 2 : 0))),
                }))
                .sort((a, b) => b.relevancy - a.relevancy)
                .slice(0, 3);

            resolve(results);
        }, 900);
    });
}

/**
 * detectSoilFromImage(file)
 * file: File object
 * returns Promise<{type, confidence, details, recommendedCrops: [{name}]}>
 */
export function detectSoilFromImage(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Text-only mock (in real app you'll POST file as multipart/form-data)
            const types = [
                {
                    type: "Loamy",
                    confidence: 0.92,
                    details: "Balanced texture with good aeration and drainage. Suitable for many crops.",
                    recommendedCrops: [{ name: "Wheat" }, { name: "Cotton" }, { name: "Soybean" }],
                },
                {
                    type: "Sandy",
                    confidence: 0.86,
                    details: "Quick drainage, low water retention — needs frequent irrigation.",
                    recommendedCrops: [{ name: "Groundnut" }, { name: "Cotton" }, { name: "Millet" }],
                },
                {
                    type: "Clayey",
                    confidence: 0.88,
                    details: "High water retention, heavy texture — best with organic matter.",
                    recommendedCrops: [{ name: "Rice" }, { name: "Sugarcane" }, { name: "Paddy" }],
                },
            ];

            // pick pseudo-random based on filename (if available)
            const pick = file?.name?.length ? file.name.length % types.length : 0;
            resolve(types[pick]);
        }, 1400);
    });
}

/**
 * fetchIrrigationSchedule({crop, soil})
 * returns Promise<array of 7 day objects>
 */
export function fetchIrrigationSchedule({ crop = "Wheat", soil = "Loamy" } = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generic 7-day schedule; real API would generate based on crop growth stage, soil moisture, weather
            const base = [
                { day: "Day 1", tasks: ["Check moisture", "Irrigate 20 minutes"] },
                { day: "Day 2", tasks: ["Fertilizer (light) if needed", "Monitor pH"] },
                { day: "Day 3", tasks: ["Irrigate 15 minutes", "Pest inspection"] },
                { day: "Day 4", tasks: ["Check drainage", "Weed removal"] },
                { day: "Day 5", tasks: ["Irrigate 10 minutes", "Check plant health"] },
                { day: "Day 6", tasks: ["Soil aeration", "Apply organic mulch"] },
                { day: "Day 7", tasks: ["Rest/monitor", "Record observations"] },
            ];

            // small variation depending on soil
            if (soil === "Sandy") {
                base[0].tasks[1] = "Irrigate 25 minutes (sandy needs more freq.)";
            } else if (soil === "Clayey") {
                base[0].tasks[1] = "Irrigate 12 minutes (clayey retains water)";
            }

            resolve(base);
        }, 700);
    });
}


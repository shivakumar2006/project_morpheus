import React, { useState, useMemo } from "react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";

export default function CropForm({ onSubmit, initial = {} }) {
    const [form, setForm] = useState({
        n: initial.n ?? "",
        p: initial.p ?? "",
        k: initial.k ?? "",
        temp: initial.temp ?? "",
        ph: initial.ph ?? "",
        rainfall: initial.rainfall ?? "",
    });

    const [errors, setErrors] = useState({});

    const update = (key) => (e) => {
        const value = e.target.value;

        setForm((s) => ({ ...s, [key]: value }));

        // Clear error when user starts typing
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
    };

    const filledCount = useMemo(() => {
        return Object.values(form).filter((v) => v !== "").length;
    }, [form]);

    const submit = (e) => {
        e?.preventDefault();

        let newErrors = {};

        if (!form.temp) {
            newErrors.temp = "Temperature is required";
        }

        if (filledCount < 3) {
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            n: Number(form.n || 0),
            p: Number(form.p || 0),
            k: Number(form.k || 0),
            temp: Number(form.temp || 0),
            ph: Number(form.ph || 0),
            rainfall: Number(form.rainfall || 0),
            landSize: Number(form.landSize || 0),
            soilType: form.soilType || "",
        });
    };

    const reset = () => {
        setForm({ n: "", p: "", k: "", temp: "", ph: "", rainfall: "", landSize: "", soilType: "" });
        setErrors({});
    };

    return (
        <form onSubmit={submit}>
            <GlassCard className="space-y-4">
                <div>
                    <h3 className="text-2xl font-semibold">Crop Recommendation</h3>
                    <p className="text-sm text-white/70 mt-1">
                        Provide at least <span className="text-emerald-300 font-medium">3 values</span> to get suggestions.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <InputField id="n" label="Nitrogen (N)" value={form.n} onChange={update("n")} placeholder="e.g. 40" />
                    <InputField id="p" label="Phosphorus (P)" value={form.p} onChange={update("p")} placeholder="e.g. 30" />
                    <InputField id="k" label="Potassium (K)" value={form.k} onChange={update("k")} placeholder="e.g. 20" />

                    <div>
                        <InputField
                            id="temp"
                            label="Temperature (°C) *"
                            value={form.temp}
                            onChange={update("temp")}
                            placeholder="e.g. 28"
                        />
                        {errors.temp && (
                            <p className="text-xs text-red-400 mt-1">{errors.temp}</p>
                        )}
                    </div>

                    <InputField id="ph" label="pH level" value={form.ph} onChange={update("ph")} placeholder="e.g. 6.5" />
                    <InputField id="rainfall" label="Rainfall (mm)" value={form.rainfall} onChange={update("rainfall")} placeholder="e.g. 120" />
                    <InputField id="landSize" label="Land Size (Acres)" value={form.landSize} onChange={update("landSize")} placeholder="e.g. 10" />
                    <InputField id="soilType" label="Soil Type" value={form.soilType} onChange={update("soilType")} placeholder="e.g. Clay" />
                </div>

                {filledCount < 3 && (
                    <p className="text-xs text-red-300">At least 3 fields are required.</p>
                )}

                <div className="flex items-center gap-3 mt-1">
                    <Button
                        type="submit"
                        disabled={filledCount < 3}
                        className={`${filledCount < 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Get Recommendations
                    </Button>

                    <button
                        type="button"
                        onClick={reset}
                        className="px-3 py-2 rounded-lg bg-white/4 border border-white/8 text-sm"
                    >
                        Reset
                    </button>
                </div>
            </GlassCard>
        </form>
    );
}
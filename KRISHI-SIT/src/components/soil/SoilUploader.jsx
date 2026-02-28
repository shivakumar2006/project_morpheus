import React, { useRef, useState } from "react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import IconUpload from "../ui/IconUpload";
import LoadingDots from "../ui/LoadingDots";

/**
 * File uploader component. Accepts onDetect(result) callback and detectFn(file) (returns promise).
 * If detectFn omitted, component expects parent to handle the detection when file changes.
 */
export default function SoilUploader({ onDetect, detectFn, accept = "image/*" }) {
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pickFile = (e) => {
        setError(null);
        const f = e?.target?.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
            setError("File too large. Max 5 MB.");
            return;
        }
        setFile(f);
    };

    const detect = async () => {
        if (!file) {
            setError("Please choose an image first.");
            return;
        }
        setError(null);
        if (!detectFn) {
            // If parent provided onDetect only, don't try to call anything.
            onDetect?.(null);
            return;
        }
        setLoading(true);
        try {
            const res = await detectFn(file);
            onDetect?.(res);
        } catch (err) {
            setError("Detection failed. Try again.");
            onDetect?.(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white/6 flex items-center justify-center">
                    <IconUpload className="w-8 h-8 text-amber-300" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium">Upload soil image</div>
                    <div className="text-xs text-white/70 mt-1">Take a clear photo in daylight for best results.</div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
                <input
                    ref={fileRef}
                    type="file"
                    accept={accept}
                    onChange={pickFile}
                    className="hidden"
                />

                <div
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    className="flex-1 cursor-pointer rounded-lg border border-white/8 bg-white/4 p-3"
                >
                    <div className="text-sm">{file ? file.name : "Click to choose or drag an image"}</div>
                    <div className="text-xs text-white/60 mt-1">Supported: JPG, PNG • Max 5MB</div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => fileRef.current?.click()} className="bg-gradient-to-r from-blue-500 to-indigo-500">Choose</Button>
                    <Button onClick={detect} loading={loading}>
                        {loading ? <LoadingDots /> : "Detect"}
                    </Button>
                </div>
            </div>

            {error && <div className="text-xs text-red-300">{error}</div>}
        </GlassCard>
    );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../store/api/JwtAuth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { toast, Bounce } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginUser, { isLoading }] = useLoginUserMutation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            toast.error("Please select a role!", {
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
            return;
        }

        try {
            const res = await loginUser(formData).unwrap();

            dispatch(
                setCredentials({
                    token: res.token,
                    user: res.user,
                })
            );

            toast.success("Login successful!", {
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
            localStorage.removeItem("last_session_id");
            navigate("/booking");
        } catch (err) {
            toast.error(err?.data?.error || "Login failed", {
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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-gradient-to-br from-[#020c06] via-[#041510] to-[#030d08] relative overflow-hidden">

            {/* Glow Orbs */}
            <div className="absolute top-[-160px] left-[-160px] w-[520px] h-[520px] rounded-full bg-green-400/10 blur-[120px]" />
            <div className="absolute bottom-[-160px] right-[-160px] w-[520px] h-[520px] rounded-full bg-emerald-400/10 blur-[120px]" />

            {/* Card */}
            <div className="relative w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.55)] px-7 py-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold tracking-widest uppercase">
                        🔐 Secure Login
                    </div>

                    <h1 className="text-3xl font-extrabold text-white mt-5 tracking-tight">
                        Welcome Back
                    </h1>

                    <p className="text-sm text-white/50 mt-2">
                        Sign in to continue your Krishi journey.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        icon="📧"
                    />

                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        icon="🔒"
                    />

                    {/* Role */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-white/60 mb-2 uppercase">
                            Select Role
                        </label>

                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-green-400/50 transition duration-300"
                            >
                                <option value="" className="bg-[#041510] text-white">
                                    Select Role
                                </option>
                                <option value="farmer" className="bg-[#041510] text-white">
                                    Farmer
                                </option>
                                <option value="customer" className="bg-[#041510] text-white">
                                    Customer
                                </option>
                                <option value="driver" className="bg-[#041510] text-white">
                                    Driver
                                </option>
                                <option value="admin" className="bg-[#041510] text-white">
                                    Admin
                                </option>
                            </select>

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                                ⬇️
                            </span>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-green-300 font-bold hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-extrabold text-lg tracking-wide cursor-pointer transition duration-300 ${isLoading
                            ? "bg-green-500/10 border border-green-500/20 text-green-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-[0_12px_35px_rgba(16,185,129,0.35)] hover:scale-[1.02]"
                            }`}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-7">
                    <div className="flex-grow h-px bg-white/10"></div>
                    <span className="px-3 text-white/40 text-xs font-bold tracking-widest">
                        OR
                    </span>
                    <div className="flex-grow h-px bg-white/10"></div>
                </div>

                {/* Register */}
                <p className="text-center text-white/60 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-300 font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

function InputField({ label, name, value, onChange, placeholder, type = "text", icon }) {
    return (
        <div>
            <label className="block text-xs font-bold tracking-widest text-white/60 mb-2 uppercase">
                {label}
            </label>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    {icon}
                </span>

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 px-11 py-3 rounded-xl outline-none focus:border-green-400/50 transition duration-300"
                />
            </div>
        </div>
    );
}

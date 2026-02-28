import { useState } from "react";
import { Link } from "react-router-dom";
import { useSignupUserMutation } from "../store/api/JwtAuth";

export default function Signup() {
    const [signupUser, { isLoading }] = useSignupUserMutation();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
        role: "",
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

        if (!formData.phone.trim()) newErrors.phone = "Phone is required";

        if (!formData.role.trim()) newErrors.role = "Role is required";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        if (formData.password !== formData.confirm_password)
            newErrors.confirm_password = "Passwords do not match";

        if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must accept terms";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length !== 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await signupUser(formData).unwrap();
            alert("Signup successful!");

            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirm_password: "",
                phone: "",
                role: "",
                agreeToTerms: false,
            });

        } catch (err) {
            alert("Signup failed: " + (err?.data?.error || "Unknown error"));
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
                        🌿 Join Krishi Community
                    </div>

                    <h1 className="text-3xl font-extrabold text-white mt-5 tracking-tight">
                        Create Your Account
                    </h1>

                    <p className="text-sm text-white/50 mt-2">
                        Start renting, booking and exploring farming solutions.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="First Name"
                            name="first_name"
                            placeholder="Enter first name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={errors.first_name}
                            icon="👤"
                        />

                        <InputField
                            label="Last Name"
                            name="last_name"
                            placeholder="Enter last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={errors.last_name}
                            icon="🪪"
                        />
                    </div>

                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon="📧"
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        icon="📱"
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
                                className={`w-full bg-white/5 border ${errors.role ? "border-red-500/40" : "border-white/10"
                                    } text-white px-4 py-3 rounded-xl outline-none focus:border-green-400/50 transition duration-300`}
                            >
                                <option value="" className="bg-[#041510] text-white">
                                    Choose your role
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

                        {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                    </div>

                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        icon="🔒"
                    />

                    <InputField
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        error={errors.confirm_password}
                        icon="🔁"
                    />

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 accent-green-500"
                        />
                        <label className="text-sm text-white/60 leading-relaxed">
                            I agree to the{" "}
                            <span className="text-green-300 font-bold cursor-pointer hover:underline">
                                Terms & Conditions
                            </span>
                        </label>
                    </div>

                    {errors.agreeToTerms && (
                        <p className="text-red-400 text-xs">{errors.agreeToTerms}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-extrabold text-lg tracking-wide transition duration-300 ${isLoading
                            ? "bg-green-500/10 border border-green-500/20 text-green-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-[0_12px_35px_rgba(16,185,129,0.35)] hover:scale-[1.02]"
                            }`}
                    >
                        {isLoading ? "Creating..." : "Create Account"}
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

                {/* Footer */}
                <p className="text-center text-white/60 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-300 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    type = "text",
    icon,
}) {
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
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`w-full bg-white/5 border ${error ? "border-red-500/40" : "border-white/10"
                        } text-white placeholder-white/25 px-11 py-3 rounded-xl outline-none focus:border-green-400/50 transition duration-300`}
                />
            </div>

            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);


    // ✅ Redirect properly inside useEffect (best practice

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login");
        }
    }, [isAuthenticated, user, navigate]);

    if (!isAuthenticated || !user) return null;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleLastBooking = () => {
        const id = localStorage.getItem("last_session_id");
        if (!id) {
            return toast.error("No previous successful booking found.", {
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
        navigate(`/booking-success?session_id=${id}`);
    };

    const handleCartBooking = () => {
        const id = localStorage.getItem("last_session_id");
        if (!id) {
            return toast.error("No previous successful booking found.", {
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
        navigate(`/cart-success?session_id=${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020c06] via-[#041510] to-[#030d08] text-white flex items-center justify-center px-5 py-14 relative overflow-hidden">

            {/* Background Glow Orbs */}
            <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] rounded-full bg-green-400/10 blur-[90px]" />
            <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-[110px]" />

            {/* Main Card */}
            <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Profile Card */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)] flex flex-col items-center text-center">

                    {/* Avatar */}
                    <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_10px_35px_rgba(16,185,129,0.35)]">
                        <span className="text-4xl font-extrabold text-black">
                            {user.first_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
                        {user.first_name} {user.last_name}
                    </h1>

                    <p className="text-sm text-white/50 mt-1">{user.email}</p>

                    {/* Role Badge */}
                    <div className="mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold tracking-widest uppercase">
                        {user.role || "User"}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer mt-7 w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold hover:bg-red-500/20 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Right Details Section */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight">
                                Account Overview
                            </h2>
                            <p className="text-sm text-white/50 mt-1">
                                Manage your profile information and check your booking history.
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">
                            🔒 Secure Account
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-white/10 my-6" />

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <ProfileItem label="First Name" value={user.first_name} icon="👤" />
                        <ProfileItem label="Last Name" value={user.last_name} icon="🪪" />
                        <ProfileItem label="Email" value={user.email} icon="📧" />
                        <ProfileItem label="Phone Number" value={user.phone} icon="📱" />
                        <ProfileItem label="Role" value={user.role} icon="🛡️" />
                        <ProfileItem label="User ID" value={user.id || "N/A"} icon="🆔" />
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-white/10 my-6" />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={handleLastBooking}
                            className="cursor-pointer flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-black font-extrabold shadow-[0_12px_35px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition duration-300"
                        >
                            ✅ Check Last Booking
                        </button>

                        <button
                            onClick={handleCartBooking}
                            className="cursor-pointer flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-extrabold hover:bg-white/10 hover:scale-[1.02] transition duration-300"
                        >
                            🛒 Check Cart Items
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ label, value, icon }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-green-400/30 transition duration-300">
        <p className="text-xs text-white/50 font-semibold tracking-wide flex items-center gap-2">
            <span>{icon}</span> {label}
        </p>
        <p className="text-lg font-extrabold text-white mt-2">
            {value || "---"}
        </p>
    </div>
);

export default Profile;

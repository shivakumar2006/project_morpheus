import React from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifySessionQuery } from "../store/api/PaymentApi";

const CartSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");

    const { data, isLoading } = useVerifySessionQuery(sessionId);

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-lg font-semibold text-gray-700">Verifying order...</p>
            </div>
        );

    const meta = data?.metadata;

    console.log("cart success : ", meta);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-10">
            <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl p-8 animate-fadeIn">

                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-green-600"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 11l3 3L22 4M2 12l7 7 4-4" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-extrabold text-center mt-4 text-green-700">
                    Order Successful!
                </h1>
                <p className="text-center text-gray-600 mt-1">
                    Your farming products order has been placed 🛒✨
                </p>

                {/* Info Section */}
                <div className="mt-8 space-y-4">

                    {/* Order ID */}
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm">Order ID</p>
                        <p className="font-bold text-lg text-green-900">{meta.orderId}</p>
                    </div>

                    {/* Payment */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className="font-semibold text-gray-800">{meta.paymentStatus}</p>
                    </div>

                    {/* Price */}
                    <div className="bg-green-600 text-white p-5 rounded-2xl shadow-md mt-4">
                        <p className="text-lg font-semibold">Total Paid</p>
                        <p className="text-3xl font-extrabold mt-1">₹ {meta.totalAmount}</p>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={() => window.location.href = "/products"}
                    className="mt-6 w-full py-3 bg-green-700 hover:bg-green-800 transition text-white text-lg font-bold rounded-xl shadow-md"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CartSuccess;

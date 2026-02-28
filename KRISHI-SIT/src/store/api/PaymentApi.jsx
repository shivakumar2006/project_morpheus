// src/store/api/PaymentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8086",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // FIXED
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        }
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (body) => ({
                url: "/payment/create-checkout-session",
                method: "POST",
                body,
            })
        }),

        verifySession: builder.query({
            query: (sessionId) => `/payment/verify-session?session_id=${sessionId}`,
        })
    })
});

export const {
    useCreateCheckoutSessionMutation,
    useVerifySessionQuery
} = paymentApi;

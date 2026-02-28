import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const JwtAuth = createApi({
    reducerPath: "JwtAuth",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080",
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({

        // SIGN UP
        signupUser: builder.mutation({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body,
            }),
        }),

        // LOGIN
        loginUser: builder.mutation({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body,
            }),
        }),

        // VERIFY TOKEN
        verifyToken: builder.query({
            query: () => "/verify",
        }),
    }),
});

export const {
    useSignupUserMutation,
    useLoginUserMutation,
    useVerifyTokenQuery
} = JwtAuth;

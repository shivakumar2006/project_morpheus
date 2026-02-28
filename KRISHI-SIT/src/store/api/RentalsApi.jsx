import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rentalsApi = createApi({
    reducerPath: "rentalsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8095"
    }),
    endpoints: (builder) => ({

        // 1️⃣ GET ALL RENTALS
        getAllRentals: builder.query({
            query: () => "/rentals"
        }),

        // 2️⃣ GET BY CATEGORY
        getRentalsByCategory: builder.query({
            query: (category) => `/rentals/category?category=${category}`
        }),

        // 3️⃣ GET BY ID
        getRentalById: builder.query({
            query: (id) => `/rentals/${id}`
        })
    })
});

export const {
    useGetAllRentalsQuery,
    useGetRentalsByCategoryQuery,
    useGetRentalByIdQuery
} = rentalsApi;

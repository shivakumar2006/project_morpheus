import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vegetableApi = createApi({
    reducerPath: "vegetableApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8001",
    }),
    endpoints: (builder) => ({
        getVegetables: builder.query({
            query: () => "/vegetables",
        }),
        getVegetablesById: builder.query({
            query: (id) => `/vegetable?id=${id}`,
        }),
        getVegetablesByCategory: builder.query({
            query: (category) => `/vegetables/category?category=${category}`,
        }),
    })
})

export const { useGetVegetablesQuery, useGetVegetablesByIdQuery, useGetVegetablesByCategoryQuery } = vegetableApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fruitsApi = createApi({
    reducerPath: "fruitsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8002",
    }),
    endpoints: (builder) => ({
        getFruits: builder.query({
            query: () => "/fruits",
        }),
        getFruitsById: builder.query({
            query: (id) => `/fruit?id=${id}`,
        }),
        getFruitsByCategory: builder.query({
            query: (category) => `/fruits/category?category=${category}`,
        }),
    })
})

export const { useGetFruitsQuery, useGetFruitsByIdQuery, useGetFruitsByCategoryQuery } = fruitsApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cropsApi = createApi({
    reducerPath: "cropsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
    }),
    refetchOnMountOrArgChange: true,          // ADD THIS
    refetchOnFocus: true,                     // ADD THIS
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getCrops: builder.query({
            query: () => "/crops",
        }),
        getCropsById: builder.query({
            query: (id) => `/crop?id=${id}`,
        }),
        getCropsByCategory: builder.query({
            query: (category) => `/crops/category?category=${category}`,
        }),
    })
})

export const { useGetCropsQuery, useGetCropsByIdQuery, useGetCropsByCategoryQuery } = cropsApi;
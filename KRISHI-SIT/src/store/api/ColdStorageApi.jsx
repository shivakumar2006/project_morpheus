import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coldStorageApi = createApi({
    reducerPath: "coldStorageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8085"
    }),
    endpoints: (builder) => ({
        getColdStorages: builder.query({
            query: () => "/cold-storages",
        }),
    })
})

export const { useGetColdStoragesQuery } = coldStorageApi;
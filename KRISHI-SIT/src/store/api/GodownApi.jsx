import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const godownApi = createApi({
    reducerPath: "godownApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8010",
    }),
    endpoints: (builder) => ({
        getAllGodowns: builder.query({
            query: () => "/godowns",
        }),
        getGodownsByState: builder.query({
            query: (state) => `/godowns/${state}`,
        }),
    })
})

export const {
    useGetAllGodownsQuery,
    useGetGodownsByStateQuery,
} = godownApi;
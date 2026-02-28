import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PricingSystemApi = createApi({
    reducerPath: "pricinSystemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.data.gov.in/",
    }),

    endpoints: (builder) => ({
        getGovData: builder.query({
            query: ({ limit = 10 }) =>
                `resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${import.meta.env.VITE_DATA_GOV_API_KEY}&format=json&limit=${limit}`,
            refetchOnReconnect: true,
            refetchOnFocus: true
        }),
    })
})

export const { useGetGovDataQuery } = PricingSystemApi;
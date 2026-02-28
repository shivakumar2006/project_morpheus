import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pulsesApi = createApi({
    reducerPath: "pulsesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8003",
    }),
    endpoints: (builder) => ({
        getPulses: builder.query({
            query: () => "/pulses",
        }),
        getPulsesById: builder.query({
            query: (id) => `/pulse?id=${id}`,
        }),
    }),
});

export const { useGetPulsesQuery, useGetPulsesByIdQuery } = pulsesApi;

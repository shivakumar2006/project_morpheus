import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const openMeteo = createApi({
    reducerPath: "opneMeteoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.open-meteo.com/v1/",
    }),

    endpoints: (builder) => ({
        getWeatherData: builder.query({
            query: ({ latitude, longitude, pastDays = 10, forecastDays = 14 }) =>
                `forecast?latitude=${latitude}&longitude=${longitude}&past_days=${pastDays}&forecast_days=${forecastDays}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`,
        })
    })
})

export const { useGetWeatherDataQuery } = openMeteo;
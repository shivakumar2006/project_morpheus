import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
    reducerPath: "weatherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.weatherapi.com/v1/",
    }),

    endpoints: (builder) => ({
        getForecast: builder.query({
            query: ({ city, days = 20 }) =>
                `forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${city}&days=${days}`,
        }),
        getPastWeather: builder.query({
            query: ({ city, date }) =>
                `history.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${city}&dt=${date}`,
        }),
    })
})

export const {
    useGetForecastQuery,
    useGetPastWeatherQuery
} = weatherApi;

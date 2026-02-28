import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
    reducerPath: "aiApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:5000/",
    }),
    endpoints: (builder) => ({
        predictCrop: builder.mutation({
            query: (data) => ({
                url: "predict",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { usePredictCropMutation } = aiApi;
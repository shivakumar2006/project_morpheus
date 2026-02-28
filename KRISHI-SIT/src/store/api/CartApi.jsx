import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8008',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.token;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery,
    tagTypes: ['Cart'],
    endpoints: (builder) => ({

        // GET CART
        getCart: builder.query({
            query: () => '/cart',
            providesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        // ADD TO CART
        addToCart: builder.mutation({
            query: (item) => ({
                url: '/cart/add',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        // UPDATE QUANTITY
        // backend expects: /cart/update?action=inc&itemId=123
        updateCartQuantity: builder.mutation({
            query: ({ itemId, action }) => ({
                url: `/cart/update?action=${action}&itemId=${itemId}`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        // REMOVE ITEM
        // backend expects: /cart/remove?itemId=123
        removeFromCart: builder.mutation({
            query: (itemId) => ({
                url: `/cart/remove?itemId=${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

        // CLEAR CART
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),

    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApi;

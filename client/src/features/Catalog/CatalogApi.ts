import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    //baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5014/api'}),
    baseQuery: baseQueryWithErrorHandling,
    //baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.31.48:5014/api'}),
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({url: 'products'})
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery} = catalogApi;
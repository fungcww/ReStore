import {createApi} from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import { Pagination } from "../../app/models/pagination";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    //baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5014/api'}),
    baseQuery: baseQueryWithErrorHandling,
    //baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.31.48:5014/api'}),
    endpoints: (builder) => ({
        //fetchProducts: builder.query<Product[], ProductParams>({
        //transform return data to object
        fetchProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({    
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items: Product[], meta) => {
                //getting header is optional
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
            }
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
        fetchFilters: builder.query<{brands : string[], types: string[]}, void>({
            query: () => `products/filters`
        }),
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery, useFetchFiltersQuery} = catalogApi;
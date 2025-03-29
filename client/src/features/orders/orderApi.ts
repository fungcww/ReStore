import { toast } from "react-toastify";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { CreateOrder, Order } from "../../app/models/order";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders' //api endpoint
        }),
        fetchOrderDetailed: builder.query<Order, number>({
            query: (id) => ({
                url: `orders/${id}`
                //method: 'GET'
            })
        }),
        // createOrder: builder.mutation<Order, CreateOrder>({
        //     query: (order) => ({
        //         url: 'orders',
        //         method: 'POST',
        //         body: order
        //     })
        // })
        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            }),
            async onQueryStarted(_, queryFulfilled) {
                try {
                    await queryFulfilled;
                    toast.success('call createOrder api success');
                    //dispatch(accountApi.util.invalidateTags(['UserInfo']));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    })
})

export const { useFetchOrdersQuery, useFetchOrderDetailedQuery, useCreateOrderMutation } = orderApi;
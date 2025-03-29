import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../../src/app/api/baseApi";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";
import Cookies from 'js-cookie'

function isBasketItem(product: Product | Item): product is Item{
    return (product as Item).quantity !== undefined
    //check class property for object param
}

export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => 'basket',
            providesTags: ['Basket']
        }),
        addBasketItem: builder.mutation<Basket, { product: Product | Item, quantity: number }>({
            query: ({ product, quantity }) => {
                const productId = isBasketItem(product) ? product.productId : product.id // type guarding
                return {
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'POST'
                }
        },
        onQueryStarted: async ({product, quantity}, {dispatch, queryFulfilled}) => {//fetch for updated total qty in basket?
            let isNetBasket = false;
            const patchResult = dispatch(
                basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                    const productId = isBasketItem(product) ? product.productId : product.id

                    if(!draft?.buyerId){ //check if new buyer/basket -> create a basket for them to avoid error
                        isNetBasket = true;
                    }
                    if(!isNetBasket)
                    {
                        const existingItem = draft.items.find(item => item.productId === productId);
                        if(existingItem) existingItem.quantity += quantity;
                        else draft.items.push(isBasketItem(product) 
                        ? product : {...product, productId : product.id , quantity});
                    }
                })
            )

            try{
                await queryFulfilled;
                //create a new basket for new user here
                if(isNetBasket) dispatch(basketApi.util.invalidateTags(['Basket'])) //update cache
                //dispatch(basketApi.util.invalidateTags(['Basket']));
                //refresh the query and update cache -> generate a new basketId
            } catch(error){
                console.log(error);
                patchResult.undo(); //undo any changes if error
            }
        }
        }),
        removeBasketItem: builder.mutation<void, { productId: number, quantity: number }>({
            query: ({ productId, quantity }) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE'
            }),
            onQueryStarted: async ({productId, quantity}, {dispatch, queryFulfilled}) => {//onQueryStarted -> for optimistic update
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const itemIndex = draft.items.findIndex(item => item.productId === productId);
                        if(itemIndex >= 0) {
                            draft.items[itemIndex].quantity -= quantity;
                            if(draft.items[itemIndex].quantity <= 0){
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    })
                )
                try{
                    await queryFulfilled;
                } catch(error){
                    console.log(error);
                    patchResult.undo();
                }
            }
        }),
        clearBasket: builder.mutation<void, void>({
            queryFn: () => ({data: undefined}),
            onQueryStarted: async (_, {dispatch}) => {
                dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        draft.items = [];
                        draft.buyerId = ''; //clear buyerId?
                    })
                );
                Cookies.remove('buyerId')
            }
        })
    })
});

export const {useFetchBasketQuery, useAddBasketItemMutation,
     useRemoveBasketItemMutation, useClearBasketMutation} = basketApi;//this return api method just rename useFetchBasketQueryuseFetchBasketQuery


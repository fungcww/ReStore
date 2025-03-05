import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import { Address, User } from '../../app/models/user';
import { LoginSchema } from '../../lib/schemas/loginSchema';
import { toast } from 'react-toastify';
import { router } from '../../app/router/Routes';

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginSchema>({
            //LoginSchema is the type of the credentials object
            //shape of the data/credentials object to be sent to the server
            query: (creds) => {
                return {
                    //url: 'login?useCookie=true',
                    url: 'account/login',
                    method: 'POST',
                    body: creds,
                    //credentials: 'include',
                }
            },
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']));
                    //to refetch a new token
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        register: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, queryFulfilled) {
                try {
                    await queryFulfilled;
                    toast.success('Registration successful, you can now login~');
                    router.navigate('/register');
                    //dispatch(accountApi.util.invalidateTags(['UserInfo']));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        userInfo: builder.query<User, void>({
            query: () => 'account/user-info',
            providesTags: ['UserInfo']
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, queryFulfilled) {
                try {
                    await queryFulfilled;
                    toast.success('Logout successful~');
                    router.navigate('/catalog');
                    //dispatch(accountApi.util.invalidateTags(['UserInfo']));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        fetchAddress: builder.query<Address, void>({
            query: () => ({
                url: 'account/address',
                method: 'GET'
            })
        }),
        updateAddress: builder.mutation<Address, Address>({
            query: (address) => ({
                url: 'account/address',
                method: 'POST',
                body: address
            }),
            onQueryStarted: async (address, {dispatch, queryFulfilled}) => {
                const patchResult = dispatch(
                    accountApi.util.updateQueryData('fetchAddress', undefined, (draft) => {
                        Object.assign(draft, {...address})
                    })
                );

            try {
                await queryFulfilled;
                toast.success('Address updated~');
            } catch (error) {
                patchResult.undo();//undo is to revert cache data 
                console.log(error);
            }
            }
        })
    })
})

export const { useLoginMutation, useLogoutMutation,useRegisterMutation,
    useUserInfoQuery, useLazyUserInfoQuery, useFetchAddressQuery, 
    useUpdateAddressMutation
 } = accountApi;
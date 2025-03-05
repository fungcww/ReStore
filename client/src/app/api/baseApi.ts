import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

const customBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, //include the buyer's cookies for every api call
    credentials: 'include' //include the cookies in each request
});

type ErrorResponse = | string | {title: string} | {errors: string[]}

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

 export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
    extraOptions: object) => {
        api.dispatch(startLoading());
        await sleep();
        const result = await customBaseQuery(args, api, extraOptions);
        //stop loading
        api.dispatch(stopLoading());
        if(result.error){
            const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus
            ? result.error.originalStatus
            : result.error.status
            //const {status, data} = result.error;

            const responseData = result.error.data as ErrorResponse;

            console.log(result.error);
            switch(originalStatus){
                case 400:
                    if (typeof responseData === 'string') toast.error(responseData);
                    else if ('errors' in responseData) {
                        toast.error('validation error');
                        throw Object.values(responseData.errors).flat().join('@, ');
                    }
                    else toast.error(responseData.title);
                    throw Object.values(responseData.title).flat().join('');
                    break;
                case 401:
                    if (typeof responseData === 'object' && 'title' in responseData) 
                        toast.error(responseData.title);
                    break;
                case 404:
                    if(responseData === null) toast.error('null return error!')
                    else if (typeof responseData === 'object' && 'title' in responseData) 
                        toast.error(responseData.title);
                    router.navigate('/not-found');
                    break;
                case 500:
                    if (typeof responseData === 'string') toast.error(responseData);
                    else if ('errors' in responseData) {
                        toast.error('server error');
                    }
                    else toast.error(responseData.title);
                    break;
                default:
                    break;       
            }
        }
    return result
}
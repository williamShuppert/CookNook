import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { removeUser, setUser } from './authSlice'
import httpStatus from 'http-status'

console.log(import.meta.env.MODE)
console.log('Base API URL: ' + import.meta.env.VITE_API_URL)

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include'
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === httpStatus.UNAUTHORIZED
        && !result.meta?.request?.url?.includes("auth") // don't auto attempt refresh when requesting an auth endpoint 
    ) {
        // Attempt to refresh auth tokens
        const refreshResult = await baseQuery({
                url: '/auth/refresh',
                method: 'POST'
            },
            api,
            extraOptions
        )

        if (refreshResult?.data) {
            api.dispatch(setUser({...refreshResult.data}))
            // Retry original query with newly refreshed tokens
            result = await baseQuery(args, api, extraOptions)
        }
        else {
            api.dispatch(removeUser())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})
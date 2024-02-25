import { apiSlice } from "./apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/local',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        register: builder.mutation({
            query: user => ({
                url: '/users',
                method: 'POST',
                body: { ...user }
            })
        }),
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
} = authApiSlice
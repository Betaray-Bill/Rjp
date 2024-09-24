import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/trainer/'
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })
        }),
        logout: builder.query({
            query: () => ({
                url: '/signout',
                method: 'GET'
            })
        })
    })
})

export const { useLoginMutation, useLogoutQuery } = authApi
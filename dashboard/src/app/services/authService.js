// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/employee' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: 'POST',
                body: {
                    email: credentials.email,
                    password: credentials.password,
                }
            }),
        }),
    }),
})


export const { useLoginMutation } = authApi
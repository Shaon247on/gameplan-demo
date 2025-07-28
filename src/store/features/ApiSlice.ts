import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Define types for our dummy data
export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  role: string
}

export interface SignUpRequest {
  username: string
  email: string
  password: string
  confirm_password: string
  agreed_to_terms: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface ResetPasswordRequest {
  email: string
  new_password: string
  code: string
}

export interface SignUpResponse {
  success?: boolean
  message: string
  status?: string
  user?: User
  token?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UpdateUserRequest {
  id: number
  name?: string
  email?: string
  role?: string
}

export interface CreatePostRequest {
  title: string
  content: string
  authorId: number
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://93dddca0bf3f.ngrok-free.app', // Your actual API base URL
    prepareHeaders: (headers) => {
      // Add any default headers here (e.g., authorization)
      headers.set('Content-Type', 'application/json')
      
      // Get token from cookies for authentication (only on client side)
      if (typeof window !== 'undefined') {
        const accessToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1]
        
        const tokenType = document.cookie
          .split('; ')
          .find(row => row.startsWith('token_type='))
          ?.split('=')[1] || 'bearer'
        
        if (accessToken) {
          headers.set('Authorization', `${tokenType} ${accessToken}`)
        }
      }
      
      return headers
    },
  }),
  tagTypes: ['User', 'Post'], // Define cache tags for invalidation
  endpoints: (builder) => ({

    
    // Auth endpoints

    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // No cache invalidation needed for login
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      // No API call needed for logout, just clear cookies and session
      queryFn: async () => {
        removeCookie('access_token')
        removeCookie('refresh_token')
        removeCookie('token_type')
        
        // Clear session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('isLoggedIn')
          sessionStorage.removeItem('userEmail')
          sessionStorage.removeItem('userProfile')
        }
        
        return { data: { success: true } }
      },
    }),

    // Forgot Password endpoints
    requestForgotPasswordCode: builder.mutation<string, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/api/auth/forgot-password/request-code',
        method: 'POST',
        body: data,
      }),
    }),

    verifyForgotPasswordCode: builder.mutation<string, VerifyCodeRequest>({
      query: (data) => ({
        url: '/api/auth/forgot-password/verify-code',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<string, ResetPasswordRequest>({
      query: (data) => ({
        url: '/api/auth/forgot-password/reset',
        method: 'POST',
        body: data,
      }),
    }),

    // User profile endpoint
    getUserProfile: builder.query<User, void>({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),
  }),
})

// Export auto-generated hooks
export const {
  // Auth hooks
  useSignUpMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestForgotPasswordCodeMutation,
  useVerifyForgotPasswordCodeMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
} = apiSlice 
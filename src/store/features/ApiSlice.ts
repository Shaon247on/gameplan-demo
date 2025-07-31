import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Define types for our dummy data
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  agreed_to_terms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  code: string;
}

export interface SignUpResponse {
  success?: boolean;
  message: string;
  status?: string;
  user?: User;
  token?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  authorId: number;
}

// Plan interfaces
export interface Plan {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface ChatResponse {
  message_text: string;
  last_message: string;
  last_message_timestamp: string;
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://731gglsx-8000.inc1.devtunnels.ms/", // Your actual API base URL
    prepareHeaders: (headers) => {
      // Add any default headers here (e.g., authorization)
      headers.set("Content-Type", "application/json");

      // Get token from cookies for authentication (only on client side)
      if (typeof window !== "undefined") {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        const tokenType =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token_type="))
            ?.split("=")[1] || "bearer";

        if (accessToken) {
          headers.set("Authorization", `${tokenType} ${accessToken}`);
        }
      }

      return headers;
    },
    // Add response handling for debugging
    validateStatus: (response, body) => {
      console.log("API Response Status:", response.status);
      console.log("API Response Body:", body);
      return response.status < 500; // Don't treat 4xx as errors
    },
  }),
  tagTypes: ["User", "Plan", "Chat"], // Define cache tags for invalidation
  endpoints: (builder) => ({
    // Auth endpoints

    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      // No cache invalidation needed for login
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      // No API call needed for logout, just clear cookies and session
      queryFn: async () => {
        removeCookie("access_token");
        removeCookie("refresh_token");
        removeCookie("token_type");

        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("userEmail");
          sessionStorage.removeItem("userProfile");
        }

        return { data: { success: true } };
      },
    }),

    // Forgot Password endpoints
    requestForgotPasswordCode: builder.mutation<string, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/api/auth/forgot-password/request-code",
        method: "POST",
        body: data,
      }),
    }),

    verifyForgotPasswordCode: builder.mutation<string, VerifyCodeRequest>({
      query: (data) => ({
        url: "/api/auth/forgot-password/verify-code",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<string, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/auth/forgot-password/reset",
        method: "POST",
        body: data,
      }),
    }),

    // User profile endpoint
    getUserProfile: builder.query<User, void>({
      query: () => "/api/auth/me",
      providesTags: ["User"],
    }),

    // Plan endpoints
    getPlans: builder.query<Plan[], void>({
      query: () => "/api/plans/",
      providesTags: ["Plan"],
    }),

    getRecentPlans: builder.query<Plan[], void>({
      query: () => "/api/plans/recent",
      providesTags: ["Plan"],
    }),

    getLastPlan: builder.query<Plan, void>({
      query: () => "/api/plans/last",
      providesTags: ["Plan"],
    }),

    createPlan: builder.mutation<Plan, CreatePlanRequest>({
      query: (plan) => ({
        url: "/api/plans/",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plan"],
    }),

    updatePlan: builder.mutation<Plan, { id: string; plan: UpdatePlanRequest }>(
      {
        query: ({ id, plan }) => ({
          url: `/api/plans/${id}`,
          method: "PUT",
          body: plan,
        }),
        invalidatesTags: ["Plan"],
      }
    ),

    deletePlan: builder.mutation<Plan, string>({
      query: (id) => ({
        url: `/api/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plan"],
    }),

    // chat endpoints

    // to continue conversation 

    sendMessage: builder.mutation<ChatResponse, { message_text: string }>({
      query: (message) => ({
        url: '/api/chats/',
        method: 'POST',
        body: message,
      }),
    }),

    // to get a conversation 

    getParicularChats: builder.query<ChatResponse[], string>({
      query: (chat_id) => `/api/chats/${chat_id}`,
      providesTags: ['Chat'],
    }),
    getAllChats: builder.query<ChatResponse[], void>({
      query: () => `/api/chats/`,
      providesTags: ['Chat'],
    }),

    // to end a conversation 

     endConversation: builder.mutation<null, void>({
      query: () => ({
        url: "/api/chats/new", // Endpoint to end and start a new conversation
        method: "POST", // Assuming it is a POST request, though no body is required
        body: {},
      }),
    }),
  }),
});

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
  // Plan hooks
  useGetPlansQuery,
  useGetRecentPlansQuery,
  useGetLastPlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  // Chat Hooks
  useSendMessageMutation,
  useGetParicularChatsQuery,
  useGetAllChatsQuery,
  useEndConversationMutation,
} = apiSlice;

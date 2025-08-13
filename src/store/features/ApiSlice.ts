import { ChatMessage } from "@/app/dashboard/page";
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
  agree_terms: boolean;
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
  access: string;
  refresh: string;
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


interface ClassResults {
  id: string; // UUID
  pinned_date?: string | null; // UUID
  title: string;
  notes: string;
  plan?: number; // List of associated plan IDs
  created_at?: string; // ISO 8601 Timestamp
}

interface Class{
  count: number;
  next: number | null;
  previous: number | null;
  results: ClassResults[]
}

// Request Type for creating or updating a class
interface ClassRequest {
  title: string;
  nodes: string;
}

// Error Type (for validation errors)
interface ValidationError {
  loc: [string, number]; // Path to the error
  msg: string; // Error message
  type: string; // Type of error
}

interface TagType {
  items: string[];
}

export interface Conversation {
  id: number;
  title: string;
  conversation: { role: string; content: string }[];
  is_saved: boolean;
  pinned_date: string | null;
  created_at: string;
  updated_at: string;
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://gamplandjango-2.onrender.com/", // Your actual API base URL
    prepareHeaders: (headers) => {
      // Add any default headers here (e.g., authorization)
      headers.set("Content-Type", "application/json");

      // Get token from cookies for authentication (only on client side)
      if (typeof window !== "undefined") {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token"))
          ?.split("=")[1];

        // const tokenType =
        //   document.cookie
        //     .split("; ")
        //     .find((row) => row.startsWith("token_type"))
        //     ?.split("=")[1] || "bearer";

        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
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
  tagTypes: ["User", "Plan", "Chat", "Class", "login"], // Define cache tags for invalidation
  endpoints: (builder) => ({
    // Auth endpoints

    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/api/signup/",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/login/",
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
        url: "/api/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),

    verifyForgotPasswordCode: builder.mutation<string, VerifyCodeRequest>({
      query: (data) => ({
        url: "/api/forgot-password/verify-code",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<string, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/forgot-password/reset",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // User profile endpoint
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/api/user/profile",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    // Plan endpoints
    getPlans: builder.query<Plan[], void>({
      query: () => ({
        url: "/api/plans/",
        credentials: "include",
      }),
      providesTags: ["Plan"],
    }),

    getRecentPlans: builder.query<Plan[], void>({
      query: () => "/api/plans/recent",
      providesTags: ["Plan"],
    }),

    getLastPlan: builder.query<Plan, void>({
      query: () => ({
        url: "/api/plans/last",
        credentials: "include",
      }),
      providesTags: ["Plan"],
    }),

    createPlan: builder.mutation<Plan, CreatePlanRequest>({
      query: (plan) => ({
        url: "/api/plans/",
        method: "POST",
        body: plan,
        credentials: "include",
      }),
      invalidatesTags: ["Plan"],
    }),
    updatePlan: builder.mutation<Plan, { id: string; plan: UpdatePlanRequest }>(
      {
        query: ({ id, plan }) => ({
          url: `/api/plans/${id}`,
          method: "PUT",
          body: plan,
          credentials: "include",
        }),
        invalidatesTags: ["Plan"],
      }
    ),

    deletePlan: builder.mutation<Plan, string>({
      query: (id) => ({
        url: `/api/plans/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Plan"],
    }),

    // chat endpoints

    // to continue conversation

    sendMessage: builder.mutation<ChatMessage, ChatMessage>({
      query: (message) => ({
        url: "/api/chats/",
        method: "POST",
        body: message,
        credentials: "include",
      }),
    }),

    // to get a conversation

    getChat: builder.query<Conversation, number>({
      query: (chat_id) => `/api/chats/${chat_id}/`,
    }),
    getAllChats: builder.query<ChatResponse[], void>({
      query: () => ({
        url: `/api/chats/`,
        credentials: "include", // ✅ sends cookies with request
      }),
      providesTags: ["Chat"],
    }),

    getMultiplePlans: builder.query({
      async queryFn(planIds: string[], _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Run all requests concurrently
          const requests = planIds.map((planId) =>
            fetchWithBQ(`api/chats/${planId}`).then((result) => ({
              result,
              planId,
            }))
          );
          const responses = await Promise.all(requests);
          // Structure the response
          const structured = responses.map(({ result, planId }) => {
            if (result.error || !Array.isArray(result.data)) {
              console.error(`Failed to fetch chat ID: ${planId}`, result.error);
              return {
                title: "",
                conversation: [],
                error: result.error,
                planId,
              };
            }

            return {
              title: result.data[0]?.message_text || "",
              conversation: result.data,
              chatId: result.data[0]?.chat_id,
            };
          });

          return { data: structured };
        } catch (error: any) {
          return {
            error: {
              status: "FETCH_ERROR",
              data: error.message,
            },
          };
        }
      },
    }),

    endConversation: builder.mutation<Conversation, void>({
      query: () => ({
        url: "/api/chats/new/", // Endpoint to end and start a new conversation
        method: "POST", // Assuming it is a POST request, though no body is required
        body: {},
      }),
    }),
    // Get all classes
    getClasses: builder.query<Class[], void>({
      query: () => "/api/classes/saved/",
      providesTags: ["Class"], // Provides a cache tag for invalidation
    }),

    // Create a new class
    createClass: builder.mutation<Class, ClassRequest>({
      query: (newClass) => ({
        url: "/api/classes/create/",
        method: "POST",
        body: newClass,
      }),
      invalidatesTags: ["Class"], // Invalidate class cache on mutation
    }),

    // Get class by ID
    getClassById: builder.query<Class, string>({
      query: (classId) => `/api/classes/${classId}`,
      providesTags: (result, error, classId) => [
        { type: "Class", id: classId },
      ],
    }),

    // Update a class
    updateClass: builder.mutation<
      Class,
      { classId: string; updatedClass: ClassRequest }
    >({
      query: ({ classId, ...updatedClass }) => ({
        url: `/api/classes/${classId}`,
        method: "PUT",
        body: updatedClass,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "Class", id: classId },
      ],
    }),

    // Delete a class
    deleteClass: builder.mutation<void, string>({
      query: (classId) => ({
        url: `/api/classes/${classId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"], // Invalidate the class cache after deleting
    }),

    // Add a plan to a class
    addPlanToClass: builder.mutation<
      Class,
      { classId: string; chatId: string }
    >({
      query: ({ classId, chatId }) => ({
        url: `/api/classes/${classId}/add-plan/${chatId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "Class", id: classId },
      ],
    }),

    // Remove a plan from a class
    removePlanFromClass: builder.mutation<
      Class,
      { classId: string; chatId: string }
    >({
      query: ({ classId, chatId }) => ({
        url: `/api/classes/${classId}/remove-plan/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "Class", id: classId },
      ],
    }),
    updateSubscription: builder.mutation({
      query: (price_id)=>({
        url: "/api/payments/create-checkout-session/",
        method: "POST",
        body: { price_id }
      })
    })
  }),
});

// Export auto-generated hooks
export const {
  // Auth hooks

  useLoginMutation,
  useSignUpMutation,
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
  useLazyGetChatQuery,
  useGetAllChatsQuery,
  useEndConversationMutation,
  useLazyGetMultiplePlansQuery,
  // Classes Hooks
  useGetClassesQuery,
  useCreateClassMutation,
  useGetClassByIdQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useAddPlanToClassMutation,
  useRemovePlanFromClassMutation,
  // Payment Hooks 
  useUpdateSubscriptionMutation
} = apiSlice;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
    baseUrl: 'https://api.example.com', // Replace with your actual API base URL
    prepareHeaders: (headers, { getState }) => {
      // Add any default headers here (e.g., authorization)
      headers.set('Content-Type', 'application/json')
      
      // Get token from cookies for authentication (only on client side)
      if (typeof window !== 'undefined') {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1]
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }
      
      return headers
    },
  }),
  tagTypes: ['User', 'Post'], // Define cache tags for invalidation
  endpoints: (builder) => ({
    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User'
      ],
    }),
    
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Post endpoints
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    
    getPostsByUser: builder.query<Post[], number>({
      query: (userId) => `/users/${userId}/posts`,
      providesTags: (result, error, userId) => [
        { type: 'Post', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Post' as const, id })) ?? [])
      ],
    }),
    
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
    
    updatePost: builder.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        'Post'
      ],
    }),
    
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    
    // Example of a more complex query with parameters
    searchUsers: builder.query<User[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: '/users/search',
        params: { q: query, limit },
      }),
      providesTags: ['User'],
    }),
    
    // Example of a mutation that doesn't return data
    uploadAvatar: builder.mutation<{ success: boolean }, { userId: number; file: File }>({
      query: ({ userId, file }) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: `/users/${userId}/avatar`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }
      ],
    }),
  }),
})

// Export auto-generated hooks
export const {
  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Post hooks
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  
  // Other hooks
  useSearchUsersQuery,
  useUploadAvatarMutation,
} = apiSlice 
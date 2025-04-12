import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Order", "Products"],
  endpoints: (builder) => ({
    // Login User
    loginUser: builder.mutation({
      query: ({ email, pass }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, pass },
        credentials: "include",
      }),
    }),

    // Register User
    registerUser: builder.mutation({
      query: ({ username, email, pass, role }) => ({
        url: "/auth/register",
        method: "POST",
        body: { username, email, pass, role },
      }),
    }),

    // Refresh Token (Handles token expiration)
    refreshToken: builder.query({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
        credentials: "include", // Allows the cookie (refresh token) to be sent
      }),
    }),

    // Get Current User (fetches the logged-in user's details)
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"], // Used for cache management and invalidation
    }),

    // Search Products (for filtering products)
    searchProducts: builder.mutation({
      query: (filters) => ({
        url: "/users/search-product",
        method: "POST",
        body: filters,
      }),
    }),

    productDetails: builder.query({
      query: ({ token, id }) => ({
        url: `users/get-product/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getReview: builder.query({
      query: ({ id }) => ({
        url: `users/get-review/${id}`,
        method: "GET",
      }),
    }),

    toggleUserStatus: builder.mutation({
      query: ({ id, token }) => ({
        url: `admin/users/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    postReview: builder.mutation({
      query: ({ comment, rating, id }) => ({
        url: `users/post-review/${id}`,
        method: "POST",
        body: { comment, rating },
      }),
    }),

    // Checkout (handles the checkout process)
    checkout: builder.mutation({
      query: ({ body, token }) => ({
        url: "/users/checkout",
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getOrderList: builder.query({
      query: ({ page = 1, limit = 10, token }) => ({
        url: `/users/view-order`,
        method: "GET",
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getAllUsers: builder.query({
      query: ({
        role = "",
        status = "",
        text = "",
        page = 1,
        limit = 10,
        token,
      }) => ({
        url: `/admin/users`,
        method: "GET",
        params: {
          role,
          status,
          text,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRefreshTokenQuery,
  useGetCurrentUserQuery,
  useSearchProductsMutation,
  useProductDetailsQuery,
  useGetReviewQuery,
  usePostReviewMutation,
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useCheckoutMutation,
  useGetOrderListQuery,
} = apiSlice;

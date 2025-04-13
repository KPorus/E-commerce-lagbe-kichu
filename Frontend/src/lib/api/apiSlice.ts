import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Order", "Products"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ email, pass }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, pass },
        credentials: "include",
      }),
    }),

    registerUser: builder.mutation({
      query: ({ username, email, pass, role }) => ({
        url: "/auth/register",
        method: "POST",
        body: { username, email, pass, role },
      }),
    }),

    // Refresh Token (Handles token expiration)
    refreshTokenApi: builder.mutation({
      query: ({ refreshToken }) => ({
        url: "/auth/refresh",
        method: "POST",
        credentials: "include",
        body: { refreshToken },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

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

    getEmployee: builder.query({
      query: (token) => ({
        url: `seller/get-employee`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getSellerProduct: builder.query({
      query: (token) => ({
        url: `seller/get-products`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    createEmployee: builder.mutation({
      query: ({ token, newUser }) => ({
        url: "seller/create",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: newUser,
      }),
    }),

    addProduct: builder.mutation({
      query: ({ token, formData }) => ({
        url: "seller/upload-product",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formData,
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
  useRefreshTokenApiMutation,
  useSearchProductsMutation,
  useProductDetailsQuery,
  useGetReviewQuery,
  usePostReviewMutation,
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useCheckoutMutation,
  useGetEmployeeQuery,
  useGetSellerProductQuery,
  useAddProductMutation,
  useCreateEmployeeMutation,
  useGetOrderListQuery,
} = apiSlice;

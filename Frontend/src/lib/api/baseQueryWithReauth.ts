import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshAccessToken } from "@/lib/api/auth";
import { setCredentials, logout } from "@/lib/features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (getState() as any).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    try {
      const data = await refreshAccessToken(); // this hits /auth/refresh
      const newToken = data.token;
      const user = data.user;

      // Set new token in store
      api.dispatch(setCredentials({ user, token: newToken }));

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
      }  
    catch (err) {
        console.log(err);
      api.dispatch(logout()); // refresh failed — log user out
    }
  }

  return result;
};

"use client";

import { setCredentials } from "@/lib/features/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { createContext, useState, useEffect, useContext } from "react";
// import { cookies } from "next/headers";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children, refreshToken }: { children: React.ReactNode, refreshToken: string | null }) => {
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();

//   console.log(refreshToken);
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshToken || "" }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("auth", data);
          dispatch(setCredentials(data));
          setToken(data.token);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error("Error refreshing token", err);
        setToken(null);
      }
    };

    refreshAccessToken();
  }, [dispatch, refreshToken]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

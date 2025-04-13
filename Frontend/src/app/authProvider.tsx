"use client";

import { useRefreshTokenApiMutation } from "@/lib/api/apiSlice";
import { setCredentials } from "@/lib/features/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { createContext, useState, useEffect, useContext } from "react";


interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({
  children,
  refreshToken,
}: {
  children: React.ReactNode;
  refreshToken: string | null;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshTokenApi] = useRefreshTokenApiMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await refreshTokenApi({ refreshToken: refreshToken || "" });
        if ("data" in res) {
          console.log("auth", res.data);
          dispatch(setCredentials(res.data));
          setToken(res.data.token);
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

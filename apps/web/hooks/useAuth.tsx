"use client";
import { getCookie, setCookie } from "cookies-next";

/**
 * TODO: add default restaurant from mainAddress (the nearest one)
 */

import { User } from "@/types/user";
import { createContext, useContext, useMemo, useState } from "react";

// import { user as user_tmp } from "@/constants/data";
import { fetchAPI } from "@/lib/fetchAPI";
import { useQuery } from "@tanstack/react-query";

export type Session =
  | {
      user: User;
      token: string;
      error: null;
    }
  | {
      user: null;
      token: null;
      error: string;
    };

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Response>;
  logout: () => void;

  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  login: (() => {}) as unknown as AuthContextType["login"],
  logout: () => {},

  refetchUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(
    (() => {
      const token = getCookie("gf-token");
      const user = getCookie("gf-user");
      if (token && user) return { token, user: JSON.parse(user), error: null };
      return null;
    })(),
  );

  const { data: api_user, refetch: refetchUser } = useQuery<User>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/user/${session?.user?.id}`, session?.token);
      const body = await res.json();
      return body;
    },
    enabled: !!session?.token && !!session?.user?.id,
  });
  const user = useMemo(() => (session && api_user ? api_user : session?.user ?? null), [api_user, session]);

  const login = async (email: string, password: string) => {
    const res = await fetchAPI("/api/user/login", undefined, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok || res.status !== 200) return res;

    setSession(body);
    setCookie("gf-token", body.token, {
      // make max age last time defined in user service
      maxAge: 30 * 24 * 60 * 60,
    });
    setCookie("gf-user", JSON.stringify(body.user), {
      // make max age last time defined in user service
      maxAge: 30 * 24 * 60 * 60,
    });
    return res;
  };

  const logout = () => {
    setSession(null);
    setCookie("gf-token", null, { maxAge: -1 });
    setCookie("gf-user", null, { maxAge: -1 });
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, user, isAuthenticated: !!session?.token, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

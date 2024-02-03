"use client";
import { setCookie, getCookie } from "cookies-next";

/**
 * TODO: add default restaurant from mainAddress (the nearest one)
 */

import { User } from "@/types/user";
import { useState, createContext, useContext } from "react";

// import { user as user_tmp } from "@/constants/data";
import { fetchAPI } from "@/lib/fetchAPI";

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
  isAuthentified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthentified: false,
  login: (() => {}) as unknown as AuthContextType["login"],
  logout: () => {},
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

  const login = async (email: string, password: string) => {
    const res = await fetchAPI("/api/user/login", undefined, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok || res.status !== 200) throw body;

    setSession(body);
    setCookie("gf-token", body.token, {
      // make max age last time defined in user service
      maxAge: 30 * 24 * 60 * 60,
    });
    setCookie("gf-user", JSON.stringify(body.user), {
      // make max age last time defined in user service
      maxAge: 30 * 24 * 60 * 60,
    });
    return true;
  };

  const logout = () => {
    setSession(null);
    setCookie("gf-token", null, { maxAge: -1 });
    setCookie("gf-user", null, { maxAge: -1 });
  };

  return (
    <AuthContext.Provider
      value={{ session, login, logout, user: session?.user ?? null, isAuthentified: session?.user !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * TODO: add default restaurant from mainAddress (the nearest one)
 */
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { fetchAPI } from "@/lib/fetchAPI";
import { getCookie, setCookie } from "@/lib/storage";
import { User } from "@/types/user";

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
  login: (email: string, password: string) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const loadSession = async () => {
    const token = await getCookie("gf-token");
    const user = await getCookie("gf-user");
    if (token && user) return setSession({ token, user: JSON.parse(user), error: null });
    return null;
  };
  useEffect(() => {
    loadSession();
  }, []);

  const { data: api_user, refetch: refetchUser } = useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const res = await fetchAPI(`/api/user/${session?.user?.id}`, session?.token);
        const body = await res.json();
        return body;
      } catch {
        // TODO: revalidate token
        // const revalidate = await fetchAPI("/api/user/revalidate", session?.token);
        setSession(null);
        setCookie("gf-token", null);
        setCookie("gf-user", null);
        return null;
      }
    },
    enabled: !!session?.token && !!session?.user?.id,
  });
  const user = useMemo(() => (session && api_user ? api_user : session?.user ?? null), [api_user, session]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchAPI("/api/user/login", undefined, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok || res.status !== 200) throw new Error(body.error);

      setSession(body);
      setCookie("gf-token", body.token);
      setCookie("gf-user", JSON.stringify(body.user));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setSession(null);
    setCookie("gf-token", null);
    setCookie("gf-user", null);

    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, user, isAuthenticated: !!session?.token, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

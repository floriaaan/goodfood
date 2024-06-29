import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Toast from "react-native-root-toast";

import { useNative } from "@/hooks/useNative";
import { fetchAPI } from "@/lib/fetchAPI";
import { getCookie, setCookie } from "@/lib/storage";
import { User } from "@/types/user";
import { router } from "expo-router";

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
  const { location, updateFrequency } = useNative();

  const [session, setSession] = useState<Session | null>(null);
  const loadSession = async () => {
    const token = await getCookie("gf-token");
    const user = await getCookie("gf-user");
    if (token && user)
      return setSession({ token, user: JSON.parse(user), error: null });
    return null;
  };
  useEffect(() => {
    loadSession();
  }, []);

  const { data: api_user, refetch: refetchUser } = useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const res = await fetchAPI(
          `/api/user/${session?.user?.id}`,
          session?.token
        );
        const body = await res.json();
        return body;
      } catch {
        setSession(null);
        setCookie("gf-token", null);
        setCookie("gf-user", null);
        return null;
      }
    },
    enabled: !!session?.token && !!session?.user?.id,
  });
  const user = useMemo(
    () => (session && api_user ? api_user : session?.user ?? null),
    [api_user, session]
  );

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchAPI("/api/user/login", undefined, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();

      if (!res.ok || res.status !== 200) {
        if (body.error && body.error.details === "Invalid credentials")
          Toast.show(
            "Les identifiants fournis sont incorrects. Veuillez réessayer.",
            { duration: Toast.durations.LONG }
          );

        return res;
      }
      if ((body.user as User)?.role.code !== "DELIVERY_PERSON") {
        Toast.show(
          "Vous n'êtes pas autorisé à accéder à cette application. Il vous faut le rôle Livreur",
          { duration: Toast.durations.LONG }
        );
        return res;
      }

      setSession(body);
      setCookie("gf-token", body.token);
      setCookie("gf-user", JSON.stringify(body.user));
      updateLocation();
      router.push("/(app)/");
      return res;
    } catch (err) {
      console.error(err);
      Toast.show(
        "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
        { duration: Toast.durations.LONG }
      );
      throw err;
    }
  };

  const logout = () => {
    setSession(null);
    setCookie("gf-token", null);
    setCookie("gf-user", null);

    router.canDismiss() ? router.dismiss() : router.push("/(auth)/login");
  };

  const updateLocation = async () => {
    if (!location || !user) return;
    // fetch api to update location
    try {
      const res = await fetchAPI(
        `/api/delivery-person/${session?.user?.id}/location`,
        session?.token,
        {
          method: "PUT",
          body: JSON.stringify({
            address: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          }),
        }
      );
      if (!res.ok) {
        console.error("Failed to update location");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // debounce to update delivery person location
    if (!location || !user) return;
    // fetch api to update location
    const interval = setInterval(() => updateLocation(), updateFrequency);

    return () => clearInterval(interval);
  }, [updateFrequency, user, location]);

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        user,
        isAuthenticated: !!session?.token,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

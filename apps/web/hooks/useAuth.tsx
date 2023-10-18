"use client";

/**
 * TODO: Replace this with a real authentication system
 * TODO: add default restaurant from mainAddress (the nearest one)
 */

import { User } from "@/types/user";
import { useState, createContext, useContext } from "react";

import { user as user_tmp } from "@/constants/data";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    // null,
    user_tmp
  );

  const login = (email: string, password: string) => {
    // TODO: replace this with a real authentication system
    setUser(user_tmp);
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

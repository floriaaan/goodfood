import { BasketProvider } from "@/hooks/basket";
import { createContext, useContext, useState } from "react";
type User = {
  token: string;
} | null;

type AuthContextData = {
  user: User;
  setUser: (user: User) => void;
};

const AuthContext = createContext({ user: null } as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  /**
   *  todo: auto redirect to login if user is not logged in
   *  ex: if (!user && route.includes("/(app)")) navigate("login")
   * 
   *  todo: auto login with async storage (refresh token ?)
   * */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {user ? <BasketProvider>{children}</BasketProvider> : children}
    </AuthContext.Provider>
  );
};

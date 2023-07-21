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
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

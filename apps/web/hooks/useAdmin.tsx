"use client";

import { createContext, useContext } from "react";
import { createPersistedState } from "@/lib/use-persisted-state";

type AdminContextData = {
  selectedRestaurantId: string | null;
  selectRestaurant: (restId: string) => void;
};

const AdminContext = createContext({
  selectedRestaurantId: null,
  selectRestaurant: () => {},
} as AdminContextData);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within a AdminProvider");
  return context;
};
const useRestaurantState = createPersistedState("gf/admin/restaurant");

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useRestaurantState<string | null>(null);
  const selectRestaurant = (id: string) => setSelectedRestaurantId(id);

  return (
    <AdminContext.Provider value={{ selectedRestaurantId: selectedRestaurantId as string | null, selectRestaurant }}>
      {children}
    </AdminContext.Provider>
  );
};

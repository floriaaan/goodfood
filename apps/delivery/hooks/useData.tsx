import { useAuth } from "@/hooks/useAuth";
import { useNative } from "@/hooks/useNative";
import { fetchAPI } from "@/lib/fetchAPI";
import { Order } from "@/types/order";
import { Restaurant } from "@/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

type DataContextType = {
  restaurants: Restaurant[];
  refetchRestaurants: () => void;
  isRestaurantsLoading: boolean;

  orders: Order[];
  refetchOrders: () => void;
  isOrdersLoading: boolean;
};

const DataContext = createContext({
  restaurants: [],
  refetchRestaurants: () => {},
  isRestaurantsLoading: true,

  orders: [],
  refetchOrders: () => {},
  isOrdersLoading: true,
} as DataContextType);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const { token } = session || {};
  const { location } = useNative();
  const { latitude: lat, longitude: lng } = location?.coords || {};

  const {
    data: api_restaurants,
    refetch: refetchRestaurants,
    isLoading: isRestaurantsLoading,
  } = useQuery<Restaurant[]>({
    queryKey: ["restaurant", `${lat}-${lng}`],

    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/by-location`, undefined, {
        method: "POST",
        body: JSON.stringify({ lat, lng }),
      });
      const body = await res.json();
      return body.restaurantsList;
    },
    enabled: !!lat && !!lng && !isNaN(lat) && !isNaN(lng),
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const restaurants = useMemo(() => api_restaurants ?? [], [api_restaurants]);

  const {
    data: api_orders,
    refetch: refetchOrders,
    isLoading: isOrdersLoading,
  } = useQuery<Order[]>({
    queryKey: ["order"],

    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-delivery-person`, token);
      const body = await res.json();
      const orders = body.ordersList || [];

      return orders//.filter((order: Order) => order.status !== Status.FULFILLED);
    },
    enabled: !!lat && !!lng && !isNaN(lat) && !isNaN(lng),
    retryOnMount: true,
    retry: 3,
    refetchInterval: 1000 * 30, // 30 seconds
    refetchOnMount: "always",
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: [],
  });
  const orders = useMemo(() => api_orders ?? [], [api_orders]);

  return (
    <DataContext.Provider
      value={{
        restaurants,
        refetchRestaurants,
        isRestaurantsLoading,

        orders,
        refetchOrders,
        isOrdersLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

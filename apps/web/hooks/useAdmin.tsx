/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { createPersistedState } from "@/lib/use-persisted-state";
import { Order } from "@/types/order";
import { Allergen, Category, Product } from "@/types/product";
import { Promotion } from "@/types/promotion";
import { Restaurant } from "@/types/restaurant";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

type AdminContextData = {
  selectedRestaurantId: string | null;
  selectRestaurant: (restId: string) => void;

  restaurants: Restaurant[];
  refetchRestaurants: () => void;
  restaurant: Restaurant | undefined;
  restaurant_users: User[];
  refetchRestaurantUsers: () => void;

  products: Product[];
  refetchProducts: () => void;

  orders: Order[];
  refetchOrders: () => void;

  promotions: Promotion[];
  refetchPromotions: () => void;

  categories: Category[];
  refetchCategories: () => void;

  allergens: Allergen[];
  refetchAllergens: () => void;

  users: User[];
  refetchUsers: () => void;
};

const AdminContext = createContext({
  selectedRestaurantId: null,
  selectRestaurant: () => {},

  restaurants: [],
  refetchRestaurants: () => {},
  restaurant: undefined,
  restaurant_users: [],
  refetchRestaurantUsers: () => {},

  products: [],
  refetchProducts: () => {},

  orders: [],
  refetchOrders: () => {},

  promotions: [],
  refetchPromotions: () => {},

  categories: [],
  refetchCategories: () => {},

  allergens: [],
  refetchAllergens: () => {},

  users: [],
  refetchUsers: () => {},
} as AdminContextData);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within a AdminProvider");
  return context;
};
const useRestaurantState = createPersistedState("gf/admin/restaurant");

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();
  const { session } = useAuth();
  if (!session) push("/auth/login");
  const { token } = (session as { token: string }) || {};
  if (!token) push("/auth/login");

  const [selectedRestaurantId, setSelectedRestaurantId] = useRestaurantState<string | null>(null);
  const selectRestaurant = (id: string) => setSelectedRestaurantId(id);

  const { data: api_restaurants, refetch: refetchRestaurants } = useQuery<Restaurant[]>({
    queryKey: ["admin", "restaurant"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant`, token);
      const body = await res.json();
      return body.restaurantsList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const restaurants = useMemo(() => api_restaurants ?? [], [api_restaurants]);
  const { data: api_restaurant_users, refetch: refetchRestaurantUsers } = useQuery<User[]>({
    queryKey: ["admin", "restaurant", "users", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/${selectedRestaurantId}/users`, token);
      const body = await res.json();
      return body.usersList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
    enabled: !!selectedRestaurantId,
  });
  const restaurant_users = useMemo(() => api_restaurant_users ?? [], [api_restaurant_users]);

  const { data: api_products, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["admin", "product", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/product/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      return body.productsList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
    enabled: !!selectedRestaurantId,
  });
  const products = useMemo(() => api_products ?? [], [api_products]);

  const { data: api_orders, refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ["admin", "order", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      return body.ordersList;
    },
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
    placeholderData: [],
    enabled: false, // todo: fix issue #41
    // enabled: !!selectedRestaurantId,
  });
  const orders = useMemo(() => api_orders ?? [], [api_orders]);

  const { data: api_promotions, refetch: refetchPromotions } = useQuery<Promotion[]>({
    queryKey: ["admin", "promotion", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/promotion/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      return body.promotionsList;
    },
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
    placeholderData: [],
  });
  const promotions = useMemo(() => api_promotions ?? [], [api_promotions]);

  const { data: api_allergens, refetch: refetchAllergens } = useQuery<Allergen[]>({
    queryKey: ["admin", "allergen"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/allergen`, token);
      const body = await res.json();
      return body.allergensList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const allergens = useMemo(() => api_allergens ?? [], [api_allergens]);

  const { data: api_categories, refetch: refetchCategories } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/category`, token);
      const body = await res.json();
      return body.categoriesList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const categories = useMemo(() => api_categories ?? [], [api_categories]);

  const { data: api_users, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/user`, token);
      const body = await res.json();
      return body.usersList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const users = useMemo(() => api_users ?? [], [api_users]);

  return (
    <AdminContext.Provider
      value={{
        selectedRestaurantId: selectedRestaurantId as string | null,
        selectRestaurant,

        restaurants,
        restaurant: restaurants.find((r) => r.id === selectedRestaurantId),
        refetchRestaurants,
        restaurant_users,
        refetchRestaurantUsers,

        products,
        refetchProducts,

        orders,
        refetchOrders,

        promotions,
        refetchPromotions,

        categories,
        refetchCategories,

        allergens,
        refetchAllergens,

        users,
        refetchUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

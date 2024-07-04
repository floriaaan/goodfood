/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { createPersistedState } from "@/lib/use-persisted-state";
import { Order } from "@/types/order";
import { Allergen, Category, ExtendedProduct, Product } from "@/types/product";
import { Promotion } from "@/types/promotion";
import { Restaurant } from "@/types/restaurant";
import { Ingredient, IngredientRestaurant, Supplier, SupplyOrder } from "@/types/stock";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

type AdminContextData = {
  selectedRestaurantId: string | null;
  selectRestaurant: (restId: string) => void;

  restaurants: Restaurant[];
  restaurant: Restaurant | undefined;
  refetchRestaurants: () => void;
  isRestaurantsLoading: boolean;

  restaurant_users: User[];
  refetchRestaurantUsers: () => void;
  isRestaurantUsersLoading: boolean;

  extendedProducts: ExtendedProduct[];
  refetchExtendedProducts: () => void;
  products: Product[];
  refetchProducts: () => void;
  isProductsLoading: boolean;

  orders: Order[];
  refetchOrders: () => void;
  isOrdersLoading: boolean;

  promotions: Promotion[];
  refetchPromotions: () => void;
  isPromotionsLoading: boolean;

  categories: Category[];
  refetchCategories: () => void;
  isCategoriesLoading: boolean;

  allergens: Allergen[];
  refetchAllergens: () => void;
  isAllergensLoading: boolean;

  users: User[];
  refetchUsers: () => void;
  isUsersLoading: boolean;

  ingredients: Ingredient[];
  refetchIngredients: () => void;
  isIngredientsLoading: boolean;

  ingredients_restaurant: IngredientRestaurant[];
  refetchIngredientRestaurant: () => void;
  isIngredientsRestaurantLoading: boolean;

  suppliers: Supplier[];
  refetchSuppliers: () => void;
  isSuppliersLoading: boolean;

  supply_orders: SupplyOrder[];
  refetchSupplyOrders: () => void;
  isSupplyOrdersLoading: boolean;
};

const AdminContext = createContext({
  selectedRestaurantId: null,
  selectRestaurant: () => {},

  restaurants: [],
  restaurant: undefined,
  refetchRestaurants: () => {},
  isRestaurantsLoading: true,

  restaurant_users: [],
  refetchRestaurantUsers: () => {},
  isRestaurantUsersLoading: true,

  extendedProducts: [],
  refetchExtendedProducts: () => {},
  products: [],
  refetchProducts: () => {},
  isProductsLoading: true,

  orders: [],
  refetchOrders: () => {},
  isOrdersLoading: true,

  promotions: [],
  refetchPromotions: () => {},
  isPromotionsLoading: true,

  categories: [],
  refetchCategories: () => {},
  isCategoriesLoading: true,

  allergens: [],
  refetchAllergens: () => {},
  isAllergensLoading: true,

  users: [],
  refetchUsers: () => {},
  isUsersLoading: true,

  ingredients: [],
  refetchIngredients: () => {},
  isIngredientsLoading: true,

  ingredients_restaurant: [],
  refetchIngredientRestaurant: () => {},
  isIngredientsRestaurantLoading: true,

  suppliers: [],
  refetchSuppliers: () => {},
  isSuppliersLoading: true,

  supply_orders: [],
  refetchSupplyOrders: () => {},
  isSupplyOrdersLoading: true,
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

  const {
    data: api_restaurants,
    refetch: refetchRestaurants,
    isLoading: isRestaurantsLoading,
  } = useQuery<Restaurant[]>({
    queryKey: ["admin", "restaurant"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      console.log(body.restaurantsList);
      return body.restaurantsList;
    },
    enabled: !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const restaurants = useMemo(() => api_restaurants ?? [], [api_restaurants]);

  const {
    data: api_restaurant_users,
    refetch: refetchRestaurantUsers,
    isLoading: isRestaurantUsersLoading,
  } = useQuery<User[]>({
    queryKey: ["admin", "restaurant", "users", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/${selectedRestaurantId}/users`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.usersList;
    },
    enabled: !!selectedRestaurantId && !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const restaurant_users = useMemo(() => api_restaurant_users ?? [], [api_restaurant_users]);

  const {
    data: api_products,
    refetch: refetchProducts,
    isLoading: isProductsLoading,
  } = useQuery<Product[]>({
    queryKey: ["admin", "product", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/product/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.productsList;
    },
    enabled: !!selectedRestaurantId && !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: [],
  });
  const products = useMemo(() => api_products ?? [], [api_products]);

  const { data: api_extendedProducts, refetch: refetchExtendedProducts } = useQuery<Product[]>({
    queryKey: ["admin", "extendProduct", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/product/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      body.productsList = body.productsList.map((p: ExtendedProduct) => {
        var detail =
          (p.comment == "" ? "Description, " : "") +
          (p.preparation == "" ? "Preparation, " : "") +
          (p.weight == "" ? "Poids, " : "") +
          (p.kilocalories == "" ? "Kilocalories, " : "") +
          (p.nutriscore == "" ? "Nutriscore, " : "") +
          (p.categoriesList?.length == 0 ? "Catégories, " : "") +
          (p.allergensList?.length == 0 ? "Allergènes, " : "");
        detail = detail != "" ? "(" + detail.slice(0, -2) + ")" : "";

        const ok = "✅ Tout est ok !";
        const attention = "⚠️ " + detail.split(",").length + " élément(s) manquant(s) !";

        const comment = detail == "" ? ok : attention;

        console.log(body.productsList);
        return { ...p, additional_information: [comment, detail] };
      });
      return body.productsList;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
    enabled: !!selectedRestaurantId,
  });
  const extendedProducts = useMemo(() => api_extendedProducts ?? [], [api_extendedProducts]);

  const {
    data: api_orders,
    refetch: refetchOrders,
    isLoading: isOrdersLoading,
  } = useQuery<Order[]>({
    queryKey: ["admin", "order", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.ordersList;
    },
    enabled: !!selectedRestaurantId && !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: [],
  });
  const orders = useMemo(() => api_orders ?? [], [api_orders]);

  const {
    data: api_promotions,
    refetch: refetchPromotions,
    isLoading: isPromotionsLoading,
  } = useQuery<Promotion[]>({
    queryKey: ["admin", "promotion", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/promotion/by-restaurant/${selectedRestaurantId}`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.promotionsList;
    },
    enabled: !!selectedRestaurantId && !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
    placeholderData: [],
  });
  const promotions = useMemo(() => api_promotions ?? [], [api_promotions]);

  const {
    data: api_allergens,
    refetch: refetchAllergens,
    isLoading: isAllergensLoading,
  } = useQuery<Allergen[]>({
    queryKey: ["admin", "allergen"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/allergen`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.allergensList;
    },
    enabled: !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const allergens = useMemo(() => api_allergens ?? [], [api_allergens]);

  const {
    data: api_categories,
    refetch: refetchCategories,
    isLoading: isCategoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/category`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.categoriesList;
    },
    enabled: !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: [],
  });
  const categories = useMemo(() => api_categories ?? [], [api_categories]);

  const {
    data: api_users,
    refetch: refetchUsers,
    isLoading: isUsersLoading,
  } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/user`, token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.usersList;
    },
    enabled: !!token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: [],
  });
  const users = useMemo(() => api_users ?? [], [api_users]);

  const {
    data: api_ingredients,
    refetch: refetchIngredients,
    isLoading: isIngredientsLoading,
  } = useQuery<Ingredient[]>({
    queryKey: ["admin", "ingredient"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/stock/ingredient/`, session?.token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.ingredientsList;
    },
    enabled: !!selectedRestaurantId && !!session?.token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const ingredients = useMemo(() => api_ingredients || [], [api_ingredients]);

  const {
    data: api_ingredients_restaurant,
    refetch: refetchIngredientRestaurant,
    isLoading: isIngredientsRestaurantLoading,
  } = useQuery<IngredientRestaurant[]>({
    queryKey: ["admin", "ingredient", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(
        `/api/stock/ingredient/restaurant/by-restaurant/${selectedRestaurantId}`,
        session?.token,
      );
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.ingredientRestaurantsList;
    },
    enabled: !!selectedRestaurantId && !!session?.token,
    staleTime: 1000 * 30, // 30 seconds
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const ingredients_restaurant = useMemo(() => api_ingredients_restaurant || [], [api_ingredients_restaurant]);

  const {
    data: api_suppliers,
    refetch: refetchSuppliers,
    isLoading: isSuppliersLoading,
  } = useQuery<Supplier[]>({
    queryKey: ["admin", "stock", "supply", "supplier"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/stock/supplier`, session?.token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.suppliersList;
    },
    enabled: !!selectedRestaurantId && !!session?.token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const suppliers = useMemo(() => api_suppliers || [], [api_suppliers]);

  const {
    data: api_supply_orders,
    refetch: refetchSupplyOrders,
    isLoading: isSupplyOrdersLoading,
  } = useQuery<SupplyOrder[]>({
    queryKey: ["admin", "stock", "supply", "orders", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/stock/supply/order/by-restaurant/${selectedRestaurantId}`, session?.token);
      const body = await res.json();
      if (body.error) throw new Error(body.error);
      return body.supplyOrdersList;
    },
    enabled: !!selectedRestaurantId && !!session?.token,
    retryOnMount: true,
    retry: 10,
    refetchOnMount: "always",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
  const supply_orders = useMemo(() => api_supply_orders || [], [api_supply_orders]);

  return (
    <AdminContext.Provider
      value={{
        selectedRestaurantId: selectedRestaurantId as string | null,
        selectRestaurant,

        restaurants,
        restaurant: restaurants.find((r) => r.id === selectedRestaurantId),
        refetchRestaurants,
        isRestaurantsLoading,

        restaurant_users,
        refetchRestaurantUsers,
        isRestaurantUsersLoading,

        extendedProducts,
        refetchExtendedProducts,
        products,
        refetchProducts,
        isProductsLoading,

        orders,
        refetchOrders,
        isOrdersLoading,

        promotions,
        refetchPromotions,
        isPromotionsLoading,

        categories,
        refetchCategories,
        isCategoriesLoading,

        allergens,
        refetchAllergens,
        isAllergensLoading,

        users,
        refetchUsers,
        isUsersLoading,

        ingredients,
        refetchIngredients,
        isIngredientsLoading,

        ingredients_restaurant,
        refetchIngredientRestaurant,
        isIngredientsRestaurantLoading,

        suppliers,
        refetchSuppliers,
        isSuppliersLoading,

        supply_orders,
        refetchSupplyOrders,
        isSupplyOrdersLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Toast from "react-native-root-toast";

import { useAuth } from "@/hooks/useAuth";
import { formatEta } from "@/lib/eta";
import { fetchAPI } from "@/lib/fetchAPI";
import { getDirections } from "@/lib/fetchers/externals/mapbox";
import { toPrice } from "@/lib/product/toPrice";
import { Basket, DEFAULT_BASKET } from "@/types/basket";
import { Product } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { MainAddress } from "@/types/user";

type Address = Omit<MainAddress, "id">;

type Taxes = {
  delivery: number;
  service: number;
};

type BasketContextData = {
  // PRODUCT & BASKET
  products: Product[];
  basket: Basket;
  total: string;

  taxes: Taxes;

  // setBasket: (basket: Basket) => void;
  addProduct: (id: string, quantity: number) => void;
  removeProduct: (id: string, quantity: number) => void;

  refetch: () => void;
  // checkout: () => void;

  // RESTAURANT
  selectedRestaurant: Restaurant | null;
  selectedRestaurantId: string | null;
  selectRestaurant: (id: string) => void;

  // ADDRESS
  address: Address | null;
  setAddress: (address: Address) => void;
  eta: string | undefined;

  // HELPERS
  isBasketEmpty: boolean;
  isRestaurantSelected: boolean;
  isAuthenticated: boolean;
};

const BasketContext = createContext({
  basket: {},
} as BasketContextData);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === null) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, isAuthenticated } = useAuth();
  const { mainaddress } = user || {};
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>();

  const [taxes] = useState<Taxes>({
    delivery: 0,
    service: 0.5,
  });

  const { data: api_basket, refetch } = useQuery<Basket>({
    queryKey: ["basket"],
    queryFn: async () => {
      const res = await fetchAPI("/api/basket", session?.token);
      const body = await res.json();
      if (body.restaurantId) setSelectedRestaurantId(body.restaurantId);

      return body;
    },
    placeholderData: DEFAULT_BASKET,
    enabled: isAuthenticated,
  });
  const [local_basket, setLocalBasket] = useState<Basket>(DEFAULT_BASKET);
  const basket: Basket = useMemo(
    () => (isAuthenticated ? (api_basket && api_basket.productsList ? api_basket : DEFAULT_BASKET) : local_basket),
    [api_basket, local_basket, isAuthenticated],
  );

  const { data: api_restaurant } = useQuery<Restaurant>({
    queryKey: ["restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/${selectedRestaurantId}`, undefined);
      const body = await res.json();
      return body;
    },
    enabled: !!selectedRestaurantId,
  });
  const selectedRestaurant = useMemo(() => api_restaurant ?? null, [api_restaurant]);

  const selectRestaurant = async (id: string) => {
    setSelectedRestaurantId(id);
    if (!isAuthenticated) return;
    const res = await fetchAPI("/api/basket/restaurant", session?.token, {
      method: "PUT",
      body: JSON.stringify({ restaurantId: id }),
    });
    if (!res.ok) return;
    refetch();
  };

  // products catalog
  const { data: api_products } = useQuery<Product[]>({
    queryKey: ["product", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/product/by-restaurant/${selectedRestaurantId}`, undefined);
      const body = await res.json();
      return body.productsList;
    },
    enabled: !!selectedRestaurantId,
    placeholderData: [],
  });
  const products = useMemo(() => api_products ?? [], [api_products]);

  const total = useMemo(() => {
    if (basket.productsList.length === 0 || !basket?.productsList) return toPrice(0);

    return toPrice(
      basket.productsList.reduce((acc, { id, quantity }) => {
        const product = products.find((p) => p.id === id);
        if (!product) return acc;
        return acc + product.price * quantity;
      }, 0) +
        taxes.delivery +
        taxes.service,
    );
  }, [basket, taxes, products]);

  const addProduct = async (id: string, quantity: number) => {
    try {
      if (!products || products.length === 0) return;
      const p = products.find((p) => p.id === id);
      if (!p) return;

      if (p.isOutOfStock)
        return Toast.show(`Produit ${p.name} est en rupture de stock ❌`, {
          duration: Toast.durations.LONG,
        });

      let ok = !isAuthenticated; // if not authenticated, add product to basket without calling api
      if (isAuthenticated) {
        const res = await fetchAPI("/api/basket", session?.token, {
          method: "POST",
          body: JSON.stringify({ productId: id, quantity }),
        });
        ok = res.ok;
        refetch();
        // No need to update basket, it will be updated by the query
      } else {
        // We are not authenticated, so we update the basket locally
        setLocalBasket((prev) => {
          // TODO: fix react strict mode issue
          const productsList = Object.values(prev.productsList);
          const p_index = productsList.findIndex((p) => p.id === id);
          if (p_index !== -1) productsList[p_index].quantity += quantity;
          else productsList.push({ id, quantity });
          return { ...prev, productsList } as Basket;
        });
      }

      if (ok)
        return Toast.show(`Produit ${p.name} ajouté au panier ✅`, {
          duration: Toast.durations.LONG,
        });
    } catch (e) {
      console.error(e);
    }
  };

  const removeProduct = async (id: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        // todo: call api to remove product
        await fetchAPI("/api/basket/remove", session?.token, {
          method: "PUT",
          body: JSON.stringify({ productId: id, quantity }),
        });
        refetch();
        Toast.show(`Produit retiré du panier ✅`, {
          duration: Toast.durations.LONG,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // const checkout = () => {
  //   // if (!user) return push("/auth/login");
  //   if (!address || !selectedRestaurantId || Object.values(basket as Basket).filter(Boolean).length === 0) return;

  //   // push("/checkout");
  // };

  const [address, setAddress] = useState<Address>(
    mainaddress ?? {
      street: "",
      zipcode: "",
      city: "",
      country: "France",
      lat: 0,
      lng: 0,
    },
  ) as [Address, (address: Address) => void];

  const [eta, setEta] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (
      !selectedRestaurant ||
      !selectedRestaurant.address ||
      !selectedRestaurant.address.lat ||
      !selectedRestaurant.address.lng
    )
      return;
    (async () => {
      try {
        const directions = await getDirections(
          { lat: selectedRestaurant.address.lat, lng: selectedRestaurant.address.lng },
          { lat: address.lat, lng: address.lng },
        );
        if (!directions || !directions.routes || !directions.routes[0]) return;
        const duration_in_seconds = directions.routes[0].duration;
        const eta = formatEta(duration_in_seconds);
        setEta(eta);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedRestaurantId, address, selectedRestaurant]);

  const isBasketEmpty = Object.values(basket as Basket).filter(Boolean).length === 0;
  const isRestaurantSelected = selectedRestaurantId !== null;

  return (
    <BasketContext.Provider
      value={{
        basket: basket as Basket,
        total,
        taxes,
        // setBasket,
        addProduct,
        removeProduct,
        // checkout,
        refetch,

        products: products ?? [],

        selectedRestaurant,
        selectedRestaurantId: selectedRestaurantId as string | null,
        selectRestaurant,

        address: address as Address | null,
        setAddress,
        eta,

        isBasketEmpty,
        isRestaurantSelected,
        isAuthenticated,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

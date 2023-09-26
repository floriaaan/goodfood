"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { productList } from "@/constants/data";
import { createPersistedState } from "@/lib/use-persisted-state";
import { MainAddress } from "@/types/user";
import { useAuth } from "@/hooks";
type Basket = Record<string, number>;

type Address = Omit<MainAddress, "id" | "lat" | "lng">;

type BasketContextData = {
  // PRODUCT & BASKET
  basket: Basket;
  total: string;
  setBasket: (basket: Basket) => void;
  addProduct: (id: string, quantity: number) => void;
  removeProduct: (id: string, quantity: number) => void;

  // RESTAURANT
  selectedRestaurantId: string | null;
  selectRestaurant: (id: string) => void;

  // PROMOTION
  promotion: any | null;
  checkPromotionCode: (code: string) => void;

  // ADDRESS
  address: Address | null;
  setAddress: (address: Address) => void;
};

const BasketContext = createContext({
  basket: {},
} as BasketContextData);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === null) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

const useBasketState = createPersistedState("gf/basket");
const useRestaurantState = createPersistedState("gf/restaurant");
const useAddressState = createPersistedState("gf/address");

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { mainaddress } = user || {};
  const [basket, setBasket] = useBasketState<Basket>({});

  const total = useMemo(() => {
    return Object.entries(basket as Basket)
      .reduce((acc, [id, quantity]) => {
        const product = productList.find((p) => p.id === id);
        if (!product) return acc;
        return acc + product.price * quantity;
      }, 0)
      .toFixed(2)
      .replace(".", "€");
  }, [basket]);

  const addProduct = (id: string, quantity: number) =>
    setBasket((basket) => {
      const newBasket = { ...basket };
      if (newBasket[id]) newBasket[id] += quantity;
      else newBasket[id] = quantity;
      return newBasket;
    });

  const removeProduct = (id: string, quantity: number) =>
    setBasket((basket) => {
      const newBasket = { ...basket };
      if (newBasket[id] <= quantity) delete newBasket[id];
      else newBasket[id] -= quantity;
      return newBasket;
    });

  const [selectedRestaurantId, setSelectedRestaurantId] = useRestaurantState<string | null>(null);
  const selectRestaurant = (id: string) => setSelectedRestaurantId(id);

  const [promotion, setPromotion] = useState<any>(null);

  const checkPromotionCode = (code: string) => {
    if (!code || code.trim().length === 0) return null;
    // todo: call api to check code

    setPromotion(null);
  };

  const [address, setAddress] = useAddressState<Address | null>(
    mainaddress ?? {
      street: "",
      zipcode: "",
      city: "",
      country: "France",
    },
  );

  return (
    <BasketContext.Provider
      value={{
        basket: basket as Basket,
        total,
        setBasket,
        addProduct,
        removeProduct,

        selectedRestaurantId: selectedRestaurantId as string | null,
        selectRestaurant,

        promotion,
        checkPromotionCode,

        address: address as Address | null,
        setAddress,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

"use client";

import { useState, createContext, useContext } from "react";

// genereated code
// todo: check structure and update
interface Item {
  id: number;
  name: string;
  price: number;
}

interface Basket {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  clearBasket: () => void;

  selectedRestaurantId: string | null; // todo: link to Restaurant["id"] type
  selectRestaurant: (id: string) => void;
}

const useBasketHook = (): Basket => {
  const [items, setItems] = useState<Item[]>([]);
  const addItem = (item: Item) => {
    // todo: post item to basket api endpoint
    setItems([...items, item]);
  };
  const removeItem = (id: number) => {
    // todo: delete item from basket api endpoint
    setItems(items.filter((item) => item.id !== id));
  };
  const clearBasket = () => {
    // todo: delete all items from basket api endpoint
    setItems([]);
  };

  // todo: add default value from user context
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const selectRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
  };

  return { items, addItem, removeItem, clearBasket, selectedRestaurantId, selectRestaurant };
};

interface BasketProviderProps {
  children: React.ReactNode;
}

const BasketContext = createContext<Basket | undefined>(undefined);

export const useBasket = (): Basket => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasketContext must be used within a BasketProvider");
  }
  return context;
};

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const basket = useBasketHook();

  return <BasketContext.Provider value={basket}>{children}</BasketContext.Provider>;
};

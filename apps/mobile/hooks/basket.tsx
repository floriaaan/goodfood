import { productList } from "@/constants/data";
import { createContext, useContext, useMemo, useState } from "react";
type Basket = Record<string, number>;

type BasketContextData = {
  basket: Basket;
  total: number;
  setBasket: (basket: Basket) => void;
  addProduct: (id: string, quantity: number) => void;
  removeProduct: (id: string, quantity: number) => void;
};

const BasketContext = createContext({} as BasketContextData);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === null)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const [basket, setBasket] = useState<Basket>({});
  const total = useMemo(() => {
    return (
      Number(
        Object.entries(basket)
          .reduce((acc, [id, quantity]) => {
            const product = productList.find((p) => p.id === id);
            if (!product) return acc;
            return acc + product.price * quantity;
          }, 0)
          .toFixed(2)
      ) || 0
    );
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

  return (
    <BasketContext.Provider
      value={{
        basket,
        total,
        setBasket,
        addProduct,
        removeProduct,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

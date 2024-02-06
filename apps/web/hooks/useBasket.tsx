"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ToastAction, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { formatEta } from "@/lib/eta";
import { fetchAPI } from "@/lib/fetchAPI";
import { getDirections } from "@/lib/fetchers/externals/mapbox";
import { toPrice } from "@/lib/product/toPrice";
import { createPersistedState } from "@/lib/use-persisted-state";
import { Basket, DEFAULT_BASKET } from "@/types/basket";
import { Product } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { MainAddress } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MainAddress } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  checkout: () => void;

  // RESTAURANT
  selectedRestaurant: Restaurant | null;
  selectedRestaurantId: string | null;
  selectRestaurant: (id: string) => void;

  // PROMOTION
  promotion: any | null;
  checkPromotionCode: (code: string) => void;

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

// const useBasketState = createPersistedState("gf/basket");
const useRestaurantState = createPersistedState("gf/restaurant");
const useAddressState = createPersistedState("gf/address");

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, isAuthenticated } = useAuth();
  const { mainaddress } = user || {};

  const [taxes] = useState<Taxes>({
    delivery: 0,
    service: 0.5,
  });
  const { toast } = useToast();
  const { push } = useRouter();

  const { data: api_basket, refetch } = useQuery<Basket>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["basket"],
    queryFn: async () => {
      const res = await fetchAPI("/api/basket", session?.token);
      const body = await res.json();
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

  const [selectedRestaurantId, setSelectedRestaurantId] = useRestaurantState<string | null>(null);

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
    if (!products || products.length === 0) return;
    const p = products.find((p) => p.id === id);
    if (!p) return;

    if (p.isOutOfStock)
      return toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <XIcon className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>Le produit est victime de son succès !</ToastTitle>
                <small className="text-xs font-bold">
                  Le produit <strong>{p.name}</strong> est en rupture de stock
                </small>
              </div>
            </div>
          </div>
        ),
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
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <Image
                src={p.image as string}
                width={60}
                height={60}
                alt={p.name}
                className="aspect-square h-[60px] w-[60px] shrink-0 object-cover"
              />
              <div className="flex w-full grow flex-col">
                <ToastTitle>Produit ajouté au panier</ToastTitle>
                <small className="text-sm font-bold">{p.name}</small>
                <ToastDescription className="text-xs">
                  Vous pouvez modifier la quantité dans votre panier
                </ToastDescription>
              </div>
            </div>

            <div className="flex shrink-0 items-end justify-end">
              <ToastAction altText="Undo" onClick={() => removeProduct(id, quantity)}>
                Annuler
              </ToastAction>
            </div>
          </div>
        ),
      });
  };

  const removeProduct = async (id: string, quantity: number) => {
    if (isAuthenticated) {
      // todo: call api to remove product
      await fetchAPI("/api/basket/remove", session?.token, {
        method: "PUT",
        body: JSON.stringify({ productId: id, quantity }),
      });
      refetch();
    } else {
      // We are not authenticated, so we update the basket locally
      setLocalBasket((prev) => {
        // TODO: fix react strict mode issue
        const productsList = [...prev.productsList];
        const p_index = productsList.findIndex((p) => p.id === id);
        if (p_index === -1) return basket;
        const { quantity: q } = productsList[p_index];
        if (q > quantity) productsList[p_index].quantity -= quantity;
        else productsList.splice(p_index, 1);

        return { ...prev, productsList } as Basket;
      });
    }
  };

  const checkout = () => {
    if (!user) return push("/auth/login");
    if (!address || !selectedRestaurantId || Object.values(basket as Basket).filter(Boolean).length === 0) return;

    push("/checkout");
  };

  const [promotion, setPromotion] = useState<any>(null);

  const checkPromotionCode = (code: string) => {
    if (!code || code.trim().length === 0) return null;
    // todo: call api to check code

    setPromotion(null);
  };

  const [address, setAddress] = useAddressState<Address>(
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
    if (!selectedRestaurant) return;
    (async () => {
      const directions = await getDirections(
        { lat: selectedRestaurant.address.lat, lng: selectedRestaurant.address.lng },
        { lat: address.lat, lng: address.lng },
      );
      if (!directions) return;
      const duration_in_seconds = directions.routes[0].duration;
      const eta = formatEta(duration_in_seconds);
      setEta(eta);
    })();
  }, [selectedRestaurantId, address, selectedRestaurant]);

  const isBasketEmpty = Object.values(basket as Basket).filter(Boolean).length === 0;
  const isRestaurantSelected = selectedRestaurantId !== null;

  // disabled because we don't want to save on reload if user is already authenticated (because basket is probably loading from api and we don't want to overwrite it)
  // useEffect(() => {
  //   // save the basket when the user authenticate
  //   if (!isAuthenticated) return;
  //   fetchAPI("/api/basket/save", session?.token, {
  //     method: "POST",
  //     body: JSON.stringify({ basket }),
  //   });
  //   refetch();
  //   // disable react-hooks/exhaustive-deps because we don't want to save the basket when the basket change
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, session?.token]);

  return (
    <BasketContext.Provider
      value={{
        basket: basket as Basket,
        total,
        taxes,
        // setBasket,
        addProduct,
        removeProduct,
        checkout,
        refetch,

        products: products ?? [],

        selectedRestaurant,
        selectedRestaurantId: selectedRestaurantId as string | null,
        selectRestaurant,

        promotion,
        checkPromotionCode,

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

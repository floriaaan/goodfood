"use client";

import { BasketExtra } from "@/components/basket/extra";
import { ProductBasketItem } from "@/components/basket/product";
import { BasketPromotion } from "@/components/basket/promotion";
import { BasketTaxes } from "@/components/basket/taxes";
import { Button } from "@/components/ui/button";
import { GradientHeader } from "@/components/ui/header/gradient";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { productList } from "@/constants/data";
import { useAuth, useBasket } from "@/hooks";
import { Product } from "@/types/product";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";
import { MdArrowForward, MdOutlineShoppingBasket } from "react-icons/md";

const BasketWrapperComponent = ({ showHeader = true }) => {
  const { user } = useAuth();
  const { basket, total, selectedRestaurantId } = useBasket();
  const basketProductList = Object.keys(basket)
    .map((id) => productList.find((product) => product.id === id) as Product)
    .filter(Boolean);

  const isBasketEmpty = Object.keys(basket).length === 0;
  const isRestaurantSelected = selectedRestaurantId !== null;
  const isAuthenticated = user !== null;

  return (
    <Suspense>
      <div className="sticky top-2 flex h-fit flex-col border border-gray-200 p-1">
        <section>
          {showHeader && (
            <GradientHeader color="bg-gf-orange/50" wrapperClassName="h-16" className="justify-between px-4 uppercase">
              <div className="inline-flex items-center gap-3">
                <MdOutlineShoppingBasket className="h-8 w-8" />
                <span className="text-2xl font-bold">Panier</span>
              </div>
              {/* <div className="text-gf-orange-900 bg-gf-orange/40 px-2 py-1 font-extrabold">25€50</div> */}
            </GradientHeader>
          )}
          <div className="relative w-full">
            <Image
              src="/images/gradient.png"
              alt="Gradient"
              width={512}
              height={48}
              className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
            />
            <div className="relative flex flex-col gap-y-1 bg-gf-orange/10 p-1">
              {basketProductList.map((product) => (
                <ProductBasketItem key={product.id} {...product} />
              ))}
              {basketProductList.length === 0 && (
                <div className="flex h-20 items-center justify-center">
                  <span className="text-lg font-bold">Votre panier est vide</span>
                </div>
              )}
            </div>
          </div>
        </section>
        <hr className="mx-4 my-2 border border-gray-200" />
        <BasketExtra />
        <BasketPromotion />
        <BasketTaxes />
        <GradientHeader color="bg-gf-green-100/50" wrapperClassName="h-16" className="justify-between px-4 uppercase">
          <div className="inline-flex items-center gap-3">
            <MdOutlineShoppingBasket className="h-8 w-8" />
            <span className="text-2xl font-bold">Total</span>
          </div>
          <div className="bg-gf-green-200/60 px-2 py-1 font-extrabold text-gf-green-600">{total}</div>
        </GradientHeader>
        <div className="mt-2 w-full">
          <Button
            variant="solid"
            className="flex flex-col gap-1 bg-black text-white ring-black"
            disabled={!isRestaurantSelected || isBasketEmpty || !isAuthenticated}
          >
            {/* {!isRestaurantSelected && (
            <span className="inline-flex items-center gap-1">
              <MdRestaurant className="h-6 w-6" />
              Sélectionnez un restaurant
            </span>
          )}
          {isBasketEmpty && (
            <span className="inline-flex items-center gap-1">
              <MdShoppingBasket className="h-6 w-6" />
              Merci de remplir votre panier
            </span>
          )} */}
            {/* {!(!isRestaurantSelected || isBasketEmpty) && ( */}
            <span className="inline-flex items-center gap-1">
              Étape suivante
              <MdArrowForward className="h-6 w-6" />
            </span>
            {/* )} */}
          </Button>
          <small className="m-2 flex flex-wrap gap-1">
            {!isAuthenticated && "Vous devez être connecté pour passer commande"}
            {!isRestaurantSelected && "Vous devez sélectionner un restaurant"}
            {isBasketEmpty && "Votre panier doit contenir au moins un produit"}
          </small>
        </div>
      </div>
    </Suspense>
  );
};

export const BasketWrapper = dynamic(() => Promise.resolve(BasketWrapperComponent), {
  ssr: false,
  loading: LargeComponentLoader,
});

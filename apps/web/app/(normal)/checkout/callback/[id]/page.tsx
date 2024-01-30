"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MdLock, MdRestaurant, MdShoppingBasket } from "react-icons/md";
import { useAuth, useBasket } from "@/hooks";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/fetchAPI";
import { Payment } from "@/types/payment";
import { CheckoutRecap } from "@/app/(normal)/checkout/recap";
import { Delivery } from "@/types/delivery";
import { Order } from "@/types/order";

type PageProps = { params: { id: string } };
export default function CheckoutCallbackPage({ params }: PageProps) {
  const paymentId = decodeURIComponent(params.id);

  const { user, session } = useAuth();

  const { isAuthenticated, isBasketEmpty, isRestaurantSelected } = useBasket();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  if (isAuthenticated && user && user.mainaddress.id && session?.token) {
    const { data: payment } = useQuery<{ Payment: Payment; clientSecret: string }>({
      queryKey: ["payment", paymentId],
      queryFn: async () => {
        const res = await fetchAPI(`/api/payment/${paymentId}`, session?.token);
        const body = await res.json();
        return body;
      },
    });
    const { data: delivery } = useQuery<{ Delivery: Delivery }>({
      queryKey: ["payment", paymentId],
      queryFn: async () => {
        const res = await fetchAPI(`/api/de/${paymentId}`, session?.token);
        const body = await res.json();
        setDelivery(body.delivery);
        return body;
      },
    });
  }

  return (
    <div className="flex h-full grow p-4 pb-12">
      {isAuthenticated && isRestaurantSelected && !isBasketEmpty && (
        <div className="mx-auto flex h-fit w-full max-w-6xl">
          <main className="sticky flex w-full flex-col gap-2 border border-gray-100 bg-white p-4">
            <h2 className="text-xl font-semibold">Etat de la commande</h2>
            <div className="w-full">
              {delivery && (
                <>
                  <div className="flex flex-col items-start gap-3 ">{delivery.status}</div>
                  <hr id="Seperator" className="mx-4 border-gray-100" />
                </>
              )}
            </div>
          </main>
          <div className="flex flex-col gap-1">
            <CheckoutRecap />
            <small className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 text-center text-[10px] leading-3 text-gray-500">
              En passant votre commande, vous acceptez nos
              <u className="font-semibold">Conditions générales de vente</u>
            </small>
            <small className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 text-center text-[10px] leading-3 text-gray-500">
              <MdLock className="h-4 w-4 shrink-0" />
              Paiement 100% sécurisé par <u className="font-semibold">Stripe</u>
            </small>
          </div>
        </div>
      )}
      {!isAuthenticated && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdLock className="h-8 w-8" />
          <span className="text-xl font-semibold">Vous devez être connecté pour passer commande</span>
          <small className="text-sm">Vous pouvez le faire dans la barre de navigation</small>
          <hr className="border-gray-300" />

          <Button asChild className="w-64">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      )}
      {isAuthenticated && !isRestaurantSelected && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdRestaurant className="h-8 w-8" />
          <span className="text-xl font-semibold">Vous devez sélectionner un restaurant</span>
          <small className="text-sm">Vous pouvez le faire dans la barre de navigation</small>
        </div>
      )}
      {isAuthenticated && isRestaurantSelected && isBasketEmpty && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <MdShoppingBasket className="h-8 w-8" />
          <span className="text-xl font-semibold">Votre panier doit contenir au moins un produit</span>
          <small className="text-sm">Vous pouvez le faire sur la page de catalogue</small>
          <hr className="border-gray-300" />
          <Button asChild className="w-64">
            <Link href="/apps/web/public">Voir le catalogue</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

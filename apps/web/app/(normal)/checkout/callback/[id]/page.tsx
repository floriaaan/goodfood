"use client";

import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdDirectionsWalk, MdShoppingBasket } from "react-icons/md";
import { useAuth, useBasket } from "@/hooks";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/fetchAPI";
import { Payment, PaymentStatus } from "@/types/payment";
import { Delivery } from "@/types/delivery";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CheckoutReceipt } from "@/app/(normal)/checkout/receipt";
import { OrderStatusMap } from "@/app/(normal)/account/orders/[id]/map";

type PageProps = { params: { id: string } };
export default function CheckoutCallbackPage({ params }: PageProps) {
  const paymentId = decodeURIComponent(params.id);

  const { user, session } = useAuth();

  const { isAuthenticated, isBasketEmpty, isRestaurantSelected } = useBasket();

  if (!(isAuthenticated && user && session?.token)) return;
  const { data: payment } = useQuery<Payment>({
    queryKey: ["payment", paymentId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/payment/${paymentId}`, session?.token);
      const body = await res.json();
      return body;
    },
  });

  const { data: order } = useQuery<Order>({
    queryKey: ["order", "payment", paymentId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-payment/${paymentId}`, session?.token);
      const body = await res.json();
      return body;
    },
  });

  const { data: delivery } = useQuery<Delivery>({
    queryKey: ["delivery", order?.deliveryId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/api/delivery/${order!.deliveryId}`, session?.token);
      const body = await res.json();
      return body;
    },
    enabled: !!order?.deliveryId,
  });

  return (
    <>
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold underline">
        <MdArrowBack className="h-4 w-4 shrink-0" />
        Retour
      </Link>
      {delivery && payment && (
        <>
          <div className="flex w-full flex-col gap-4 overflow-hidden border border-gray-200 p-4">
            <div className="inline-flex w-full items-center justify-between">
              <h2 className="text-xl font-semibold">Suivi de la commande #{delivery.id}</h2>
              <span className="text-right text-lg font-semibold">
                Arrivée prévue à {format(new Date(delivery.eta), "HH:mm")}
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-3 ">
              <div className="inline-flex items-start gap-1">
                <MdDirectionsWalk className="mt-px w-4 shrink-0" />
                <div className="flex w-full flex-col items-start">
                  <div className="text-sm font-semibold">Je fais livrer ma commande</div>
                  <div className="text-xs">
                    {delivery.address} à {format(new Date(delivery.eta), "HH:mm")}
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1">
                <MdShoppingBasket className="mt-px w-4 shrink-0" />
                <div className="text-sm">
                  {payment.status === PaymentStatus.APPROVED && "La commande a été payée"}
                  {payment.status === PaymentStatus.PENDING && "Le paiement est en attente"}
                  {payment.status === PaymentStatus.REJECTED && "Le paiement a été refusé"}
                </div>
                <Dialog>
                  <DialogTrigger className="ml-1 mt-px inline-flex items-center gap-1 border-b border-black text-xs font-semibold leading-none">
                    Voir le détail
                    <MdArrowForward className="-mt-px h-3 w-3 shrink-0" />
                  </DialogTrigger>
                  <DialogContent className="w-fit pt-12">
                    <CheckoutReceipt {...order} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <OrderStatusMap {...order} />
          </div>
        </>
      )}
    </>
  );
}

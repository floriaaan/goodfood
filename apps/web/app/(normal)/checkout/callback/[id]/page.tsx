"use client";

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
import { useRouter } from "next/navigation";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";

type PageProps = { params: { id: string } };
export default function CheckoutCallbackPage({ params }: PageProps) {
  const { push } = useRouter();
  const paymentId = decodeURIComponent(params.id);

  const { user, session } = useAuth();

  const { isAuthenticated, isBasketEmpty, isRestaurantSelected } = useBasket();

  const { data: order } = useQuery<Order>({
    queryKey: ["Order", "PaymentId", paymentId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-payment/${paymentId}`, session?.token);
      const body = await res.json();
      return body;
    },
  });

  const validateOrder = async (order: Order) => {
    try {
      const res = await fetchAPI(`/api/order/${order.id}`, session?.token, {
        method: "PUT",
        body: JSON.stringify({
          status: "FULFILLED",
          deliveryId: order.deliveryId,
          paymentId: order.paymentId,
          restaurantId: order.restaurantId,
        }),
      });
      // push("/"); // Redirect to home
    } catch (e) {
      console.log(e);
      return;
    }
  };

  if (!(isAuthenticated && user && session?.token)) return;
  return (
    <>
      <div className="flex h-full grow p-4 pb-12">
        <div className="mx-auto flex h-fit w-full max-w-7xl flex-col-reverse gap-2 lg:grid">
          <main className="sticky col-span-2 flex w-full flex-col gap-2 border border-gray-100 bg-white p-4">
            <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold underline">
              <MdArrowBack className="h-4 w-4 shrink-0" />
              Retour
            </Link>
            {order ? (
              <>
                <div className="flex w-full flex-col gap-4 overflow-hidden border border-gray-200 p-4">
                  <div className="inline-flex w-full items-center justify-between">
                    <h2 className="text-xl font-semibold">Suivi de la commande #{order.delivery.id}</h2>
                    <span className="text-right text-lg font-semibold">
                      Arrivée prévue à {format(new Date(order.delivery.eta), "HH:mm")}
                    </span>
                  </div>
                  <div className="flex w-full flex-col items-start gap-3 ">
                    <div className="inline-flex items-start gap-1">
                      <MdDirectionsWalk className="mt-px w-4 shrink-0" />
                      <div className="flex w-full flex-col items-start">
                        <div className="text-sm font-semibold">Je fais livrer ma commande</div>
                        <div className="text-xs">
                          {user?.mainaddress.street} à {format(new Date(order.delivery.eta), "HH:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <MdShoppingBasket className="mt-px w-4 shrink-0" />
                      <div className="text-sm">
                        {order.payment.status === PaymentStatus.APPROVED && "La commande a été payée"}
                        {order.payment.status === PaymentStatus.PENDING && "Le paiement est en attente"}
                        {order.payment.status === PaymentStatus.REJECTED && "Le paiement a été refusé"}
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
                  <button
                    className="gf_shadow_green flex shrink-0 items-center justify-center border border-green-500 bg-gray-100 p-2 font-bold"
                    onClick={() => {
                      validateOrder(order);
                    }}
                  >
                    Valider la réception
                  </button>
                </div>
              </>
            ) : (
              <div className="h-64 w-64">
                <LargeComponentLoader />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

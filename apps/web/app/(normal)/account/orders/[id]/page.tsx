"use client";
import { OrderStatusMap } from "@/app/(normal)/account/orders/[id]/map";
import { CheckoutReceipt } from "@/app/(normal)/checkout/receipt";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Order } from "@/types/order";
import { PaymentStatus } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { MdArrowBack, MdArrowForward, MdDirectionsWalk, MdShoppingBasket } from "react-icons/md";

type PageProps = { params: { id: string } };

export default function UserOrders({ params }: PageProps) {
  // decode url encoded params.id
  const id = decodeURIComponent(params.id);
  const { session, isAuthenticated } = useAuth();
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["user", "order", id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/${id}`, session?.token);
      const body = await res.json();
      return body;
    },
    staleTime: 0, // no stale time because we want to always fetch the latest data
    enabled: isAuthenticated,
  });

  if (isLoading) return <LargeComponentLoader />;
  if (isError) return <div>Erreur lors du chargement de la commande</div>;
  if (!order) return <div>Commande introuvable</div>;

  return (
    <>
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold underline">
        <MdArrowBack className="h-4 w-4 shrink-0" />
        Retour
      </Link>
      <div className="flex w-full flex-col gap-4 overflow-hidden border border-gray-200 p-4">
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">Suivi de la commande #{order.id}</h2>
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
                {order.delivery.address.street} à {format(new Date(order.delivery.eta), "HH:mm")}
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
      </div>
    </>
  );
}

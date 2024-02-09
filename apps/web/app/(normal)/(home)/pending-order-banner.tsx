/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { MdDirectionsBike } from "react-icons/md";

export const PendingOrderBanner = () => {
  const { user, session } = useAuth();

  const { data: order } = useQuery<Order>({
    queryKey: ["order", "user", user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${user?.id}`, session?.token);
      const orders = await res.json();
      return orders.ordersList.findLast((order: Order) => order.status === Status.PENDING);
    },
    enabled: !!user && !!session?.token,
  });
  if (!user) return null;
  if (!order) return null;

  // If last order is older than 7 days, don't show the banner
  const lastOrderDate = new Date(order.delivery.eta.toString());
  const today = new Date();
  const differenceInTime = today.getTime() - lastOrderDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  if (differenceInDays > 7) return null;

  return (
    <Alert className="bg-gf-green-500 px-9 text-sm">
      <AlertTitle className="inline-flex items-center gap-2">
        <MdDirectionsBike className="h-4 w-4 shrink-0" />
        <span>
          <strong>{user?.firstName}</strong>
          {", votre commande est en cours de livraison."}
        </span>
        <a href={"/checkout/callback/" + order.paymentId} className="text-right underline">
          Suivre ma commande
        </a>
      </AlertTitle>
    </Alert>
  );
};

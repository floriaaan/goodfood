"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { MdRateReview } from "react-icons/md";
export const RatingBanner = () => {
  const { user, session } = useAuth();

  const { data: lastOrder } = useQuery<Order>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["order", "user", user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${user?.id}`, session?.token);
      const orders = await res.json();
      return orders.ordersList.findLast((order: Order) => order.status === Status.FULFILLED);
    },
    enabled: !!user && !!session?.token,
  });
  if (!user) return null;
  if (!lastOrder) return null;

  // If last order is older than 7 days, don't show the banner
  const lastOrderDate = new Date(lastOrder.delivery.eta.toString());
  const today = new Date();
  const differenceInTime = today.getTime() - lastOrderDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  if (differenceInDays > 7) return null;

  return (
    <Alert className="bg-muted px-9 text-sm">
      <AlertTitle className="inline-flex items-center gap-2">
        <MdRateReview className="h-4 w-4 shrink-0" />
        <span>
          <strong>{user?.firstName}</strong>
          {", comment s'est passé votre dernière commande ?"}
        </span>
        <a href="#" className="text-right underline">
          Laisser un avis
        </a>
      </AlertTitle>
    </Alert>
  );
};

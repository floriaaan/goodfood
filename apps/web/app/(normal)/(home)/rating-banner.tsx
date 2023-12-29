"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { orderList } from "@/constants/data";
import { useAuth } from "@/hooks";
import { Status } from "@/types/global";
import { MdRateReview } from "react-icons/md";
export const RatingBanner = () => {
  const { user } = useAuth();
  if (!user) return null;

  const lastOrder = orderList.findLast((order) => order.user.id === user.id && order.status === Status.FULFILLED);
  if (!lastOrder) return null;

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

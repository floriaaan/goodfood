"use client";

import { useAuth, useBasket } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { MdReceipt, MdShoppingBasket } from "react-icons/md";

const BasketIndicator = () => {
  const { basket } = useBasket();
  const count =
    basket.productsList
      .map(({ quantity }) => quantity)
      .filter(Boolean)
      .reduce((acc, cur) => acc + cur, 0) ?? 0;

  if (count === 0) return null;

  return (
    <span
      suppressHydrationWarning
      className="absolute right-0 top-0 z-10  inline-flex h-4 w-8 items-center justify-center gap-x-1 bg-gf-orange"
    >
      {count.toString().length < 3 && <MdShoppingBasket className="h-3 w-3 shrink-0" />}
      {count}
    </span>
  );
};

const OrderIndicator = () => {
  const { user, session } = useAuth();

  const { data: orders } = useQuery<Order[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["order", "user", user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${user?.id}`, session?.token);
      const orders = await res.json();
      return orders.filter((order: Order) => order.delivery.status === Status.PENDING) || [];
    },
    enabled: !!user && !!session?.token,
  });
  if (!user) return null;
  if (!orders || orders.length === 0) return null;

  return (
    <div className="absolute right-0 top-0 z-20 flex h-4 w-8 items-center justify-center gap-x-1 bg-gf-green ">
      <MdReceipt className="h-3 w-3 shrink-0" />
      {orders.length}
    </div>
  );
};

const IndicatorComponent = () => {
  return (
    <span className="absolute -right-2 -top-2 text-[0.6rem] font-extrabold text-white">
      <span className="relative">
        <BasketIndicator />
        <OrderIndicator />
      </span>
    </span>
  );
};

export const Indicator = dynamic(() => Promise.resolve(IndicatorComponent), {
  ssr: false,
});

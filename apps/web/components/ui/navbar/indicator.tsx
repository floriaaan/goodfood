"use client";

import { orderList } from "@/constants/data";
import { useAuth, useBasket } from "@/hooks";
import { Status } from "@/types/global";
import dynamic from "next/dynamic";
import { MdReceipt, MdShoppingBasket } from "react-icons/md";

const BasketIndicator = () => {
  const { basket } = useBasket();
  const count =
    Object.values(basket)
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
  const { user } = useAuth();
  if (!user) return null;
  const orders = orderList.filter((order) => order.user.id === user.id && order.status === Status.PENDING);
  if (orders.length !== 0) return null;

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

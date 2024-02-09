"use client";
import { orders_columns } from "@/app/(normal)/account/orders/columns";
import { DataTable } from "@/components/ui/data-table";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function UserOrders() {
  const { session, isAuthenticated } = useAuth();
  const {
    data: api_orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["user", "order", "user", session?.user?.id],
    queryFn: async () => {
      const res = await fetchAPI(`/api/order/by-user/${session?.user?.id}`, session?.token);
      const body = await res.json();
      return body.ordersList;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });
  const orders = useMemo(() => api_orders || [], [api_orders]);

  return (
    <>
      <div className="flex flex-col gap-4 bg-neutral-100 p-4 pt-6 lg:p-8">
        <h2 className="font-ultrabold text-3xl uppercase">Commandes passées</h2>
        {!isLoading && !isError && <DataTable columns={orders_columns} data={orders} />}
        {isLoading && <LargeComponentLoader />}
      </div>
    </>
  );
}

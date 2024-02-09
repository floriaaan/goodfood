"use client";

import { promotions_columns } from "@/app/(normal)/account/promos/columns";
import { DataTable } from "@/components/ui/data-table";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { useAuth, useBasket } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { Promotion } from "@/types/promotion";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function UserPromosPage() {
  const { session, isAuthenticated } = useAuth();
  const { selectedRestaurantId, selectedRestaurant } = useBasket();
  const {
    data: api_promotions,
    isLoading,
    isError,
  } = useQuery<Promotion[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["promotion", "restaurant", selectedRestaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/promotion/by-restaurant/${selectedRestaurantId}`, session?.token);
      const body = await res.json();
      return body.promotionsList;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated && selectedRestaurantId !== null,
  });
  const promotions = useMemo(() => api_promotions || [], [api_promotions]);

  return (
    <>
      <div className="flex flex-col gap-4 bg-neutral-100 p-4 pt-6 lg:p-8">
        <div className="">
          <h2 className="font-ultrabold text-3xl uppercase">Codes promos</h2>
          <small>
            Valables pour le restaurant <strong>{selectedRestaurant?.name}</strong>
          </small>
        </div>
        {!isLoading && !isError && (
          <DataTable columns={promotions_columns} data={promotions} noDataMessage="Pas de codes promos, désolé..." />
        )}
        {isLoading && <LargeComponentLoader />}
      </div>
    </>
  );
}

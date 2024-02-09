"use client";

import { useLocation } from "@/hooks";
import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MdLink } from "react-icons/md";

export const orders_columns: ColumnDef<Order>[] = [
  {
    accessorKey: "restaurantId",
    header: "Restaurant",
    cell(props) {
      const restaurantId = props.getValue() as string;
      const { id } = props.row.original;
      return <RestaurantCell restaurantId={restaurantId} id={id} />;
    },
  },
  {
    accessorFn: (order) => order.payment.total,
    header: "Prix",
    cell(props) {
      const total = props.getValue() as number;
      return <span>{total.toFixed(2).replace(".", "€")}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell(props) {
      const status = props.getValue() as Status;
      return (
        <span>
          {status === Status.FULFILLED
            ? "Commande livrée"
            : status === Status.PENDING
            ? "Commande en cours"
            : status === Status.REJECTED
            ? "Commande annulée"
            : status === Status.IN_PROGRESS
            ? "Commande en cours de livraison"
            : ""}
        </span>
      );
    },
  },
];

const RestaurantCell = ({ restaurantId, id }: { restaurantId: Order["restaurantId"]; id: Order["id"] }) => {
  const { restaurants } = useLocation();
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  return (
    <Link href={`/account/orders/${id}`} className="inline-flex items-center gap-1 hover:underline">
      Commande au <b>{restaurant?.name || restaurantId}</b> <MdLink className="h-4 w-4 shrink-0" />
    </Link>
  );
};

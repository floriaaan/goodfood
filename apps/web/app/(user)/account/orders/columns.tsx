"use client";

import { Status } from "@/types/global";
import { Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import Link from "next/link";
import { MdLink } from "react-icons/md";

export const orders_columns: ColumnDef<Order>[] = [
  {
    accessorFn: (order) => order.delivery.restaurant_id,
    id: "restaurant_id",
    header: "",
    cell(props) {
      const restaurant_id = props.getValue() as string;
      const { id } = props.row.original;
      return (
        <Link href={`/account/orders/${id}`} className="inline-flex items-center gap-1 hover:underline">
          Commande au <b>{restaurant_id}</b> <MdLink className="h-4 w-4 shrink-0" />
        </Link>
      );
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
  {
    accessorKey: "created_at",
    header: "Commande passée le",
    cell(props) {
      return (
        <span>
          Passée le{" "}
          {format(new Date((props.getValue() as string).toString()), "eeee d MMMM yyyy à HH:mm", { locale: fr })}
        </span>
      );
    },
  },
];

"use client";

import { cn } from "@/lib/utils";
import { Address, Restaurant } from "@/types/restaurant";
import { ColumnDef } from "@tanstack/react-table";
import { MdArrowDropUp } from "react-icons/md";
import { RestaurantActions } from "@/components/admin/restaurant/actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const restaurants_columns: ColumnDef<Restaurant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="inline-flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <MdArrowDropUp className={cn("ml-1 h-4 w-4", column.getIsSorted() === "asc" && "rotate-180")} />
        </button>
      );
    },
  },

  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ getValue }) => {
      const value = getValue() as Address;
      return (
        <span>
          {value.street} {value.zipcode} {value.city}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "openinghoursList",
    header: "Horaires",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const restaurant = row.original;

      return <RestaurantActions {...restaurant} />;
    },
  },
];

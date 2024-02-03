"use client";
import Link from "next/link";
import { MdAccountBox, MdReceipt } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const path = usePathname();

  return (
    <div className="my-4 hidden h-full flex-row items-center justify-between gap-2 border border-l-0 border-dashed px-8 py-8 md:flex lg:grow lg:flex-col lg:justify-normal lg:px-2 xl:w-64 ">
      <Link
        href="/account"
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 lg:w-full",
          path === "/account" && "bg-black bg-opacity-5",
        )}
      >
        <MdAccountBox className="h-5 w-5 shrink-0" />
        Infos perso
      </Link>
      <Link
        href="/account/orders"
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 lg:w-full",
          path === "/account/orders" && "bg-black bg-opacity-5",
        )}
      >
        <MdReceipt className="h-5 w-5 shrink-0" />
        Mes commandes
      </Link>
      <Link
        href="/account/promos"
        className={cn(
          "inline-flex w-fit shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 lg:w-full",
          path === "/account/promos" && "bg-black bg-opacity-5",
        )}
      >
        <HiSparkles className="h-5 w-5 shrink-0" />
        Good deals
      </Link>
    </div>
  );
};

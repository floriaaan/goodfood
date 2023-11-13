"use client";
import Link from "next/link";
import { MdAccountBox, MdReceipt } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const path = usePathname();

  return (
    <div className="my-4 flex h-full w-64 grow flex-col items-center border border-l-0 border-dashed px-2 py-8">
      <div className=" flex flex-col gap-2">
        <Link
          href="/account"
          className={cn(
            "inline-flex w-full shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/account" && "bg-black bg-opacity-5",
          )}
        >
          <MdAccountBox className="h-5 w-5 shrink-0" />
          Infos perso
        </Link>
        <Link
          href="/account/orders"
          className={cn(
            "inline-flex w-full shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/account/orders" && "bg-black bg-opacity-5",
          )}
        >
          <MdReceipt className="h-5 w-5 shrink-0" />
          Mes commandes
        </Link>
        <Link
          href="/account/promos"
          className={cn(
            "inline-flex w-full shrink-0 items-center gap-x-1 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/account/promos" && "bg-black bg-opacity-5",
          )}
        >
          <HiSparkles className="h-5 w-5 shrink-0" />
          Good deals
        </Link>
      </div>
    </div>
  );
};

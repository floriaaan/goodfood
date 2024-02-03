"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiSparkles } from "react-icons/hi2";
import { MdAccountBox, MdReceipt } from "react-icons/md";

export const Sidebar = () => {
  const path = usePathname();

  return (
    <div className="mb-2 flex flex-col lg:mb-32">
      <div className="has-background-rectangle h-4"></div>
      <div className=" sticky h-full w-full flex-row flex-nowrap items-center justify-between gap-2 bg-black p-4 text-white md:flex lg:w-fit lg:grow lg:flex-col lg:justify-normal">
        <Link
          href="/account"
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-x-1 whitespace-nowrap border border-transparent px-3 py-2 text-sm font-semibold hover:bg-neutral-700  lg:w-full",
            path === "/account" && "border-white underline",
          )}
        >
          <MdAccountBox className="h-4 w-4 shrink-0" />
          Mon compte
        </Link>
        <Link
          href="/account/orders"
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-x-1 whitespace-nowrap border border-transparent px-3 py-2 text-sm font-semibold hover:bg-neutral-700  lg:w-full",
            path.includes("/account/orders") && "border-white underline",
          )}
        >
          <MdReceipt className="h-4 w-4 shrink-0" />
          Mes commandes
        </Link>
        <Link
          href="/account/promos"
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-x-1 whitespace-nowrap border border-transparent px-3 py-2 text-sm font-semibold hover:bg-neutral-700  lg:w-full",
            path === "/account/promos" && "border-white underline",
          )}
        >
          <HiSparkles className="h-4 w-4 shrink-0" />
          Good deals
        </Link>
      </div>
    </div>
  );
};

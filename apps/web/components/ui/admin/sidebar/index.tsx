"use client";
import Link from "next/link";
import { Logo } from "@/components/ui/icon/logo";
import { Select } from "@/components/ui/select";
import {
  MdChecklist,
  MdCurrencyBitcoin,
  MdDoneAll,
  MdKeyboardBackspace,
  MdTableView,
  MdUnfoldMore,
} from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { restaurantList } from "@/constants/data";

export const Sidebar = () => {
  const [displayMode, setDisplayMode] = useState("Default");
  const { selectRestaurant, selectedRestaurantId } = useAdmin();
  const path = usePathname();

  return (
    <div className="flex h-screen flex-col items-center px-6 py-3 shadow-xl">
      <div className="mb-10">
        <Link id="nav-logo" data-testid="nav-logo" className="mx-6 h-auto" href={"/"}>
          <Logo className="h-10 w-fit" />
        </Link>
        <Link href="/" className="flex items-center justify-center gap-x-1  text-sm font-semibold text-gray-600">
          <MdKeyboardBackspace /> Retour au catalogue
        </Link>
      </div>
      <Select
        aria-label="Restaurant séléctionné"
        options={restaurantList.map((e) => {
          return { label: e.name, value: e.id };
        })}
        selected={selectedRestaurantId ? selectedRestaurantId : restaurantList[0].id}
        setSelected={(restaurant) => {
          selectRestaurant(restaurant);
        }}
      />
      <div className="my-10 flex flex-col gap-2">
        <Link
          href="/admin"
          className={cn(
            "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 ",
            path === "/admin" && "bg-black bg-opacity-10",
          )}
        >
          <MdTableView className="h-5 w-5 shrink-0" /> Visualisation des données
        </Link>
        <Link
          href="/admin/stats"
          className={cn(
            "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/admin/stats" && "bg-black bg-opacity-10",
          )}
        >
          <MdCurrencyBitcoin className="h-5 w-5 shrink-0" /> Statistiques et revenus
        </Link>
        <Link
          href="/admin/stocks"
          className={cn(
            "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/admin/stocks" && "bg-black bg-opacity-10",
          )}
        >
          <MdChecklist className="h-5 w-5 shrink-0" />
          Gestion des stocks
        </Link>
        <Link
          href="/admin/health-check"
          className={cn(
            "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
            path === "/admin/health-check" && "bg-black bg-opacity-10",
          )}
        >
          <MdDoneAll className="h-5 w-5 shrink-0" />
          État de l’application
        </Link>
      </div>
      <div className="mb-5 mt-auto w-full cursor-pointer bg-black bg-opacity-5 px-4 py-2 font-semibold">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex w-full justify-between">
            {displayMode}
            <MdUnfoldMore className="h-5 w-5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-12">
            <DropdownMenuItem
              onClick={(input) => {
                setDisplayMode(input.target!.firstChild.data);
              }}
            >
              Mode 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(input) => {
                setDisplayMode(input.target!.firstChild.data);
              }}
            >
              Mode 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(input) => {
                setDisplayMode(input.target!.firstChild.data);
              }}
            >
              Mode 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

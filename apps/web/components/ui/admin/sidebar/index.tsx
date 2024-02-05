"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/icon/logo";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { Select } from "@/components/ui/select";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHardHat } from "react-icons/fa";
import {
  MdChecklist,
  MdCurrencyBitcoin,
  MdDoneAll,
  MdHomeWork,
  MdKeyboardBackspace,
  MdTableView,
  MdUnfoldMore,
} from "react-icons/md";

export const Sidebar = () => {
  const path = usePathname();
  const { selectRestaurant, restaurants, selectedRestaurantId, restaurant } = useAdmin();

  const [displayMode, setDisplayMode] = useState<"supervision" | "restaurant">("supervision");
  const { push } = useRouter();
  useEffect(() => {
    if (displayMode === "restaurant" && !path.startsWith("/admin/restaurant")) push("/admin/restaurant");
    else if (displayMode === "supervision" && path.startsWith("/admin/restaurant")) push("/admin");
  }, [displayMode, path, push]);

  return (
    <div className="flex h-screen flex-col items-center px-6 py-3 shadow-xl">
      <div className="my-10 flex flex-col items-center justify-center gap-y-4">
        <Link id="nav-logo" data-testid="nav-logo" className="mx-auto h-auto" href={"/"}>
          <Logo className="h-10 w-fit" />
        </Link>
        <Link href="/" className="flex items-center justify-center gap-x-1  text-sm font-semibold text-gray-600">
          <MdKeyboardBackspace /> {"Retour à l'application"}
        </Link>
      </div>
      {restaurants.length > 0 && (
        <Select
          aria-label="Restaurant / Groupe séléctionné"
          options={restaurants.map((e) => ({ label: e.name, value: e.id }))}
          selected={selectedRestaurantId || restaurants[0].id}
          defaultValue={selectedRestaurantId || restaurants[0].id}
          setSelected={selectRestaurant}
        />
      )}
      {restaurant ? (
        <>
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
              href="/admin/stock"
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
              <DropdownMenuTrigger className="inline-flex h-full w-full items-center justify-between text-sm">
                {displayMode === "supervision" ? (
                  <MdHomeWork className="h-5 w-5 shrink-0" />
                ) : (
                  <FaHardHat className="h-5 w-5 shrink-0" />
                )}
                Mode {displayMode}
                <MdUnfoldMore className="h-5 w-5 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                {(["supervision", "restaurant"] as const).map((e) => (
                  <DropdownMenuItem key={e} onClick={() => setDisplayMode(e)}>
                    Mode {e}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <div className="w-full">
          <LargeComponentLoader />
        </div>
      )}
    </div>
  );
};

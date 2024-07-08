"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/icon/logo";
import { LargeComponentLoader } from "@/components/ui/loader/large-component";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { toName } from "@/lib/user";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHardHat } from "react-icons/fa";
import {
  MdAdminPanelSettings,
  MdChecklist,
  MdCurrencyBitcoin,
  MdDirectionsWalk,
  MdDoneAll,
  MdHomeWork,
  MdKeyboardBackspace,
  MdListAlt,
  MdManageAccounts,
  MdTableView,
  MdUnfoldMore,
  MdDocumentScanner,
} from "react-icons/md";

export const Sidebar = () => {
  const path = usePathname();
  const { selectRestaurant, restaurants, selectedRestaurantId, restaurant } = useAdmin();
  const { user, logout } = useAuth();
  if (!user) return null;

  const isManager = user.role.code === "MANAGER";
  const isAdmin = user.role.code === "ADMIN";

  const suffix = path.split("/")[2];
  const isSupervision = suffix === undefined || suffix === "stats" || suffix === "stock" || suffix === "health-check";
  const isRestaurant = suffix === "restaurant";
  const isSuper = suffix === "super";

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
      <div className="flex h-14 w-full shrink-0">
        {restaurants.length > 0 && (
          <Select
            aria-label="Restaurant / Groupe séléctionné"
            options={restaurants.map((e) => ({ label: e.name, value: e.id }))}
            selected={selectedRestaurantId || restaurants[0].id}
            defaultValue={selectedRestaurantId || restaurants[0].id}
            setSelected={selectRestaurant}
          />
        )}
      </div>
      <div className="my-10 h-full w-full grow">
        {isSupervision &&
          (restaurant ? (
            <>
              <div className=" flex h-full w-full grow flex-col gap-2">
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
                {isAdmin && (
                  <Link
                    href="/admin/docs"
                    className={cn(
                      "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5",
                      path === "/admin/docs" && "bg-black bg-opacity-10",
                    )}
                  >
                    <MdDocumentScanner className="h-5 w-5 shrink-0" />
                    Documentation technique
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <LargeComponentLoader />
            </div>
          ))}

        {isRestaurant &&
          (restaurant ? (
            <>
              <div className=" flex h-full w-full grow flex-col gap-2">
                <Link
                  href="/admin/restaurant"
                  className={cn(
                    "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 ",
                    path === "/admin/restaurant" && "bg-black bg-opacity-10",
                  )}
                >
                  <MdListAlt className="h-5 w-5 shrink-0" /> Global
                </Link>
                <Link
                  href="/admin/restaurant/preparation"
                  className={cn(
                    "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 ",
                    path === "/admin/restaurant/preparation" && "bg-black bg-opacity-10",
                  )}
                >
                  <MdChecklist className="h-5 w-5 shrink-0" /> Préparation
                </Link>
                <Link
                  href="/admin/restaurant/delivery"
                  className={cn(
                    "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 ",
                    path === "/admin/restaurant/delivery" && "bg-black bg-opacity-10",
                  )}
                >
                  <MdDirectionsWalk className="h-5 w-5 shrink-0" /> Livraison
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full">
              <LargeComponentLoader />
            </div>
          ))}

        {isSuper && (
          <>
            <div className=" flex h-full w-full grow flex-col gap-2">
              <Link
                href="/admin/super"
                className={cn(
                  "inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold hover:bg-black hover:bg-opacity-5 ",
                  path === "/admin/super" && "bg-black bg-opacity-10",
                )}
              >
                <MdManageAccounts className="h-5 w-5 shrink-0" /> Gestion des rôles
              </Link>
            </div>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className=" inline-flex w-full  cursor-pointer items-center justify-between bg-black/5 px-4 py-2 text-sm font-semibold">
            {(isAdmin || isManager) && isSupervision && <MdHomeWork className="h-5 w-5 shrink-0" />}
            {(isAdmin || isManager) && isRestaurant && <FaHardHat className="h-5 w-5 shrink-0" />}
            {isAdmin && isSuper && <MdAdminPanelSettings className="h-5 w-5 shrink-0" />}

            {(isAdmin || isManager) && isSupervision && "Mode Supervision"}
            {(isAdmin || isManager) && isRestaurant && "Mode Restaurant"}
            {isAdmin && isSuper && "Mode super-administration"}

            <MdUnfoldMore className="h-5 w-5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" side="top">
            {(
              [
                { href: "", label: "Supervision", visible: isAdmin || isManager },
                { href: "restaurant", label: "Restaurant", visible: isAdmin || isManager },
                { href: "super", label: "Super-administration", visible: isAdmin },
              ] as const
            )
              .filter((link) => link.visible)
              .map((e) => (
                <DropdownMenuItem key={e.href} asChild>
                  <Link href={`/admin/${e.href}`} className="w-full">
                    Mode {e.label}
                  </Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="my-4 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex w-full items-center justify-between gap-x-2 py-2 pr-4 text-sm font-semibold">
            <div className="inline-flex items-center gap-x-4">
              <Image
                alt="User profile pic"
                src="/images/tmp/user.png"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
              />
              <span>{toName(user)}</span>
            </div>
            <MdUnfoldMore className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/account/">Mes informations</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="w-full cursor-pointer" onClick={logout}>
                Se déconnecter
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

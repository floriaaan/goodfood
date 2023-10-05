"use client";

import {
  MdAccountBox,
  MdAdminPanelSettings,
  MdAppRegistration,
  MdDashboard,
  MdDeliveryDining,
  MdInfoOutline,
  MdLogin,
  MdMenu,
  MdPowerSettingsNew,
  MdReceipt,
  MdShoppingBasket,
} from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { BasketWrapper } from "@/components/basket";
import { LocationSheetContent } from "@/components/location/sheet-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const MenuDropdown = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="gf_shadow flex h-10 w-10 shrink-0 items-center justify-center border border-black">
          <MdMenu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <MenuSheetContent />
      </SheetContent>
    </Sheet>
  );
};

const MenuSheetContent = () => {
  const { user, logout } = useAuth();
  if (!user) return <NotAuthenticatedMenuSheetContent />;

  return (
    <div className="flex h-full flex-col gap-y-2 px-4 py-8">
      <h2 className="text-xl font-bold">Bonjour {user.firstName}</h2>

      <Accordion type="single" collapsible className="h-full shrink grow">
        <AccordionItem value="account">
          <AccordionTrigger>
            <button className="inline-flex items-center gap-2 text-sm font-bold">
              <MdAccountBox className="h-5 w-5" />
              Mon compte
            </button>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-y-1.5 py-3">
              <Link href="/account" className="inline-flex gap-2 p-3 text-sm duration-75 hover:bg-muted">
                <MdInfoOutline className="h-5 w-5 shrink-0" />
                Mes informations
              </Link>
              <Link href="/orders" className="inline-flex gap-2 p-3 text-sm duration-75 hover:bg-muted">
                <MdReceipt className="h-5 w-5 shrink-0" />
                Mes commandes
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basket">
          <AccordionTrigger>
            <button className="inline-flex items-center gap-2 text-sm font-bold">
              <MdShoppingBasket className="h-5 w-5" />
              Panier
            </button>
          </AccordionTrigger>
          <AccordionContent>
            <BasketWrapper showHeader={false} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger>
            <button className="inline-flex items-center gap-2 text-sm font-bold">
              <MdDeliveryDining className="h-5 w-5" />
              Livraison
            </button>
          </AccordionTrigger>
          <AccordionContent>
            <LocationSheetContent />
          </AccordionContent>
        </AccordionItem>
        {/* TODO: change "ADMIN" to enum */}
        {user.role.code === "ADMIN" && (
          <AccordionItem value="admin">
            <AccordionTrigger>
              <button className="inline-flex items-center gap-2 text-sm font-bold">
                <MdAdminPanelSettings className="h-5 w-5" />
                Administration
              </button>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-1.5 py-3">
                <Link href="/admin" className="inline-flex gap-2 p-3 text-sm duration-75 hover:bg-muted">
                  <MdDashboard className="h-5 w-5 shrink-0" />
                  Tableau de bord
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      <Button onClick={logout} className="justify-start normal-case">
        <MdPowerSettingsNew className="h-5 w-5" />
        Déconnexion
      </Button>
    </div>
  );
};

const NotAuthenticatedMenuSheetContent = () => {
  return (
    <div className="flex h-full flex-col gap-y-4 px-4 py-8">
      <h2 className="text-xl font-bold">Bonjour</h2>
      <p className="text-sm">Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre compte.</p>
      <div className="flex flex-col gap-y-2">
        <Link href={"/auth/login"} className="inline-flex gap-2 p-3 text-sm duration-75 hover:bg-muted">
          <MdLogin className="h-5 w-5" />
          Connexion
        </Link>
        <Link href={"/auth/register"} className="inline-flex gap-2 p-3 text-sm duration-75 hover:bg-muted">
          <MdAppRegistration className="h-5 w-5" />
          Inscription
        </Link>
      </div>
    </div>
  );
};

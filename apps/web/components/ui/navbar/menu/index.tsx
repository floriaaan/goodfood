"use client";

import { MdAccountBox, MdDeliveryDining, MdMenu, MdPowerSettingsNew, MdShoppingBasket } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { BasketWrapper } from "@/components/basket";
import { LocationSheetContent } from "@/components/location/sheet-content";
import { Button } from "@/components/ui/button";

export const MenuDropdown = () => {
  return (
    <Sheet defaultOpen>
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
  const { user, login, logout } = useAuth();
  if (!user) return null;

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
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
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
      </Accordion>
      <Button variant="solid" onClick={logout} className="justify-start normal-case">
        <MdPowerSettingsNew className="h-5 w-5" />
        Déconnexion
      </Button>
    </div>
  );
};

"use client";

import { Logo } from "@/components/ui/icon/logo";
import { restaurantList } from "@/constants/data";
import { useBasket } from "@/hooks/useBasket";
import { cn } from "@/lib/utils";
import { MdArrowForwardIos, MdOutlineLocationOn } from "react-icons/md";

export const LocationFullTrigger = ({ className }: { className?: string }) => {
  const { selectedRestaurantId, address, eta } = useBasket();
  const { street, zipcode, city, country } = address || {};

  const isAddressDefined = street && zipcode && city && country;
  const address_displayed = isAddressDefined ? `${street}, ${zipcode} ${city}, ${country}` : "Ajouter une adresse";

  return (
    <div
      className={cn(
        "cursor-pointer items-center gap-x-3 p-3 duration-200 ease-in-out hover:bg-gray-50 focus:appearance-none",
        className,
      )}
    >
      <div className="relative">
        <MdOutlineLocationOn className="h-7 w-7 shrink-0" />
        {!selectedRestaurantId ||
          (!isAddressDefined && (
            <>
              <span className="absolute right-0 top-0 h-2 w-2 animate-ping rounded-full bg-red-600"></span>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600"></span>
            </>
          ))}
      </div>
      <div className="flex max-w-sm grow flex-col gap-y-0.5">
        <span className="text-xs font-bold">{address_displayed}</span>
        <span className="inline-flex items-center text-xs">
          {selectedRestaurantId ? (
            <>
              {/* todo: link to restaurant list store*/}
              <Logo className="h-4 w-fit" color="text-gray-400" />
              {`${restaurantList.find(({ id }) => id === selectedRestaurantId)?.name} - ${eta}`}
            </>
          ) : (
            "Choisir un restaurant"
          )}
        </span>
      </div>

      <MdArrowForwardIos className="h-5 w-5 shrink-0 rotate-90" />
    </div>
  );
};

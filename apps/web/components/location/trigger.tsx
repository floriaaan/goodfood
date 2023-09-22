"use client";

import { restaurantList } from "@/constants/data";
import { useAuth } from "@/hooks/useAuth";
import { useBasket } from "@/hooks/useBasket";
import { cn } from "@/lib/utils";
import { MdArrowForwardIos, MdOutlineLocationOn } from "react-icons/md";

export const LocationFullTrigger = ({ className }: { className?: string }) => {
  const { selectedRestaurantId } = useBasket();
  const { user } = useAuth();
  const { mainaddress } = user || {};
  const { street, zipcode, city, country } = mainaddress || {};

  //todo: calc time to deliver between restaurant and user (use geolib ? or gmaps api ?)
  const eta = "(12:15 - 12:35)";

  return (
    <div
      className={cn(
        "cursor-pointer items-center gap-x-3 p-3 duration-200 ease-in-out hover:bg-gray-50 focus:appearance-none",
        className,
      )}
    >
      <div className="relative">
        <MdOutlineLocationOn className="h-7 w-7 shrink-0" />
        {!selectedRestaurantId && (
          <>
            <span className="absolute right-0 top-0 h-2 w-2 animate-ping rounded-full bg-red-600"></span>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600"></span>
          </>
        )}
      </div>
      {selectedRestaurantId ? (
        <div className="flex max-w-sm grow flex-col gap-y-0.5">
          <span className="text-xs font-bold">{`${street}, ${zipcode} ${city}, ${country}`}</span>
          <span className="text-xs">{`${// todo: link to restaurant list store
          restaurantList.find(({ id }) => id === selectedRestaurantId)?.name} - ${eta}`}</span>
        </div>
      ) : (
        <div className="flex max-w-sm grow flex-col gap-y-0.5">
          <span className="text-xs font-bold">{`${street}, ${zipcode} ${city}, ${country}`}</span>
          <span className="text-xs">Choisir un restaurant</span>
        </div>
      )}
      <MdArrowForwardIos className="h-5 w-5 shrink-0 rotate-90" />
    </div>
  );
};

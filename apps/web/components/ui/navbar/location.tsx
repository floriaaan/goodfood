"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { restaurantList } from "@/constants/data";
import { useBasket } from "@/hooks/useBasket";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { MdArrowForwardIos, MdLocationOff, MdLocationOn, MdOutlineLocationOn } from "react-icons/md";
import { getDistance } from "geolib";
import { useAuth } from "@/hooks/useAuth";
import dynamic from "next/dynamic";
import { SpinnerLoader } from "@/components/ui/loader/spinner";

export const LocationComponent = ({ trigger }: { className?: string; trigger: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedRestaurantId, selectRestaurant } = useBasket();
  const { user } = useAuth();
  const {
    mainAddress: { street, zip_code, city, country },
  } = user || {};

  // todo: might need to store restaurants in context to avoid re-fetching and have data
  const [restaurants, setRestaurants] = useState(restaurantList);
  const [{ lat, lng }, setLocation] = useState({ lat: NaN, lng: NaN });
  const [search, setSearch] = useState("");

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (isNaN(lat) && isNaN(lng)) return;
    // todo: fetch restaurants by near location
  }, [lat, lng]);

  useEffect(() => {
    if (search.trim().length === 0) return;
    const timeout = setTimeout(() => {
      // todo: fetch restaurants by search
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Sheet open={isModalOpen} onOpenChange={setIsModalOpen} defaultOpen={selectedRestaurantId === null}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto flex min-h-[12rem] w-full max-w-xl flex-col gap-y-4 p-4 pb-8 2xl:max-w-2xl"
      >
        <SheetHeader className="flex items-center justify-between ">
          <span className="text-sm font-bold">Choisir un restaurant</span>
        </SheetHeader>
        <Input
          type="search"
          aria-label="Rechercher un restaurant"
          placeholder="Rechercher un restaurant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative block">
          <hr className="border-gray-100" />
          <div className="absolute top-0 -mt-2 flex w-full items-center justify-center">
            <span className="bg-white px-2 text-xs font-bold uppercase text-gray-500">ou</span>
          </div>
        </div>
        <Button onClick={handleLocation} variant="solid" className="gap-x-1 p-2 text-xs ">
          <MdLocationOn className="h-4 w-4 shrink-0" />
          Utiliser ma position
        </Button>
        <hr className="border-gray-300" />
        <div className="flex max-h-96 flex-col gap-y-1 overflow-y-auto">
          {restaurants.map((restaurant) => (
            <button
              onClick={() => {
                selectRestaurant(restaurant.id);
                setIsModalOpen(false);
              }}
              key={restaurant.id}
              className={cn(
                "flex flex-col gap-y-2 border-2 p-3",
                selectedRestaurantId === restaurant.id ? "border-gray-500 bg-gray-50" : "border-gray-200",
              )}
            >
              <div className="inline-flex w-full items-start justify-between">
                <div className="inline-flex items-center gap-x-2">
                  <Logo className="h-6 w-fit" />
                  <span className="text-sm font-bold">{restaurant.name}</span>
                </div>
                {!isNaN(lat) && !isNaN(lng) ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold">
                    <MdLocationOn className="h-4 w-4" />
                    {`${(
                      getDistance(
                        { latitude: lat, longitude: lng },
                        {
                          latitude: restaurant.coordinates[0],
                          longitude: restaurant.coordinates[1],
                        },
                      ) / 1000
                    ).toFixed(1)} km`}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold">
                    <MdLocationOff className="h-4 w-4" />
                    Localisation indisponible
                  </span>
                )}
              </div>
              <div className="inline-flex items-center gap-x-1 text-xs font-light">
                {
                  // todo: opening hours
                  true ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-600"></span> Ouvert
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-red-600"></span> Fermé
                    </>
                  )
                }
                {` • `}
                {restaurant.opening_hours}
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Trigger = ({ className }: { className?: string }) => {
  const { selectedRestaurantId } = useBasket();
  const { user } = useAuth();
  const {
    mainAddress: { street, zip_code, city, country },
  } = user || {};

  //todo: calc time to deliver between restaurant and user (use geolib ? or gmaps api ?)
  const eta = "(12:15 - 12:35)";

  return (
    <div className={cn("cursor-pointer items-center gap-x-3 p-3 hover:bg-gray-50 ease-in-out focus:appearance-none duration-200", className)}>
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
          <span className="text-xs font-bold">{`${street}, ${zip_code} ${city}, ${country}`}</span>
          <span className="text-xs">{`${// todo: link to restaurant list store
          restaurantList.find(({ id }) => id === selectedRestaurantId)?.name} - ${eta}`}</span>
        </div>
      ) : (
        <div className="flex max-w-sm grow flex-col gap-y-0.5">
          <span className="text-xs font-bold">{`${street}, ${zip_code} ${city}, ${country}`}</span>
          <span className="text-xs">Choisir un restaurant</span>
        </div>
      )}
      <MdArrowForwardIos className="h-5 w-5 shrink-0 rotate-90" />
    </div>
  );
};

export const Location = dynamic(() => Promise.resolve(LocationComponent), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:inline-flex">
      <SpinnerLoader className="h-8 w-8" />
    </div>
  ),
});

"use client";

import { LocationRestaurant } from "@/components/location/restaurant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { restaurantList } from "@/constants/data";
import { useLocation } from "@/hooks/useLocation";
import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";

export const LocationSheetContent = ({ closeModal = () => {} }) => {
  const { lat, lng, refreshLocation } = useLocation();

  // todo: might need to store restaurants in context to avoid re-fetching and have data
  const [restaurants, setRestaurants] = useState(restaurantList);

  const [search, setSearch] = useState("");

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
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex items-center justify-between text-sm font-bold">Choisir un restaurant</div>
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
      <Button onClick={refreshLocation} variant="solid" className="gap-x-1 p-2 text-xs focus:appearance-none focus:border-black">
        <MdLocationOn className="h-4 w-4 shrink-0" />
        Utiliser ma position
      </Button>
      <hr className="border-gray-300" />
      <div className="flex max-h-96 flex-col gap-y-1 overflow-y-auto">
        {restaurants.map((restaurant) => (
          <LocationRestaurant key={restaurant.id} {...restaurant} onClick={closeModal} />
        ))}
      </div>
    </div>
  );
};

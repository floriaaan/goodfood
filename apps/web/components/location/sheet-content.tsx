"use client";

import { LocationRestaurant } from "@/components/location/restaurant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { restaurantList } from "@/constants/data";
import { useBasket, useLocation } from "@/hooks";
import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";

export const LocationSheetContent = ({ closeModal = () => {} }) => {
  const { lat, lng, refreshLocation } = useLocation();
  const { address, setAddress } = useBasket();
  const { street, zipcode, city, country } = address || {
    street: "",
    zipcode: "",
    city: "",
    country: "France",
  };

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
      <div className="flex items-center justify-between text-sm font-bold">Adresse de livraison</div>
      <div className="grid grid-cols-8 gap-2 w-full">
        <Input
          type="text"
          aria-label="Rue"
          placeholder="Rue"
          value={street}
          onChange={(e) => setAddress({ zipcode, city, country, street: e.target.value })}
          wrapperClassName="col-span-8"
        />
        <Input
          type="text"
          aria-label="Code postal"
          placeholder="Code postal"
          value={zipcode}
          onChange={(e) => setAddress({ zipcode: e.target.value, city, country, street })}
          wrapperClassName="col-span-2"
        />
        <Input
          type="text"
          aria-label="Ville"
          placeholder="Ville"
          value={city}
          onChange={(e) => setAddress({ zipcode, city: e.target.value, country, street })}
          wrapperClassName="col-span-4"
        />
        <Input
          type="text"
          aria-label="Pays"
          placeholder="Pays"
          value={country}
          onChange={(e) => setAddress({ zipcode, city, country: e.target.value, street })}
          wrapperClassName="col-span-2"
        />
      </div>
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
      <Button
        onClick={refreshLocation}
        variant="solid"
        className="gap-x-1 p-2 text-xs focus:appearance-none focus:border-black"
      >
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

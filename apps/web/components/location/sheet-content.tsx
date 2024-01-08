"use client";

import { LocationRestaurant } from "@/components/location/restaurant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpinnerLoader } from "@/components/ui/loader/spinner";
import { useBasket, useLocation } from "@/hooks";
import { searchAddress } from "@/lib/fetchers/externals/api-gouv";
import { Suggestion } from "@/types/externals/api-gouv";
import { useEffect, useRef, useState } from "react";
import { MdLocationOn } from "react-icons/md";

export const LocationSheetContent = ({ closeModal = () => {} }) => {
  const { lat, lng, refreshLocation, restaurants } = useLocation();

  /// ADDRESS RELATED  ----------------------------
  const { address, setAddress } = useBasket();
  const { street, zipcode, city, country } = address || {
    street: "",
    zipcode: "",
    city: "",
    country: "France",
  };

  const timeout = useRef<NodeJS.Timer>();
  const [addressInput, setAddressInput] = useState<string>(`${street} ${zipcode} ${city} ${country}`);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isSuggestionsListOpen, setIsSuggestionsListOpen] = useState(false);
  const [preventAddressFetch, setPreventAddressFetch] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>([]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddressInput(value);
    setIsAddressLoading(true);

    clearTimeout(timeout.current as unknown as number);

    if (!e.target.value.trim()) {
      setAddressSuggestions([]);
      setIsSuggestionsListOpen(false);
      setIsAddressLoading(false);
      return;
    }

    timeout.current = setTimeout(async () => {
      if (!preventAddressFetch) {
        const res = await searchAddress(value);
        const { features } = res || { features: [] };
        setAddressSuggestions(features);
        setIsSuggestionsListOpen(true);
        setIsAddressLoading(false);
      }
    }, 2000);

    setPreventAddressFetch(false);
  };

  const handleOnClickSuggestion = (s: Suggestion) => {
    setAddress({
      street: s.properties.name,
      zipcode: s.properties.postcode,
      city: s.properties.city,
      country: "France",
    });

    setAddressInput(`${s.properties.name}, ${s.properties.postcode} ${s.properties.city}, France`);

    setAddressSuggestions([]);
    setPreventAddressFetch(true);
    setIsSuggestionsListOpen(false);
  };

  /// RESTAURANT RELATED  -------------------------
  

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

      <div className="relative h-14 w-full">
        <Input
          type="text"
          aria-label="Adresse"
          value={addressInput}
          onChange={handleAddressChange}
          placeholder="Adresse"
          wrapperClassName="w-full absolute"
          icon={
            isAddressLoading ? <SpinnerLoader className="h-6 w-6" /> : <MdLocationOn className="h-6 w-6 text-black" />
          }
        />
        {isSuggestionsListOpen ? (
          <div className="absolute -bottom-1 z-50 flex w-full flex-col lg:bottom-0.5">
            {addressSuggestions ? (
              <ul className="absolute w-full border border-neutral-300 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-black">
                {addressSuggestions.length > 0 ? (
                  addressSuggestions.map((s) => (
                    <li
                      className="inline-flex w-full cursor-pointer select-none truncate px-2 py-1 text-xs hover:bg-neutral-100 dark:bg-neutral-900"
                      key={s.properties.id}
                      onClick={() => handleOnClickSuggestion(s)}
                    >
                      {s.properties.label}
                    </li>
                  ))
                ) : (
                  <li className="flex h-12 items-center justify-center text-xs">Aucun résultat 😣</li>
                )}
              </ul>
            ) : null}
          </div>
        ) : null}
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
      <Button variant="ghost" onClick={refreshLocation}>
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

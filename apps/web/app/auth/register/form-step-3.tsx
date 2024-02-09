"use client";

import { Button } from "@/components/ui/button";
import { SpinnerLoader } from "@/components/ui/loader/spinner";
import { searchAddress } from "@/lib/fetchers/externals/api-gouv";
import { Suggestion } from "@/types/externals/api-gouv";
import { useRef, useState } from "react";
import { MdArrowLeft, MdArrowRight, MdLocationOn } from "react-icons/md";

type RegisterStep3FormValues = {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  lat: number;
  lng: number;
};

export function RegisterStep3Form({
  onNext,
  onBack,
  initialValues,
}: {
  onNext: (data: RegisterStep3FormValues) => void;
  onBack: () => void;
  initialValues?: RegisterStep3FormValues;
}) {
  const [address, setAddress] = useState<RegisterStep3FormValues>(
    initialValues || {
      street: "",
      city: "",
      zipCode: "",
      country: "",
      lat: 0,
      lng: 0,
    },
  );

  const timeout = useRef<NodeJS.Timer>();
  const [addressInput, setAddressInput] = useState<string>(
    initialValues ? `${initialValues.street} ${initialValues.zipCode} ${initialValues.city} France` : "",
  );
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

  const handleOnClickSuggestion = async (s: Suggestion) => {
    setAddress({
      street: s.properties.name,
      zipCode: s.properties.postcode,
      city: s.properties.city,
      country: "France",
      lat: s.geometry.coordinates[1],
      lng: s.geometry.coordinates[0],
    });

    const str = `${s.properties.name} ${s.properties.postcode} ${s.properties.city} France`;
    setAddressInput(str);

    setAddressSuggestions([]);
    setPreventAddressFetch(true);
    setIsSuggestionsListOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <label
          htmlFor="location"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Adresse principale
        </label>
        <div className="relative mt-2 w-full">
          <input
            id="location"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            type="text"
            value={addressInput}
            onChange={handleAddressChange}
            placeholder="Adresse"
          />
          <div className="pointer-events-none absolute right-2 top-0 flex h-9 w-fit items-center justify-center">
            {isAddressLoading ? <SpinnerLoader className="h-4 w-4" /> : <MdLocationOn className="h-4 w-4 text-black" />}
          </div>
        </div>
        {isSuggestionsListOpen ? (
          <div className="absolute -bottom-1 z-50 flex w-full flex-col">
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

      <div className="inline-flex w-full gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <MdArrowLeft />
          Retour
        </Button>
        <Button type="button" onClick={() => onNext(address)}>
          Suivant
          <MdArrowRight />
        </Button>
      </div>
    </div>
  );
}

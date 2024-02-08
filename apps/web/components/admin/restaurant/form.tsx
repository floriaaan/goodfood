/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Map, RestaurantPin } from "@/components/map";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormTextarea,
} from "@/components/ui/form";
import { MdArrowDropDown, MdDone, MdInfoOutline } from "react-icons/md";
import { Restaurant } from "@/types/restaurant";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/hooks/useAdmin";
import { toName } from "@/lib/user";
import { Marker } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAddress, searchAddress } from "@/lib/fetchers/externals/api-gouv";
import { RestaurantDeleteAlert } from "@/components/admin/restaurant/delete-alert";

// todo: check with restaurant create request
const formSchema = z.object({
  name: z.string() /*.min(3).max(255)*/,
  description: z.string(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  country: z.string(),
  phone: z
    .string()
    .regex(/(\+33 |0)\d (\d{2} ){3}\d{2}|(\+33|0)\d{9}/, "Veuillez vérifier le format du numéros de téléphone"),
  longitude: z.number(),
  latitude: z.number(),

  openingHours: z.string(),
  userIdsList: z.array(z.string()),
});

export type RestaurantCreateEditFormValues = z.infer<typeof formSchema>;

export function RestaurantCreateEditForm({
  initialValues,
  onSubmit,
  id,
  closeSheet,
}: {
  initialValues?: RestaurantCreateEditFormValues;
  onSubmit: (values: RestaurantCreateEditFormValues) => void;
  id?: Restaurant["id"];
  closeSheet: () => void;
}) {
  const { restaurants, restaurant, users } = useAdmin();
  const [[longitude, latitude], setLongLat] = useState([NaN, NaN]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (longitude && latitude && mapRef.current) {
      // @ts-ignore - mapRef is not typed
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        pitch: 40,
      });
    }
  }, [longitude, latitude]);

  const form = useForm<RestaurantCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          userIdsList: initialValues?.userIdsList || [],
        }
      : {
          name: "",
          description: "",
          street: "",
          city: "",
          zipcode: "",
          country: "",
          phone: "",
          longitude: 0,
          latitude: 0,

          openingHours: "",
          userIdsList: [],
        },
  });

  async function handler(values: RestaurantCreateEditFormValues) {
    // eslint-disable-next-line no-console
    console.log("pass", values);
    onSubmit(values);
  }

  async function handleLongLat(values: RestaurantCreateEditFormValues) {
    const data = await searchAddress(`${values.street} ${values.city} ${values.zipcode}`);
    console.log(data);
    if (data.features.length > 1) return;
    setLongLat([data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]]);
    form.setValue("longitude", data.features[0].geometry.coordinates[0]);
    form.setValue("latitude", data.features[0].geometry.coordinates[1]);
    return [data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]];
  }

  async function handleOnclickMap(longitude: number, latitude: number) {
    const data = await getAddress(latitude, longitude);
    form.setValue("street", data.features[0].properties.name);
    form.setValue("city", data.features[0].properties.city);
    form.setValue("zipcode", data.features[0].properties.postcode);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
          <Map
            onClick={(e) => {
              form.setValue("latitude", e.lngLat.lat);
              form.setValue("longitude", e.lngLat.lng);
              setLongLat([e.lngLat.lng, e.lngLat.lat]);
              handleOnclickMap(e.lngLat.lng, e.lngLat.lat);
            }}
            center={{
              latitude: initialValues?.latitude || restaurant?.address.lat || 0,
              longitude: initialValues?.longitude || restaurant?.address.lng || 0,
            }}
            mapRef={mapRef}
          >
            {restaurants.map((r) => (
              <Marker key={r.id} latitude={r.address.lat} longitude={r.address.lng} anchor="bottom">
                <RestaurantPin applyStroke={r.id == id || false} />
              </Marker>
            ))}
            {longitude && latitude && (
              <>
                {(() => {
                  return (
                    <Marker anchor="bottom" longitude={longitude} latitude={latitude}>
                      <RestaurantPin applyStroke={true} />
                    </Marker>
                  );
                })()}
              </>
            )}
          </Map>
          <div className="h-full px-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="general">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <MdInfoOutline className="h-5 w-5 shrink-0" />
                    Général
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-y-2 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du restaurant</FormLabel>
                        <FormControl>
                          <FormInput {...field} placeholder="Egg-ocado Toast" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <FormTextarea rows={4} {...field} placeholder="Ceci n'est pas un restaurant" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <FormInput {...field} placeholder="06 12 34 56 78" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure d'ouverture</FormLabel>
                        <FormControl>
                          <FormInput {...field} placeholder="12h-14h" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userIdsList"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Manager</FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="relative inline-flex h-12 items-center gap-x-1 border p-2">
                              {field.value.length === 0
                                ? "Aucun manager sélectionné"
                                : field.value.map((a) => (
                                    <div className="bg-gray-100 px-1 py-0.5 text-xs" key={a}>
                                      {toName(users.find((al) => al.id.toString() === a))}
                                    </div>
                                  ))}
                              <MdArrowDropDown className="absolute right-2 h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            {users.map((a) => (
                              <DropdownMenuCheckboxItem
                                key={a.id.toString()}
                                checked={field.value.includes(a.id.toString())}
                                onCheckedChange={(checked) => {
                                  form.setValue(
                                    "userIdsList",
                                    checked
                                      ? [...field.value, a.id.toString()]
                                      : field.value.filter((o) => o !== a.id.toString()),
                                  );
                                }}
                              >
                                {toName(a)}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="address">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <FaMapMarkerAlt className="h-5 w-5 shrink-0" />
                    Adresse
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-y-4">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rue</FormLabel>
                          <FormControl>
                            <FormInput
                              placeholder="Numéros et Rue du restaurant"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleLongLat(form.getValues());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <FormInput
                              placeholder="Le Havre"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleLongLat(form.getValues());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <FormInput
                              placeholder="76600"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleLongLat(form.getValues());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <FormInput
                              placeholder="France"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleLongLat(form.getValues());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {initialValues && id && <RestaurantDeleteAlert closeSheet={closeSheet} id={id} />}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

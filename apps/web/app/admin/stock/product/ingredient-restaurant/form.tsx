/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { SupplyOrderDialogContent } from "@/app/admin/stock/supply-order/dialog-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { IngredientRestaurant } from "@/types/stock";
import { TicketIcon } from "lucide-react";
import { MdArrowDropDown, MdDone, MdInfoOutline, MdLink } from "react-icons/md";

const formSchema = z.object({
  ingredientId: z.coerce.number().min(1, "Veuillez sélectionner un ingrédient"),
  restaurantId: z.string().min(1, "Veuillez sélectionner un restaurant"),
  supplierId: z.coerce.number().min(1, "Veuillez sélectionner un fournisseur"),

  unitPrice: z.coerce.number().min(0.01, "Veuillez entrer un prix unitaire"),
  pricePerKilo: z.coerce.number().min(0.01, "Veuillez entrer un prix au kilo"),

  alertThreshold: z.coerce.number().min(1, "Veuillez entrer un seuil d'alerte"),

  inProductListList: z.array(z.string()),
});

export type IngredientRestaurantCreateEditFormValues = z.infer<typeof formSchema>;

export function IngredientRestaurantCreateEditForm({
  initialValues,
  onSubmit,
  id,
  closeSheet,
}: {
  initialValues?: IngredientRestaurantCreateEditFormValues;
  onSubmit: (values: IngredientRestaurantCreateEditFormValues) => void;
  id?: IngredientRestaurant["id"];
  closeSheet: () => void;
}) {
  const { restaurant, restaurants, ingredients, suppliers, products, ingredients_restaurant } = useAdmin();
  if (!restaurant) throw new Error("Restaurant not found");

  const form = useForm<IngredientRestaurantCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? { ...initialValues }
      : {
          ingredientId: undefined,
          restaurantId: restaurant.id, // can't be changed
          supplierId: undefined,

          unitPrice: 0,
          pricePerKilo: 0,

          alertThreshold: 0,

          inProductListList: [],
        },
  });

  async function handler(values: IngredientRestaurantCreateEditFormValues) {
    // eslint-disable-next-line no-console
    onSubmit(values);
  }

  return (
    <Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handler)}
          className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
        >
          <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pt-16">
            <h2 className="line-clamp-2 text-2xl font-bold">
              {id
                ? `Liaison de ${ingredients.find((i) => i.id === form.getValues("ingredientId"))
                    ?.name} à ${restaurants.find((r) => r.id === form.getValues("restaurantId"))?.name}`
                : "Lier un ingrédient à un restaurant"}
            </h2>
            <Accordion type="single" defaultValue="links" collapsible>
              <AccordionItem value="links">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <MdLink className="h-5 w-5 shrink-0" />
                    Liaisons
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-2 ">
                  <FormField
                    control={form.control}
                    name="ingredientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingrédient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="w-full first-letter:uppercase">
                              <SelectValue placeholder="Ingrédient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ingredients.map((i) => (
                              <SelectItem className="first-letter:uppercase" key={i.id} value={i.id.toString()}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant</FormLabel>
                        <Select disabled={!!id} onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Restaurant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {restaurants.map((restaurant) => (
                              <SelectItem key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fournisseur</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Fournisseur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suppliers.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inProductListList"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{"Produits contenant l'ingrédient"}</FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="relative inline-flex h-12 items-center gap-x-1 border p-2">
                              {field.value.length === 0
                                ? "Aucun produit sélectionné"
                                : field.value.map((a) => (
                                    <div className="bg-gray-100 px-1 py-0.5 text-xs" key={a}>
                                      {products.find((p) => p.id.toString() === a)?.name}
                                    </div>
                                  ))}
                              <MdArrowDropDown className="absolute right-2 h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full">
                            {products.map((a) => (
                              <DropdownMenuCheckboxItem
                                key={a.id.toString()}
                                checked={field.value.includes(a.id.toString())}
                                onCheckedChange={(checked) => {
                                  form.setValue(
                                    "inProductListList",
                                    checked
                                      ? [...field.value, a.id.toString()]
                                      : field.value.filter((o) => o !== a.id.toString()),
                                  );
                                }}
                              >
                                {a.name}
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
              <AccordionItem value="general">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <MdInfoOutline className="h-5 w-5 shrink-0" />
                    Général
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-2 ">
                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Prix à l'unité"}</FormLabel>
                        <FormControl>
                          <FormInput {...field} type="number" placeholder="0.5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerKilo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Prix au kilo/litre"}</FormLabel>
                        <FormControl>
                          <FormInput {...field} type="number" placeholder="5" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alertThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Seuil d'alerte"}</FormLabel>
                        <FormControl>
                          <FormInput {...field} type="number" placeholder="10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
            {id && (
              <DialogTrigger asChild>
                <Button variant="outline" type="button" className="w-1/2">
                  <TicketIcon className="h-4 w-4" />
                  Réapprovisionner
                </Button>
              </DialogTrigger>
            )}

            <Button type="submit" className={cn(id ? "w-1/2" : "w-full")}>
              <MdDone className="h-4 w-4" />
              {id ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
      {id && (
        <SupplyOrderDialogContent
          supplier={(ingredients_restaurant.find((ir) => ir.id === id) as IngredientRestaurant).supplier}
          ingredientRestaurant={ingredients_restaurant.find((ir) => ir.id === id) as IngredientRestaurant}
          closeSheet={closeSheet}
        />
      )}
    </Dialog>
  );
}

/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useAdmin } from "@/hooks/useAdmin";
import { toPrice } from "@/lib/product/toPrice";
import { IngredientRestaurant, Supplier } from "@/types/stock";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  supplierId: z.coerce.number().min(1, "Veuillez sélectionner un fournisseur"),
  ingredientRestaurantId: z.coerce.number().min(1, "Veuillez sélectionner un ingrédient"),
  quantity: z.coerce.number().min(1, "Veuillez saisir une quantité"),
});

export type SupplyOrderCreateEditFormValues = z.infer<typeof formSchema>;

export function SupplyOrderCreateEditForm({
  onSubmit,
  supplier,
  ingredientRestaurant,
}: {
  onSubmit: (values: SupplyOrderCreateEditFormValues) => void;
  supplier: Supplier;
  ingredientRestaurant?: IngredientRestaurant;
}) {
  const { suppliers, ingredients_restaurant } = useAdmin();

  const form = useForm<SupplyOrderCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: supplier.id,
      ingredientRestaurantId: ingredientRestaurant?.id,
      quantity: 0,
    },
  });

  async function handler(values: SupplyOrderCreateEditFormValues) {
    onSubmit(values);
  }

  const selectedIngredient = ingredients_restaurant.find(
    (i) => i.id === Number(form.getValues("ingredientRestaurantId")),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between  placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pb-px">
          <FormField
            control={form.control}
            name="ingredientRestaurantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingrédient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ingrédient" className="first-letter:uppercase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ingredients_restaurant
                      .filter((i) => i.supplierId === supplier.id)
                      .map((i) => (
                        <SelectItem className="first-letter:uppercase" key={i.id} value={i.id.toString()}>
                          {i.ingredient.name}
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
                <Select disabled onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Restaurant" />
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Quantité"}</FormLabel>
                <FormControl>
                  <FormInput {...field} type="number" placeholder="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="inline-flex items-center gap-1 text-sm  text-gray-500">
            <span className="min-w-[128px]">Quantité restante:</span>
            <span className="font-bold">{selectedIngredient?.quantity}</span>
          </p>
          <p className="inline-flex items-center gap-1 text-sm  text-gray-500">
            <span className="min-w-[128px]">Total:</span>
            <span className="font-bold">
              {form.getValues("quantity")} x{" "}
              {selectedIngredient?.unitPrice ? toPrice(selectedIngredient.unitPrice) : "prix inconnu"} ={" "}
              {toPrice(form.getValues("quantity") * (selectedIngredient?.unitPrice || 0))}
            </span>
          </p>
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 px-4 ">
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            Créer
          </Button>
        </div>
      </form>
    </Form>
  );
}

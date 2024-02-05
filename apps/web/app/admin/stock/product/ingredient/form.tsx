/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useAdmin } from "@/hooks/useAdmin";
import { IngredientRestaurant } from "@/types/stock";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  ingredientId: z.number().min(1, "Veuillez sélectionner un ingrédient"),
  restaurantId: z.string().min(1, "Veuillez sélectionner un restaurant"),
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
  const { restaurant, restaurants, ingredients } = useAdmin();

  const form = useForm<IngredientRestaurantCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? { ...initialValues }
      : {
          ingredientId: undefined,
          restaurantId: restaurant?.id, // can't be changed
        },
  });

  async function handler(values: IngredientRestaurantCreateEditFormValues) {
    // eslint-disable-next-line no-console
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pt-12">
          <FormField
            control={form.control}
            name="ingredientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingrédient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ingrédient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ingredients.map((i) => (
                      <SelectItem key={i.id} value={i.id.toString()}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
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
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {/* {initialValues && id && <IngredientRestaurantDeleteAlert closeSheet={closeSheet} id={id} />} */}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

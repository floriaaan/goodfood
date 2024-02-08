/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PromotionDeleteAlert } from "@/components/admin/promotion/delete-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useAdmin } from "@/hooks/useAdmin";
import { Promotion } from "@/types/promotion";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  code: z.string().min(2).max(255),
  reduction: z.string(),
  method: z.enum(["PERCENT", "VALUE"]),
  restaurantId: z.string(),
});

export type PromotionCreateEditFormValues = z.infer<typeof formSchema>;

export function PromotionCreateEditForm({
  initialValues,
  onSubmit,
  id,
  closeSheet,
}: {
  initialValues?: PromotionCreateEditFormValues;
  onSubmit: (values: PromotionCreateEditFormValues) => void;
  id?: Promotion["id"];
  closeSheet: () => void;
}) {
  const { restaurant, restaurants } = useAdmin();

  const form = useForm<PromotionCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : {
          code: "",
          reduction: "0",
          method: "VALUE",
          restaurantId: restaurant?.id, // can't be changed
        },
  });

  async function handler(values: PromotionCreateEditFormValues) {
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code promotionnel</FormLabel>
                <FormControl>
                  <FormInput placeholder="FOODGOOD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode de réduction</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Méthode de réduction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VALUE">Par montant</SelectItem>
                    <SelectItem value="PERCENT">Par pourcentage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur de la réduction</FormLabel>
                <FormControl>
                  <FormInput type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valable sur le restaurant</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Valable sur le restaurant" />
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
          {initialValues && id && <PromotionDeleteAlert closeSheet={closeSheet} id={id} />}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

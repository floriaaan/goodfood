/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { IngredientDeleteAlert } from "@/app/admin/stock/product/ingredient/delete-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdmin } from "@/hooks/useAdmin";
import { Ingredient } from "@/types/stock";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  name: z.string().min(1, "Veuillez entrer un nom"),
  description: z.string().nullable(),
});

export type IngredientCreateEditFormValues = z.infer<typeof formSchema>;

export function IngredientCreateEditForm({
  initialValues,
  onSubmit,
  id,
  closeSheet,
}: {
  initialValues?: IngredientCreateEditFormValues;
  onSubmit: (values: IngredientCreateEditFormValues) => void;
  id?: Ingredient["id"];
  closeSheet: () => void;
}) {
  const { ingredients } = useAdmin();
  const form = useForm<IngredientCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? { ...initialValues }
      : {
          name: "",
          description: "",
        },
  });

  async function handler(values: IngredientCreateEditFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pt-12">
          <h2 className="text-2xl font-bold">{id ? `Modifier ${form.getValues("name")}` : "Créer un ingrédient"}</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <FormInput type="text" placeholder="Nom" {...field} />
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
                  <FormInput
                    type="text"
                    placeholder="Description"
                    {...field}
                    value={field.value === null ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <small className="pt-4">
            <strong>Ingrédients déjà créés:</strong>
            <ul>
              {ingredients.map((i) => (
                <li key={i.id} className="list-item first-letter:uppercase">
                  {i.name}
                </li>
              ))}
            </ul>
          </small>
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {initialValues && id && <IngredientDeleteAlert closeSheet={closeSheet} id={id} />}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Supplier } from "@/types/stock";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  name: z.string().min(1, "Veuillez entrer un nom"),
  contact: z.string().min(1, "Veuillez entrer un contact"),
});

export type SupplierCreateEditFormValues = z.infer<typeof formSchema>;

export function SupplierCreateEditForm({
  initialValues,
  onSubmit,
  id,
}: {
  initialValues?: SupplierCreateEditFormValues;
  onSubmit: (values: SupplierCreateEditFormValues) => void;
  id?: Supplier["id"];
  closeSheet: () => void;
}) {
  const form = useForm<SupplierCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? { ...initialValues }
      : {
          name: "",
          contact: "",
        },
  });

  async function handler(values: SupplierCreateEditFormValues) {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Nom du fournisseur"}</FormLabel>
                <FormControl>
                  <FormInput {...field} placeholder="Les fournils du Brasil" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Contact"}</FormLabel>
                <FormControl>
                  <FormInput {...field} placeholder="dubrasil@fournil.com" />
                </FormControl>
                <FormDescription>{"Adresse email ou numéro de téléphone"}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {/* {initialValues && id && <SupplierDeleteAlert closeSheet={closeSheet} id={id} />} */}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

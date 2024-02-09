/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Order } from "@/types/order";
import { MdDelete, MdDone } from "react-icons/md";

const formSchema = z.object({});

export type OrderCreateEditFormValues = z.infer<typeof formSchema>;

export function OrderCreateEditForm({
  initialValues,
  onSubmit,
  id,
}: {
  initialValues?: OrderCreateEditFormValues;
  onSubmit: (values: OrderCreateEditFormValues) => void;
  id?: Order["id"];
}) {
  const form = useForm<OrderCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : {},
  });

  async function handler(values: OrderCreateEditFormValues) {
    // eslint-disable-next-line no-console
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pt-12">{/* form */}</div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {initialValues && (
            <>
              <AlertDialog>
                {/* TODO: delete */}
                <AlertDialogTrigger asChild>
                  <Button variant="outline" type="button">
                    <MdDelete className="h-4 w-4" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette commande ?</AlertDialogTitle>
                    <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction>Continuer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

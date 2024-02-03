"use client";

import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom ne peut pas être une chaîne vide"),
  lastName: z.string().min(1, "Le nom de famille ne peut pas être une chaîne vide"),
  phone: z.string().optional(),
});

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

export function RegisterStep2Form({
  onNext,
  onBack,
  initialValues,
}: {
  onNext: (data: z.infer<typeof formSchema>) => void;
  onBack: () => void;
  initialValues?: z.infer<typeof formSchema>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || { firstName: "", lastName: "", phone: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl className="w-full">
                <FormInput placeholder="Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de famille</FormLabel>
              <FormControl>
                <FormInput placeholder="Bon" {...field} />
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
                <FormInput type="tel" placeholder="+33 6 12 34 56 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="inline-flex w-full gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <MdArrowLeft />
            Retour
          </Button>
          <Button type="submit">
            Suivant
            <MdArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}

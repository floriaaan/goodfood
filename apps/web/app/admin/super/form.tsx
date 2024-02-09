/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { User } from "@/types/user";
import { MdDone } from "react-icons/md";

export const ROLES = ["MANAGER", "ADMIN", "USER", "DELIVERY_PERSON"] as const;
export const ROLES_LABELS = {
  MANAGER: "Manager",
  ADMIN: "Admin",
  USER: "Utilisateur",
  DELIVERY_PERSON: "Livreur",
} as const;

const formSchema = z.object({
  role: z.enum(ROLES),
});

export type RoleCreateEditFormValues = z.infer<typeof formSchema>;

export function RoleCreateEditForm({
  onSubmit,
  user,
}: {
  onSubmit: (values: RoleCreateEditFormValues) => void;
  user: User;
}) {
  const form = useForm<RoleCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: user.role.code as RoleCreateEditFormValues["role"],
    },
  });

  async function handler(values: RoleCreateEditFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between  placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto px-4 pb-1">
          <h2 className="line-clamp-2 text-2xl font-bold">
            Modifier le rôle de {user.firstName} {user.lastName}
          </h2>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ingrédient" className="first-letter:uppercase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((i) => (
                      <SelectItem className="first-letter:uppercase" key={i} value={i}>
                        {ROLES_LABELS[i]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 px-4 ">
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </form>
    </Form>
  );
}

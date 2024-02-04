/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { useAdmin } from "@/hooks/useAdmin";
import { toName } from "@/lib/user";
import { MdDone } from "react-icons/md";

const formSchema = z.object({
  id: z.string().min(1, "L'utilisateur est requis"),
  restaurantId: z.string().min(1, "Le restaurant est requis"),
});

export type UserCreateEditFormValues = z.infer<typeof formSchema>;

export function UserCreateEditForm({
  onSubmit,
  restaurantId,
}: {
  onSubmit: (values: UserCreateEditFormValues) => void;
  restaurantId: string;
}) {
  const { users, restaurant } = useAdmin();
  const form = useForm<UserCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: "", restaurantId },
  });

  async function handler(values: UserCreateEditFormValues) {
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
            name="restaurantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant</FormLabel>
                <Select disabled defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Restaurant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={restaurantId}>{restaurant?.name}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utilisateur à habiliter</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nouveau manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem disabled={restaurant?.useridsList.includes(user.id)} key={user.id} value={user.id}>
                        {toName(user)}
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
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            Créer
          </Button>
        </div>
      </form>
    </Form>
  );
}

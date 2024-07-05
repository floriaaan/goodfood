"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdLock } from "react-icons/md";
import { z } from "zod";
import zxcvbn from "zxcvbn";

const formSchema = z
  .object({
    // email: z.string().email("L'adresse email est invalide"),
    oldpassword: z.string(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm() {
  const { session, refetchUser } = useAuth();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // email: "",
      oldpassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await fetchAPI("/api/user/password", session?.token, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (res.ok) {
      form.reset();
      refetchUser();
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdLock className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>Votre mot de passe a été mis à jour avec succès</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    } else {
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdLock className="h-6 w-6 text-red-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>Erreur lors de la mise à jour de votre mot de passe</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="oldpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancien mot de passe</FormLabel>
              <FormControl>
                <FormInput className="bg-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <FormInput className="bg-white" type="password" {...field} />
              </FormControl>
              <PasswordStrength password={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <FormInput className="bg-white" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Changer le mot de passe</Button>
      </form>
    </Form>
  );
}

const PasswordStrength = ({ password }: { password: string }) => {
  const passwordScore = zxcvbn(password).score;
  return (
    <div className="mt-2 h-2 bg-gray-200">
      <div
        className={[
          " h-2  transition-all duration-500 ease-in-out",
          passwordScore === 0 && password !== ""
            ? "w-10 bg-red-500"
            : passwordScore === 1
              ? "w-1/4 bg-yellow-500"
              : passwordScore === 2
                ? "w-1/2 bg-green-500"
                : passwordScore === 3
                  ? "w-3/4 bg-green-500"
                  : passwordScore === 4
                    ? "w-full animate-pulse bg-blue-500"
                    : "w-0",
        ].join(" ")}
      ></div>
    </div>
  );
};

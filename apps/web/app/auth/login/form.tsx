"use client";

import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdAccountCircle } from "react-icons/md";

export function LoginForm() {
  const { login } = useAuth();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    login(values.email, values.password).then(async (res) => {
      const { ok, status } = res;
      if (!ok || status !== 200) {
        return toast({
          className: "p-3",
          children: (
            <div className="inline-flex w-full items-end justify-between gap-2">
              <div className="inline-flex shrink-0 gap-2">
                <MdAccountCircle className="h-6 w-6 text-red-500" />
                <div className="flex w-full grow flex-col">
                  <ToastTitle>Erreur lors de la connexion.</ToastTitle>
                  <small className="text-xs">Veuillez vérifier vos identifiants.</small>
                </div>
              </div>
            </div>
          ),
        });
      }
      return push("/");
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse mail</FormLabel>
              <FormControl className="w-full">
                <FormInput type="email" placeholder="jean.bon@mail.fr" {...field} />
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
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <FormInput type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="">
          Se connecter
        </Button>
      </form>
    </Form>
  );
}

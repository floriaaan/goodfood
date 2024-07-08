"use client";

import * as z from "zod";
import zxcvbn from "zxcvbn";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdArrowRight } from "react-icons/md";

export function RegisterStep1Form({
  onNext,
  initialValues,
}: {
  onNext: (values: z.infer<typeof formSchema>) => void;
  initialValues?: z.infer<typeof formSchema>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || { email: "", password: "", confirmPassword: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
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
                <div className="relative">
                  <FormInput type="password" placeholder="********" {...field} />
                  {form.getValues("password") !== "" && form.getValues("confirmPassword") !== "" && (
                    <span
                      className={[
                        "absolute inset-y-0 right-0 z-10 flex items-center pr-3",
                        form.getValues("password") !== form.getValues("confirmPassword")
                          ? "text-red-500"
                          : "text-green-500",
                      ].join(" ")}
                    >
                      {form.getValues("password") !== form.getValues("confirmPassword") ? "❌" : "✅"}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="">
          Suivant
          <MdArrowRight />
        </Button>
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

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
  FormTextarea,
} from "@/components/ui/form";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form-select";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MdCloudUpload, MdDelete, MdDone } from "react-icons/md";
import { GiCookingPot, GiWeight } from "react-icons/gi";
import { ProductType, ProductTypeLabels } from "@/types/product";

// todo: check with product create request
const formSchema = z.object({
  name: z.string().min(3).max(255),
  image: z.string().url(),
  comment: z.string().max(255),
  price: z.number().positive(),
  preparation: z.string().max(1024),
  weight: z.string().max(255),
  kilocalories: z.string().max(255),
  nutriscore: z.string().max(255),

  type: z.enum(Object.keys(ProductTypeLabels) as any),

  restaurant_id: z.string().uuid(),
  categories: z.array(z.string().uuid()),
  allegens: z.array(z.string().uuid()),

  ingredients: z.array(z.string().uuid()),
});

export type ProductCreateEditFormValues = z.infer<typeof formSchema>;

export function ProductCreateEditForm({
  initialValues,
  onSubmit,
  onImageChange,
}: {
  initialValues?: ProductCreateEditFormValues;
  onSubmit: (values: ProductCreateEditFormValues) => void;
  onImageChange: (file: File) => Promise<string>;
}) {
  const form = useForm<ProductCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      image: "https://picsum.photos/200/300",
      comment: "",
      price: undefined,
      preparation: "",
      weight: "",
      kilocalories: "",
      nutriscore: "",

      type: ProductType.PLATS,

      restaurant_id: "",
      categories: [],
      allegens: [],

      ingredients: [],
    },
  });

  async function handler(values: ProductCreateEditFormValues) {
    form.setValue("name", "change");
    console.log(values);
    onSubmit(values);
  }

  const image_inputRef = useRef<HTMLInputElement>(null);
  const [image_clientUrl, setImage_clientUrl] = useState<string | null>(initialValues?.image || null);
  const [image_isUpdating, setImage_isUpdating] = useState<boolean>(false);
  const [image_error, setImage_error] = useState<string | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handler)} className="flex w-full flex-col justify-between">
        <div className="flex w-full flex-col gap-y-2 overflow-y-auto">
          <input
            accept=".png, .jpg, .jpeg, .gif"
            ref={image_inputRef}
            type="file"
            className="hidden"
            onChange={async (e) => {
              if (!e.target.files || !e.target.files[0]) return;

              const url = await onImageChange(e.target.files[0]);
              form.setValue("image", url);

              const file = e?.target?.files?.[0];
              const reader = new FileReader();
              reader.addEventListener("load", () => setImage_clientUrl(reader.result?.toString() || null));
              reader.readAsDataURL(file);
            }}
          />

          <button
            type="button"
            disabled={image_isUpdating}
            onClick={() => {
              if (image_inputRef.current) (image_inputRef.current as { click: () => void })?.click();
            }}
            className={cn(
              "border-1 group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden border-dashed border-black p-2 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              image_clientUrl ? "hover:opacity-50 disabled:hover:opacity-100" : "bg-gray-100 hover:bg-gray-200/60",
            )}
          >
            {image_clientUrl ? (
              <Image
                src={image_clientUrl}
                alt={form.getValues("name") || "image"}
                fill
                className="aspect-square h-full w-full object-cover object-center"
              />
            ) : (
              <>
                <MdCloudUpload className="h-6 w-6" />
                <span className="text-sm font-bold uppercase">Ajouter une image</span>
              </>
            )}
          </button>

          <div className="flex flex-col gap-y-2 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <FormInput placeholder="Egg-ocado Toast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <FormTextarea
                      rows={4}
                      {...field}
                      placeholder="Le Egg-ocado Toast est comme un steak à cheval, sauf qu'il n'y a pas de steak, juste un œuf parfaitement cuit au plat perché sur un toast grillé garni d'avocat crémeux. C'est le petit déjeuner parfait pour les amateurs d'avocat et d'œufs qui aiment aussi faire des blagues aux végétariens."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix du produit</FormLabel>
                  <FormControl>
                    <FormInput type="number" placeholder="7€50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de produit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type de produit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ProductTypeLabels).map(([value, label]) => (
                        <SelectItem key={value.toString()} value={value.toString()}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="meta-1">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <GiWeight className="h-5 w-5 shrink-0" />
                    Poids, kilocalories, Nutriscore
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-y-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Poids</FormLabel>
                          <FormControl>
                            <FormInput placeholder="420g" {...field} />
                          </FormControl>
                          <FormDescription>Poids net</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kilocalories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kilocalories</FormLabel>
                          <FormControl>
                            <FormInput placeholder="182kcal" {...field} />
                          </FormControl>
                          <FormDescription>Pour 100g</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nutriscore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nutriscore</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Nutriscore" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="E">E</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="meta-2">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <GiCookingPot className="h-5 w-5 shrink-0" />
                    Préparation, allergènes
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-y-4">
                    <FormField
                      control={form.control}
                      name="preparation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Préparation</FormLabel>
                          <FormControl>
                            <FormTextarea placeholder="Le produit est préparé..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {initialValues && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" type="button">
                    <MdDelete className="h-4 w-4" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            Créer
          </Button>
        </div>
      </form>
    </Form>
  );
}

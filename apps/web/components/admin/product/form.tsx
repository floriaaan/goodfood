/* eslint-disable @tanstack/query/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ProductDeleteAlert } from "@/components/admin/product/delete-alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/form-select";
import { SelectQuantity } from "@/components/ui/form/select-quantity";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { Product, ProductType, ProductTypeLabels, Recipe } from "@/types/product";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GiCook, GiCookingPot, GiWeight } from "react-icons/gi";
import { MdArrowDropDown, MdCloudUpload, MdDelete, MdDone, MdInfoOutline } from "react-icons/md";

// todo: check with product create request
const formSchema = z.object({
  name: z.string().min(3).max(255),
  image: z.string().url(),
  comment: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  preparation: z.string().max(1024).optional(),
  weight: z.string().max(255).optional(),
  kilocalories: z.string().max(255).optional(),
  nutriscore: z.string().max(255).optional(),

  type: z.string(),

  restaurantId: z.string(),
  categoriesList: z.array(z.string()).optional(),
  allergensList: z.array(z.string()).optional(),

  recipeList: z.array(z.object({ ingredientId: z.string(), quantity: z.number() })).min(1),
});

export type ProductCreateEditFormValues = z.infer<typeof formSchema>;

export function ProductCreateEditForm({
  initialValues,
  onSubmit,
  onImageChange,
  id,
  closeSheet,
}: {
  initialValues?: ProductCreateEditFormValues;
  onSubmit: (values: ProductCreateEditFormValues) => void;
  onImageChange: (file: File) => Promise<string>;
  id?: Product["id"];
  closeSheet: () => void;
}) {
  const { ingredients_restaurant, categories, allergens, restaurant } = useAdmin();

  const form = useForm<ProductCreateEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          price: initialValues.price.toString(),
        }
      : {
          name: "",
          image: "https://picsum.photos/200/300",
          comment: "",
          price: "0.0",
          preparation: "",
          weight: "",
          kilocalories: "",
          nutriscore: "",

          type: ProductType.PLATS.toString(),

          restaurantId: restaurant?.id || "",
          categoriesList: [],
          allergensList: [],

          recipeList: [],
        },
  });

  const image_inputRef = useRef<HTMLInputElement>(null);
  const [image_clientUrl, setImage_clientUrl] = useState<string | null>(initialValues?.image || null);
  // TODO: implement
  // const [image_isUpdating, setImage_isUpdating] = useState<boolean>(false);
  // const [image_error, setImage_error] = useState<string | null>(null);

  async function handler(values: ProductCreateEditFormValues) {
    // eslint-disable-next-line no-console
    console.log("pass", values);
    onSubmit(values);
  }

  // ingredients are not included in the form
  const [ingredients, setIngredients] = useState<{ value: string; quantity: number }[]>(
    form.getValues("recipeList").map((i: Recipe) => ({ value: i.ingredientId, quantity: i.quantity })),
  );

  useEffect(() => {
    form.setValue(
      "recipeList",
      ingredients.map((i) => ({ ingredientId: i.value, quantity: i.quantity })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handler)}
        className="flex h-full w-full flex-col justify-between placeholder:text-gray-200"
      >
        <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto">
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
            // disabled={image_isUpdating}
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

          <div className="h-full px-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="general">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <MdInfoOutline className="h-5 w-5 shrink-0" />
                    Général
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-y-2 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit*</FormLabel>
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
                        <FormLabel>Prix du produit*</FormLabel>
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
                        <FormLabel>Type de produit*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={ProductType[parseInt(field.value)]}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type de produit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(ProductTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={ProductType[parseInt(value)]}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
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
                    <GiCook className="h-5 w-5 shrink-0" />
                    Préparation, allergènes, catégories
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
                    <FormField
                      control={form.control}
                      name="allergensList"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Allergènes</FormLabel>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative inline-flex h-12 items-center gap-x-1 border p-2">
                                {field.value?.length === 0
                                  ? "Aucun allergène sélectionné"
                                  : field.value?.map((a) => (
                                      <div className="bg-gray-100 px-1 py-0.5 text-xs" key={a}>
                                        {allergens.find((al) => al.id.toString() === a)?.libelle}
                                      </div>
                                    ))}
                                <MdArrowDropDown className="absolute right-2 h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              {allergens.map((a) => (
                                <DropdownMenuCheckboxItem
                                  key={a.id.toString()}
                                  checked={field.value?.includes(a.id.toString())}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      "allergensList",
                                      checked
                                        ? [...(field.value || []), a.id.toString()]
                                        : field.value?.filter((o) => o !== a.id.toString()),
                                    );
                                  }}
                                >
                                  {a.libelle}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoriesList"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Catégories</FormLabel>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative inline-flex h-12 items-center gap-x-1 border p-2">
                                {field.value?.length === 0
                                  ? "Aucune catégorie sélectionnée"
                                  : field.value?.map((a) => {
                                      const category = categories.find((al) => al.id.toString() === a);
                                      if (!category) return null;
                                      return (
                                        <div className="bg-gray-100 px-1 py-0.5 text-xs" key={a}>
                                          {`${category.icon} ${category.libelle}`}
                                        </div>
                                      );
                                    })}
                                <MdArrowDropDown className="absolute right-2 h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              {categories.map((a) => (
                                <DropdownMenuCheckboxItem
                                  key={a.id.toString()}
                                  checked={field.value?.includes(a.id.toString())}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      "categoriesList",
                                      checked
                                        ? [...(field.value || []), a.id.toString()]
                                        : field.value?.filter((o) => o !== a.id.toString()),
                                    );
                                  }}
                                >
                                  {`${a.icon} ${a.libelle}`}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients">
                <AccordionTrigger>
                  <div className="inline-flex items-center gap-x-2">
                    <GiCookingPot className="h-5 w-5 shrink-0" />
                    Ingrédients
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-y-4">
                    <SelectQuantity
                      options={ingredients_restaurant.map((i) => ({
                        label: i.ingredient.name,
                        value: i.id?.toString(),
                      }))}
                      placeholder="Ingrédient"
                      state={ingredients.map((i) => ({ value: i.value, quantity: i.quantity }))}
                      // @ts-ignore
                      setState={setIngredients}
                    />
                    <ul className="w-full">
                      {ingredients.map((i) => (
                        <li
                          className="mb-2 inline-flex w-full list-disc items-center justify-between last:mb-0"
                          key={i.value?.toString()}
                        >
                          <span className="inline-flex items-center gap-1">
                            &bull;
                            <strong>
                              {
                                ingredients_restaurant.find((il) => il.ingredientId?.toString() === i.value?.toString())
                                  ?.ingredient.name
                              }{" "}
                              ({i.quantity})
                            </strong>
                          </span>
                          <button
                            onClick={() => setIngredients((old) => old.filter((o) => o.value !== i.value))}
                            className="text-red inline-flex w-fit items-center gap-1 normal-case text-red-600 hover:underline"
                          >
                            <MdDelete className="h-4 w-4" />
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="item-center inline-flex h-24 shrink-0 items-center justify-between gap-4 bg-gray-50 p-6">
          {initialValues && id && <ProductDeleteAlert closeSheet={closeSheet} id={id} />}
          <Button type="submit">
            <MdDone className="h-4 w-4" />
            {id ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

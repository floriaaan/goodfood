"use client";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBasket } from "@/hooks";
import { getNutriscoreImageUrl } from "@/lib/product/nutriscore";
import { toPrice } from "@/lib/product/toPrice";
import { Product } from "@/types/product";
import Image from "next/image";

export const ProductSheetContent = (product: Product) => {
  const { addProduct } = useBasket();

  return (
    <SheetContent side="left">
      <div className="flex h-full flex-col justify-between">
        <div className="relative h-72 w-full">
          <Image
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            width={600}
            height={400}
          />
          <SheetClose />
        </div>
        <div className="flex grow flex-col gap-4 overflow-y-auto p-4">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          <p className="line-clamp-5 text-xs leading-5 text-gray-400">{product.comment}</p>
          <div className="inline-flex items-center justify-around bg-gray-100">
            <div className="flex shrink-0 flex-col items-center justify-center px-6 py-4">
              <span className="text-lg font-bold text-black">{product.weight}</span>
              <span className="-mt-1 text-xs">poids net</span>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center px-6 py-4">
              <span className="text-lg font-bold text-black">{product.kilocalories}</span>
              <span className="-mt-1 text-xs">pour 100g</span>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center px-6 py-4">
              {product.nutriscore !== -1 ? (
                <Image
                  src={getNutriscoreImageUrl(product)}
                  alt={`Score nutritionnel de ${product.name}`}
                  height={56}
                  width={100}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="text-lg font-bold text-black">N/A</span>
                  <span className="-mt-1 text-xs">Nutriscore</span>
                </>
              )}
            </div>
          </div>
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="-mt-2 w-full justify-between">
              <TabsTrigger value="prep">Préparation</TabsTrigger>
              <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
              <TabsTrigger value="allergens">Allergènes</TabsTrigger>
            </TabsList>
            <div className="mt-2">
              <TabsContent value="prep" className="flex flex-col gap-y-2">
                <p className="text-[10px] uppercase">Préparation</p>
                {product.preparation && <p>{product.preparation}</p>}
              </TabsContent>
              <TabsContent value="ingredients" className="flex flex-col gap-y-2">
                <p className="text-[10px] uppercase">Ingrédients</p>
                {/* TODO:  */}
              </TabsContent>
              <TabsContent value="allergens" className="flex flex-col gap-y-2">
                <p className="text-[10px] uppercase">Allergènes</p>
                <ul>
                  {product.allergensList.map((allergen) => (
                    <li key={allergen.id}>{allergen.libelle}</li>
                  ))}
                </ul>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="item-center inline-flex h-16 items-center justify-between gap-4 bg-gray-50 p-4">
          <span className="h-fit bg-gray-200/60 px-2 py-1 font-extrabold text-gray-600">{toPrice(product.price)}</span>
          <Button
            className="h-fit w-fit bg-black text-white ring-black"
            disabled={product.isOutOfStock}
            onClick={() => addProduct(product.id, 1)}
          >
            Je prends ça
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

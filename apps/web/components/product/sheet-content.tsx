import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNutriscoreImageUrl } from "@/lib/product/nutriscore";
import { Product } from "@/types/product";
import Image from "next/image";
import { MdClose } from "react-icons/md";

export const ProductSheetContent = (product: Product) => {
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
          <SheetClose className="absolute right-4 top-4 z-50">
            <Button variant="solid" className="border border-black bg-white text-black">
              <MdClose className="h-4 w-4" />
            </Button>
          </SheetClose>
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
              <Image
                src={getNutriscoreImageUrl(product)}
                alt={`Score nutritionnel de ${product.name}`}
                height={48}
                width={100}
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="w-full justify-between">
              <TabsTrigger value="prep">Préparation</TabsTrigger>
              <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
              <TabsTrigger value="allergens">Allergènes</TabsTrigger>
            </TabsList>
            <TabsContent value="prep">prep</TabsContent>
            <TabsContent value="ingredients">ingredients</TabsContent>
            <TabsContent value="allergens">allergens</TabsContent>
          </Tabs>
        </div>
        <div className="item-center inline-flex h-16 items-center justify-between gap-4 bg-gray-50 p-4">
          <span className="h-fit bg-gray-200/60 px-2 py-1 font-extrabold text-gray-600">
            {product.price.toFixed(2).replace(".", "€")}
          </span>
          <Button className="h-fit w-fit bg-black text-white ring-black" variant="solid">
            Je prends ça
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

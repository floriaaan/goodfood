import { ProductSheetContent } from "@/components/product/sheet-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useBasket } from "@/hooks/useBasket";
import { Product } from "@/types/product";
import Image from "next/image";

export const ProductCatalogList = (product: Product) => {
  const { addProduct } = useBasket();
  return (
    <Sheet key={product.id}>
      <div className="h-fit border border-black">
        <SheetTrigger asChild>
          <div className="relative h-48 w-full cursor-pointer border-black">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={800}
              className="h-full w-full shrink-0 object-cover"
            />
            <div className="absolute bottom-2 left-2 inline-flex items-center">
              {product.categories.map((category, i) => (
                <span
                  key={`${category.id}-${i}`}
                  className="inline-flex items-center gap-x-2 px-2 py-1 text-xs text-black"
                  style={{ backgroundColor: category.hexa_color }}
                >
                  <span>{category.icon}</span>
                  {category.libelle}
                </span>
              ))}
            </div>
          </div>
        </SheetTrigger>
        <div className="flex flex-col gap-y-2 border-y border-black p-4">
          <h3 className="text-sm font-bold">{product.name}</h3>
          <p className="line-clamp-2 h-8 text-xs">{product.comment}</p>
        </div>
        <div className="inline-flex w-full items-center justify-between gap-4 p-4">
          <span className="bg-gray-200/60 px-2 py-1 font-extrabold text-gray-600">
            {product.price.toFixed(2).replace(".", "€")}
          </span>
          <Button className="w-fit bg-black text-white ring-black" onClick={() => addProduct(product.id, 1)}>
            Je prends ça
          </Button>
        </div>
      </div>
      <ProductSheetContent {...product} />
    </Sheet>
  );
};

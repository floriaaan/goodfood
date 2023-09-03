import { ProductSheetContent } from "@/components/product/sheet-content";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/types/product";
import Image from "next/image";
import { MdAdd, MdDelete, MdRemove } from "react-icons/md";

export const ProductBasketItem = (product: Product) => {
  return (
    <Sheet key={product.id}>
      <div className="inline-flex h-20 w-full p-1 xl:h-24">
        <SheetTrigger asChild>
          <Image
            className="h-full w-24 shrink-0 cursor-pointer border border-black object-cover xl:w-32"
            width={256}
            height={192}
            src={product.image}
            alt={product.name}
          />
        </SheetTrigger>
        <div className="flex h-full w-full grow flex-col justify-between p-2">
          <span className="text-sm font-bold">{product.name}</span>
          <div className="inline-flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-x-1">
              <button className="flex h-8 w-8 items-center justify-center border bg-gray-100">
                <MdRemove className="h-4 w-4" />
              </button>
              <span className="flex h-8 w-8 items-center justify-center border bg-gray-100 text-xs font-bold">1</span>
              <button className="flex h-8 w-8 items-center justify-center border bg-gray-100">
                <MdAdd className="h-4 w-4" />
              </button>
            </div>
            <div className="inline-flex items-center gap-x-1">
              <button className="flex h-8 w-8 items-center justify-center border bg-gray-100">
                <MdDelete className="h-4 w-4" />
              </button>
              <span className="flex h-8 items-center justify-center border bg-gray-200 px-2 text-sm font-bold text-black">
                {product.price.toFixed(2).replace(".", "€")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ProductSheetContent {...product} />
    </Sheet>
  );
};

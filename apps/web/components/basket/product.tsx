import { ProductSheetContent } from "@/components/product/sheet-content";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useBasket } from "@/hooks/useBasket";
import { Product } from "@/types/product";
import Image from "next/image";
import { MdAdd, MdDelete, MdRemove } from "react-icons/md";

export const ProductBasketItem = (product: Product) => {
  const { addProduct, removeProduct, basket } = useBasket();
  return (
    <Sheet key={product.id}>
      <div className="inline-flex h-16 w-full p-1 xl:h-20">
        <SheetTrigger asChild>
          <Image
            className="h-full w-12 shrink-0 cursor-pointer border border-black object-cover xl:w-24"
            width={256}
            height={192}
            src={product.image}
            alt={product.name}
          />
        </SheetTrigger>
        <div className="flex h-full w-full grow flex-col justify-between px-2 pt-1">
          <span className="line-clamp-2 h-full grow text-sm ">{product.name}</span>
          <div className="inline-flex w-full items-end justify-between">
            <div className="inline-flex items-center">
              <button
                className="flex h-6 w-6 items-center justify-center border bg-gray-100"
                onClick={() => removeProduct(product.id, 1)}
              >
                {basket[product.id] === 1 ? <MdDelete className="h-4 w-4" /> : <MdRemove className="h-4 w-4" />}
              </button>
              <span className="flex h-6 w-6 items-center justify-center border bg-gray-100 text-xs font-bold">
                {basket[product.id]}
              </span>
              <button
                className="flex h-6 w-6 items-center justify-center border bg-gray-100"
                onClick={() => addProduct(product.id, 1)}
              >
                <MdAdd className="h-4 w-4" />
              </button>
            </div>
            <div className="inline-flex items-center gap-x-1">
            
              <span className="flex h-6 items-center justify-center border bg-gray-200 px-2 text-sm font-bold text-black">
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

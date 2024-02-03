import { Button } from "@/components/ui/button";
import { useBasket } from "@/hooks/useBasket";
import { ExtendedProduct } from "@/types/product";
import Image from "next/image";

interface CardProps {
  product: ExtendedProduct;
  index: number;
}
export const ProductCard = (cardProps: CardProps) => {
  const { product, index } = cardProps;

  const { addProduct } = useBasket();
  return (
    <div className="h-fit border border-black">
      <div className="relative h-52 w-full border-black">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={800}
          className="h-full w-full shrink-0 object-cover"
        />
        <div className="absolute bottom-3 left-3 inline-flex items-center bg-orange-400 text-white">
          <span className="text-m m-1 font-extrabold">#{index}</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 border-t border-black px-4 pt-4">
        <h3 className="text-lg font-bold">{product.name}</h3>
      </div>
      <div className="inline-flex w-full items-center justify-between p-4 transition-all duration-200 ease-in-out md:gap-16 xl:gap-32">
        <span className=" font-bold text-gray-500">Quantité: {product.stock_quantity}</span>
        <Button variant="link" className="w-fit p-0" onClick={() => addProduct(product.id, 1)}>
          Réapprovisionner {"->"}
        </Button>
      </div>
    </div>
  );
};

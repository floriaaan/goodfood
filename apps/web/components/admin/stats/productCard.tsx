import { Button } from "@/components/ui/button";
import { ExtendedProduct } from "@/types/product";
import Image from "next/image";

interface CardProps {
  product: ExtendedProduct;
  index: number;
}
export const ProductCard = (cardProps: CardProps) => {
  const { product, index } = cardProps;

  return (
    <div className="flex flex-col border ">
      <div className="relative h-48 w-full ">
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
      <div className="flex flex-col gap-y-1 p-4">
        <h3 className=" font-bold">{product.name}</h3>
        <div className="inline-flex w-full items-center justify-between text-sm">
          <span className="font-bold text-gray-500">Quantité: {product.stock_quantity}</span>
          <Button variant="link" className="w-fit p-0" onClick={() => {}}>
            Réapprovisionner {"->"}
          </Button>
        </div>
      </div>
    </div>
  );
};

import { BasketExtra } from "@/components/basket/extra";
import { ProductBasketItem } from "@/components/basket/product";
import { BasketPromotion } from "@/components/basket/promotion";
import { BasketTaxes } from "@/components/basket/taxes";
import { Button } from "@/components/ui/button";
import { GradientHeader } from "@/components/ui/header/gradient";
import { productList } from "@/constants/data";
import Image from "next/image";
import { MdArrowForward, MdOutlineShoppingBasket } from "react-icons/md";

export const BasketWrapper = () => {
  return (
    <div className="flex flex-col border h-fit border-gray-200 p-1 sticky top-2">
      <section>
        <GradientHeader color="bg-gf-orange/50" wrapperClassName="h-16" className="justify-between px-4 uppercase">
          <div className="inline-flex items-center gap-3">
            <MdOutlineShoppingBasket className="h-8 w-8" />
            <span className="text-2xl font-bold">Panier</span>
          </div>
          {/* <div className="text-gf-orange-900 bg-gf-orange/40 px-2 py-1 font-extrabold">25€50</div> */}
        </GradientHeader>
        <div className="relative w-full">
          <Image
            src="/images/gradient.png"
            alt="Gradient"
            width={512}
            height={48}
            className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
          />
          <div className="relative flex flex-col gap-y-2 bg-gf-orange/20 p-1">
            {productList.map((product) => (
              <ProductBasketItem {...product} />
            ))}
          </div>
        </div>
      </section>
      <hr className="mx-4 my-2 border border-gray-200" />
      <BasketExtra />
      <BasketPromotion />
      <BasketTaxes />
      <GradientHeader color="bg-gf-green-100/50" wrapperClassName="h-16" className="justify-between px-4 uppercase">
        <div className="inline-flex items-center gap-3">
          <MdOutlineShoppingBasket className="h-8 w-8" />
          <span className="text-2xl font-bold">Total</span>
        </div>
        <div className="text-gf-green-600 bg-gf-green-200/60 px-2 py-1 font-extrabold">25€50</div>
      </GradientHeader>
      <div className="mt-2 w-full">
        <Button type="solid" className="bg-black ring-black text-white">
          Étape suivante
          <MdArrowForward className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

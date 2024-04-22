"use client";
import { BasketTaxes } from "@/components/basket/taxes";
import { GradientHeader } from "@/components/ui/header/gradient";
import { useBasket } from "@/hooks";
import { DeliveryType } from "@/types/order";
import { Address } from "@/types/restaurant";
import { MdDirectionsWalk, MdOutlineShoppingBasket, MdShoppingBasket } from "react-icons/md";

export const CheckoutRecap = ({ deliveryType, address }: { deliveryType: string; address: Address }) => {
  const { total, eta, basket, products } = useBasket();
  const { street, city, zipcode } = address || {};

  const address_displayed = `${street}, ${zipcode || ""} ${city || ""}`;

  return (
    <div id="SidebarRoot" className="flex w-full flex-col justify-end gap-1 border border-solid border-gray-100">
      <div className="flex flex-col items-start gap-6 p-4">
        <div className="text-xl font-bold">Récapitulatif</div>
        <div className="flex w-full flex-col items-start gap-3 ">
          <div className="inline-flex items-start gap-1">
            <MdDirectionsWalk className="mt-px w-4 shrink-0" />
            <div className="flex w-full flex-col items-start">
              <div className="text-sm font-semibold">
                {deliveryType === DeliveryType.DELIVERY.toString()
                  ? "Je fais livrer ma commande"
                  : "Je vais chercher ma commande en restaurant"}
              </div>
              <div className="text-xs">
                {address_displayed}
                {deliveryType === DeliveryType.DELIVERY.toString() && ` à ${eta}`}
              </div>
            </div>
          </div>
          <div className="inline-flex items-start gap-1">
            <MdShoppingBasket className="mt-px w-4 shrink-0" />
            <div className="text-sm font-semibold">Je paye à la validation du panier</div>
          </div>
        </div>
      </div>
      <hr id="Seperator" className="mx-4 border-gray-100" />
      <div className="flex flex-col gap-6 p-4">
        <div className="inline-flex items-start justify-between">
          <div className="mb-5 flex h-fit w-full flex-col justify-between gap-3">
            <div className="text-xl font-bold">Détails de la commande</div>
            {basket.productsList.map(({ id, quantity }) => {
              const product = products.find((p) => p.id === id);
              if (!product || !quantity) return null;
              return (
                <div key={id} className="inline-flex justify-between">
                  <div className="inline-flex items-start gap-2">
                    <div className="text-sm">{quantity}x</div>
                    <div className="text-sm font-semibold">{product.name}</div>
                  </div>
                  <div className="text-sm">{(product.price * quantity).toFixed(2).replace(".", "€")}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-1">
        <BasketTaxes />
        <GradientHeader color="bg-gf-green-100/80" wrapperClassName="h-16" className="justify-between px-4 uppercase">
          <div className="inline-flex items-center gap-3">
            <MdOutlineShoppingBasket className="h-8 w-8" />
            <span className="text-2xl font-bold">Total</span>
          </div>
          <div className="bg-gf-green-200/80 px-2 py-1 font-extrabold text-gf-green-600">{total}</div>
        </GradientHeader>
      </div>
    </div>
  );
};

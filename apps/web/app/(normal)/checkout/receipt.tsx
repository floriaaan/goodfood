import { fetchAPI } from "@/lib/fetchAPI";
import { toPrice } from "@/lib/product/toPrice";
import { BasketSnapshot, DeliveryType, Order } from "@/types/order";
import { Product } from "@/types/product";
import { Restaurant } from "@/types/restaurant";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { useEffect, useState } from "react";

export const CheckoutReceipt = (order: Order) => {
  const [productList, setProductList] = useState<{ product: Product; quantity: number }[]>([]);
  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: ["restaurant", order.restaurantId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/restaurant/${order.restaurantId}`, undefined);
      const body = await res.json();
      return body;
    },
  });

  const getProduct = async (id: string): Promise<Product> => {
    const res = await fetchAPI(`/api/product/${id}`, undefined);
    return await res.json();
  };

  const basket: BasketSnapshot = JSON.parse(order.basketSnapshot.string);
  useEffect(() => {
    (async () => {
      const productsList = await Promise.all(
        basket.productsList.map(async ({ id, quantity }) => {
          const product = await getProduct(id);
          return { product, quantity };
        }),
      );
      setProductList(productsList);
    })();
  }, [basket.productsList]);

  if (!restaurant) return null;
  return (
    <div className="flex w-96 flex-col bg-[url(/images/wrinkled-paper.jpg)] bg-center p-5 font-mono text-sm uppercase">
      <h2 className="my-5 bg-black bg-opacity-70 p-2 text-center text-5xl font-bold tracking-tighter text-white">
        GF-
        {restaurant.name
          .split(" ")
          .map((s) => s[0].toUpperCase())
          .join("")}
        -{order.id.slice(-4)}
      </h2>

      <p className="m-0">
        COMMANDE #{order.id.slice(-6)} DE {`${order.payment.user.name}`}
      </p>
      <p className="m-0">
        {format(new Date(order.delivery.eta.toString()), "eeee d MMMM yyyy à HH:mm", { locale: fr })}
      </p>
      <div className="my-4 flex h-full w-full grow flex-col border-0 text-xs">
        <div className="my-0.5 inline-flex w-full gap-x-2.5 border-y border-dashed border-black ">
          <span className="w-8">QTY</span>
          <span className="grow">ITEM</span>
          <span className="w-12 text-right">AMT</span>
        </div>
        <div className="flex grow flex-col overflow-y-auto">
          {productList.map(({ product, quantity }) => (
            <div key={product.id} className="inline-flex items-center gap-x-2.5">
              <span className="w-8">{quantity}</span>
              <span className="grow">{product.name}</span>
              <span className="w-12 text-right">{toPrice(product.price * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex grow flex-col overflow-y-auto">
          <div className="inline-flex items-center gap-x-2.5">
            <span className="w-8"></span>
            <span className="grow">Frais</span>
            <span className="w-12 text-right">{toPrice(0.5)}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="inline-flex items-center justify-between gap-x-2.5 border-t border-dashed border-black">
            <span className="begin">NOMBRE DE PRODUIT:</span>
            <span className="length">{basket.productsList.reduce((acc, cur) => acc + cur.quantity, 0)}</span>
          </div>
          <div className="inline-flex items-center justify-between gap-x-2.5 border-b border-dashed border-black">
            <span className="begin">TOTAL:</span>
            <span className="length">{toPrice(order.payment.total)}</span>
          </div>
        </div>
      </div>

      <p className="">
        MODE DE PAIEMENT:{" "}
        {order.deliveryType.toString() === DeliveryType.DELIVERY.toString() ? "par carte" : "sur place"}
      </p>
      <p className="">RESTAURANT: {restaurant.name}</p>
      <u className="text-xs">{`${restaurant.address.street} ${restaurant.address.zipcode} ${restaurant.address.city}`}</u>
    </div>
  );
};

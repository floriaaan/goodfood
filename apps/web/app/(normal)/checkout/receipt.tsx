import { productList, restaurantList } from "@/constants/data";
import { toPrice } from "@/lib/product/toPrice";
import { Order } from "@/types/order";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

export const CheckoutReceipt = (order: Order) => {
  const restaurant = restaurantList.find((r) => r.id === order.restaurant_id);
  if (!restaurant) return null;

  const basket = order.basket_snapshot.json ?? JSON.parse(order.basket_snapshot.string);

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
        COMMANDE #{order.id.slice(-6)} DE {`${order.user.first_name} ${order.user.last_name}`}
      </p>
      {/* todo: change date */}
      <p className="m-0">{format(new Date(order.created_at.toString()), "eeee d MMMM yyyy à HH:mm", { locale: fr })}</p>
      <div className="my-4 flex h-full w-full grow flex-col border-0 text-xs">
        <div className="my-0.5 inline-flex w-full gap-x-2.5 border-y border-dashed border-black ">
          <span className="w-8">QTY</span>
          <span className="grow">ITEM</span>
          <span className="w-12 text-right">AMT</span>
        </div>
        <div className="flex grow flex-col overflow-y-auto">
          {Object.entries(basket).map(([key, value]) => {
            const product = productList.find((p) => p.id === key);
            const { count, price } = value as { count: number; price: number };
            if (!product || !count || !price) return null;

            return (
              <div key={key} className="inline-flex items-center gap-x-2.5">
                <span className="w-8">{count}</span>
                <span className="grow">{product.name}</span>
                <span className="w-12 text-right">{toPrice(price * count)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col">
          <div className="inline-flex items-center justify-between gap-x-2.5 border-t border-dashed border-black">
            <span className="begin">NOMBRE DE PRODUIT:</span>
            <span className="length">
              {Object.entries(basket).reduce((acc, cur) => {
                const { count } = cur[1] as { count: number };
                return acc + count;
              }, 0)}
            </span>
          </div>
          <div className="inline-flex items-center justify-between gap-x-2.5 border-b border-dashed border-black">
            <span className="begin">TOTAL:</span>
            <span className="length">
              {toPrice(
                Object.entries(basket).reduce((acc, cur) => {
                  const { count, price } = cur[1] as { count: number; price: number };
                  return acc + count * price;
                }, 0),
              )}
            </span>
          </div>
        </div>
      </div>

      <p className="">MODE DE PAIEMENT: sur place</p>
      <p className="">RESTAURANT: {restaurant.name}</p>
      <u className="text-xs">{restaurant.address}</u>
    </div>
  );
};

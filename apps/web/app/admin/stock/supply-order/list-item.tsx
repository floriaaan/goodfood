import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { toPrice } from "@/lib/product/toPrice";
import { toName } from "@/lib/user";
import { SupplyOrder } from "@/types/stock";
import { MousePointerClickIcon } from "lucide-react";

export const SupplyOrderListItem = ({ supply_order: so }: { supply_order: SupplyOrder }) => {
  const { restaurants, users } = useAdmin();
  // TODO: avoid mocking the user
  const restaurant = restaurants.find((r) => r.id === so.ingredientRestaurant.restaurantId);
  if (!restaurant) return null;
  const restaurant_users = users.filter((u) => restaurant.useridsList.includes(u.id));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={so.id}
          className="relative flex cursor-pointer flex-col gap-0.5 border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs hover:bg-neutral-100"
        >
          <div className="inline-flex items-center justify-between gap-x-1">
            <span className="text-sm font-bold first-letter:uppercase">{so.ingredientRestaurant.ingredient.name}</span>
            <span>{new Date(so.createdAt.toString()).toLocaleString()}</span>
          </div>
          <span>
            <span className="font-semibold text-green-600">+{so.quantity}</span> ({toPrice(so.quantity * so.unitPrice)})
          </span>
          <div className="absolute bottom-1 right-2">
            <MousePointerClickIcon className="h-4 w-4" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commande fournisseur #{so.id}</DialogTitle>
          <DialogDescription className="flex flex-col gap-0.5">
            <div className="inline-flex items-center gap-1">
              <span>{so.supplier.name}</span>
              &middot;
              <span>{so.supplier.contact}</span>
            </div>
            <span>
              commande passée le {new Date(so.createdAt.toString()).toLocaleString()} par {toName(restaurant_users[0])}
            </span>
          </DialogDescription>
          <hr className="my-2" />
          <div className="my-4 flex h-full w-full grow flex-col border-0 font-mono text-xs">
            <div className="my-0.5 inline-flex w-full gap-x-2.5 border-y border-dashed border-black ">
              <span className="w-8">QTY</span>
              <span className="w-12 text-right">{"UNITÉ"}</span>
              <span className="grow">INGRÉDIENT</span>
              <span className="w-12 text-right">TOTAL</span>
            </div>
            <div className="flex grow flex-col overflow-y-auto">
              {[so].map((so) => (
                <div key={so.id} className="inline-flex items-center gap-x-2.5">
                  <span className="w-8">{so.quantity}</span>
                  <span className="w-12 text-right">{toPrice(so.ingredientRestaurant.unitPrice)}</span>
                  <span className="grow">{so.ingredientRestaurant.ingredient.name}</span>
                  <span className="w-12 text-right">{toPrice(so.ingredientRestaurant.unitPrice * so.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

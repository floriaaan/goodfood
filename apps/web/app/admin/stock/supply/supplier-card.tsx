import { SupplyOrderListItem } from "@/app/admin/stock/supply-order/list-item";
import { Supplier, SupplyOrder } from "@/types/stock";

export const SupplierCard = ({ supplier, supply_orders }: { supplier: Supplier; supply_orders: SupplyOrder[] }) => {
  return (
    <div className="h-64 w-80 overflow-hidden border p-4">
      <div className="flex flex-col gap-0.5 text-sm">
        <span className="mb-0.5 text-[10px] uppercase">Fournisseur</span>
        <span className="font-bold">{supplier.name}</span>
        <span className="text-xs">{supplier.contact}</span>
      </div>
      <hr className="my-2" />
      <div className="flex flex-col gap-0.5 text-sm">
        <span className="mb-0.5 text-[10px] uppercase">Commandes</span>
        <div className="flex flex-col gap-1">
          {supply_orders.length > 0 ? (
            supply_orders.map((so) => <SupplyOrderListItem key={so.id} supply_order={so} />)
          ) : (
            <span className="text-xs text-neutral-500">
              {"Aucune commande n'a été passée pour le moment pour ce restaurant."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

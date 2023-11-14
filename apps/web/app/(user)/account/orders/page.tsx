import { orders_columns } from "@/app/(user)/account/orders/columns";
import { DataTable } from "@/components/ui/data-table";
import { orderList } from "@/constants/data";

export default function UserOrders() {
  return (
    <>
      <h2 className="text-xl font-semibold">Commandes passées</h2>
      <DataTable columns={orders_columns} data={orderList} />
    </>
  );
}

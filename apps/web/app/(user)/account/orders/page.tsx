import { orders_columns } from "@/app/(user)/account/orders/columns";
import { DataTable } from "@/components/ui/data-table";
import { orderList } from "@/constants/data";

export default async function UserOrders() {
  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  // const revalidatedData = await fetch(`https://...`, {
  //   next: { revalidate: 10 },
  // }).then((res) => res.json());
  const orders = await Promise.resolve(orderList);

  return (
    <>
      <h2 className="text-xl font-semibold">Commandes passées</h2>
      <DataTable columns={orders_columns} data={orders} />
    </>
  );
}

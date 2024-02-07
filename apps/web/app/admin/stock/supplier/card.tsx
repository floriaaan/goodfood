"use client";
import { SupplierSheetContent } from "@/app/admin/stock/supplier/sheet-content";
import { SupplyOrderDialogContent } from "@/app/admin/stock/supply-order/dialog-content";
import { SupplyOrderListItem } from "@/app/admin/stock/supply-order/list-item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAdmin } from "@/hooks/useAdmin";
import { Supplier, SupplyOrder } from "@/types/stock";
import { Pencil, TicketIcon } from "lucide-react";
import { useState } from "react";

export const SupplierCard = ({ supplier, supply_orders }: { supplier: Supplier; supply_orders: SupplyOrder[] }) => {
  const { isSupplyOrdersLoading } = useAdmin();

  const [supplierSheetOpen, setSupplierSheetOpen] = useState(false);
  const [supplyOrderSheetOpen, setSupplyOrderSheetOpen] = useState(false);
  return (
    <>
      <div className="h-80 w-80 overflow-hidden border px-3 pt-2">
        <div className="inline-flex w-full items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 text-sm">
            <span className="-mb-1 text-[10px] uppercase">Fournisseur</span>
            <span className="line-clamp-1 font-bold">{supplier.name}</span>
            <span className="text-xs">{supplier.contact}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-sm">
            <Sheet
              {...{
                isOpen: supplierSheetOpen,
                onOpenChange: setSupplierSheetOpen,
              }}
            >
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-x-1 px-1 py-0.5 text-xs">
                  <Pencil className="h-3 w-3" />
                  Modifier
                </Button>
              </SheetTrigger>
              <SupplierSheetContent supplier={supplier} closeSheet={() => setSupplierSheetOpen(false)} />
            </Sheet>
            <Dialog
              {...{
                isOpen: supplyOrderSheetOpen,
                onOpenChange: setSupplyOrderSheetOpen,
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-x-1 px-1 py-0.5 text-xs">
                  <TicketIcon className="h-3 w-3" />
                  Commander
                </Button>
              </DialogTrigger>
              <SupplyOrderDialogContent supplier={supplier} closeSheet={() => setSupplyOrderSheetOpen(false)} />
            </Dialog>
          </div>
        </div>

        <hr className="my-2" />
        <div className="flex h-52 flex-col gap-0.5 text-sm">
          <span className="mb-0.5 text-[10px] uppercase">Commandes</span>
          <div className="flex h-full grow flex-col gap-1 overflow-y-scroll">
            {supply_orders.length > 0 ? (
              supply_orders
                .sort((a, b) => new Date(b.createdAt.toString()).getTime() - new Date(a.createdAt.toString()).getTime())
                .map((so) => <SupplyOrderListItem key={so.id} supply_order={so} />)
            ) : isSupplyOrdersLoading ? (
              <span className="text-xs text-neutral-500">Chargement des commandes...</span>
            ) : (
              <span className="text-xs text-neutral-500">
                {"Aucune commande n'a été passée pour le moment pour ce fournisseur."}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

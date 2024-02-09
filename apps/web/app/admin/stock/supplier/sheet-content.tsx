import { SupplierCreateEditForm, SupplierCreateEditFormValues } from "@/app/admin/stock/supplier/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { Supplier } from "@/types/stock";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const SupplierSheetContent = ({ supplier: s, closeSheet }: { supplier?: Supplier; closeSheet: () => void }) => {
  const { session } = useAuth();
  const { refetchSuppliers, refetchSupplyOrders } = useAdmin();
  if (!session) return null;

  const create = async (values: SupplierCreateEditFormValues) => {
    const res = await fetchAPI(`/api/stock/supplier`, session.token, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création du fournisseur");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>{"Le fournisseur a été créé avec succès"}</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const update = async (values: SupplierCreateEditFormValues) => {
    const res = await fetchAPI(`/api/stock/supplier/${s?.id}`, session.token, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la mise à jour du fournisseur");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>{"Le fournisseur a été mise à jour avec succès"}</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const onSubmit = async (values: SupplierCreateEditFormValues) => {
    try {
      if (s?.id) await update(values);
      else await create(values);
      refetchSuppliers();
      refetchSupplyOrders();
      closeSheet();
    } catch (err) {
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <XIcon className="h-6 w-6 text-red-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>{(err as Error).message ?? "Une erreur est survenue."}</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
      <div className="flex h-full w-full">
        <SupplierCreateEditForm {...{ onSubmit, initialValues: s, id: s?.id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

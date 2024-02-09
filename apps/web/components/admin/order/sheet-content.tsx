import { OrderCreateEditForm, OrderCreateEditFormValues } from "@/components/admin/order/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { Order } from "@/types/order";
import { ToastTitle } from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const OrderFormSheetContent = ({
  initialValues,
  id,
}: {
  initialValues?: OrderCreateEditFormValues;
  id?: Order["id"];
}) => {
  const { session } = useAuth();
  const { refetchOrders } = useAdmin();
  if (!session) return null;
  const onSubmit = async (values: OrderCreateEditFormValues) => {
    // eslint-disable-next-line no-console
    if (id) {
      const res = await fetchAPI(`/api/order/${id}`, session.token, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      refetchOrders();
      if (!res.ok)
        return toast({
          className: "p-3",
          children: (
            <div className="inline-flex w-full items-end justify-between gap-2">
              <div className="inline-flex shrink-0 gap-2">
                <XIcon className="h-6 w-6 text-red-500" />
                <div className="flex w-full grow flex-col">
                  <ToastTitle>Erreur lors de la mise à jour de la order</ToastTitle>
                </div>
              </div>
            </div>
          ),
        });
      return toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdDone className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>La order a été mise à jour avec succès</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    } else {
      const res = await fetchAPI("/api/order", session.token, {
        method: "POST",
        body: JSON.stringify(values),
      });
      refetchOrders();
      if (!res.ok)
        return toast({
          className: "p-3",
          children: (
            <div className="inline-flex w-full items-end justify-between gap-2">
              <div className="inline-flex shrink-0 gap-2">
                <XIcon className="h-6 w-6 text-red-500" />
                <div className="flex w-full grow flex-col">
                  <ToastTitle>Erreur lors de la création de la order</ToastTitle>
                </div>
              </div>
            </div>
          ),
        });
      return toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdDone className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>La order a été créée avec succès</ToastTitle>
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
        <OrderCreateEditForm {...{ onSubmit, initialValues, id }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

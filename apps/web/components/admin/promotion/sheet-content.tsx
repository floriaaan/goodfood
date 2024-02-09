import { PromotionCreateEditForm, PromotionCreateEditFormValues } from "@/components/admin/promotion/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { Promotion } from "@/types/promotion";
import { ToastTitle } from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const PromotionFormSheetContent = ({
  initialValues,
  id,
  closeSheet,
}: {
  initialValues?: PromotionCreateEditFormValues;
  id?: Promotion["id"];
  closeSheet: () => void;
}) => {
  const { session } = useAuth();
  const { refetchPromotions } = useAdmin();
  if (!session) return null;

  const update = async (values: PromotionCreateEditFormValues) => {
    const res = await fetchAPI(`/api/promotion/${id}`, session.token, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la mise à jour de la promotion");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>La promotion a été mise à jour avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const create = async (values: PromotionCreateEditFormValues) => {
    const res = await fetchAPI("/api/promotion", session.token, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création de la promotion");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>La promotion a été créée avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const onSubmit = async (values: PromotionCreateEditFormValues) => {
    try {
      if (id) update(values);
      else create(values);
      refetchPromotions();
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
        <PromotionCreateEditForm {...{ onSubmit, initialValues, id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

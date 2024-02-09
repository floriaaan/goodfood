import { IngredientCreateEditForm, IngredientCreateEditFormValues } from "@/app/admin/stock/product/ingredient/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { Ingredient } from "@/types/stock";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const IngredientSheetContent = ({
  ingredient,
  closeSheet,
}: {
  ingredient?: Ingredient;
  closeSheet: () => void;
}) => {
  const { session } = useAuth();
  const { refetchIngredients } = useAdmin();
  if (!session) return null;

  const create = async (values: IngredientCreateEditFormValues) => {
    const res = await fetchAPI(`/api/stock/ingredient`, session.token, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création de l'ingrédient");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>{"L'ingrédient a été créé avec succès"}</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const onSubmit = async (values: IngredientCreateEditFormValues) => {
    try {
      // if (id) update(values);
      // else
      await create(values);
      refetchIngredients();
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
        <IngredientCreateEditForm {...{ onSubmit, initialValues: ingredient, id: ingredient?.id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

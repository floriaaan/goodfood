import {
  IngredientRestaurantCreateEditForm,
  IngredientRestaurantCreateEditFormValues,
} from "@/app/admin/stock/product/ingredient-restaurant/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { IngredientRestaurant } from "@/types/stock";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const IngredientRestaurantSheetContent = ({
  ingredientRestaurant: ir,
  closeSheet,
}: {
  ingredientRestaurant?: IngredientRestaurant;
  closeSheet: () => void;
}) => {
  const { session } = useAuth();
  const { refetchIngredientRestaurant } = useAdmin();
  if (!session) return null;

  const create = async (values: IngredientRestaurantCreateEditFormValues) => {
    const res = await fetchAPI(`/api/stock/ingredient/restaurant`, session.token, {
      method: "POST",
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création de la liason ingrédient/restaurant");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>{"La liaison ingrédient/restaurant a été créé avec succès"}</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const update = async (values: IngredientRestaurantCreateEditFormValues) => {
    const res = await fetchAPI(`/api/stock/ingredient/restaurant/${ir?.id}`, session.token, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (!res.ok)
      throw new Error("Une erreur s'est produite lors de la mise à jour de la liaison ingrédient/restaurant");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>{"La liaison ingrédient/restaurant a été mise à jour avec succès"}</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const onSubmit = async (values: IngredientRestaurantCreateEditFormValues) => {
    try {
      if (ir?.id) await update(values);
      else await create(values);
      refetchIngredientRestaurant();
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
        <IngredientRestaurantCreateEditForm
          {...{
            onSubmit,
            initialValues: ir || undefined,
            id: ir?.id,
            closeSheet,
          }}
        />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

import {
    IngredientRestaurantCreateEditForm,
    IngredientRestaurantCreateEditFormValues,
} from "@/app/admin/stock/product/ingredient/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { IngredientRestaurant } from "@/types/stock";

export const IngredientRestaurantSheetContent = ({
  ingredientRestaurant: ir,
  closeSheet,
}: {
  ingredientRestaurant: IngredientRestaurant;
  closeSheet: () => void;
}) => {
  if (!ir) return null;
  const onSubmit = (values: IngredientRestaurantCreateEditFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };
  const initialValues = ir;
  const id = ir.id;

  return (
    <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
      <div className="flex h-full w-full">
        <IngredientRestaurantCreateEditForm {...{ onSubmit, initialValues, id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

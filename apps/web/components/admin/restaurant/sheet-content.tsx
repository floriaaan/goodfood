import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { Restaurant } from "@/types/restaurant";
import { RestaurantCreateEditForm, RestaurantCreateEditFormValues} from "@/components/admin/restaurant/form";

export const RestaurantFormSheetContent = ({
                                            initialValues,
                                            id,
                                        }: {
    initialValues?: RestaurantCreateEditFormValues;
    id?: Restaurant["id"];
}) => {
    const onSubmit = (values: RestaurantCreateEditFormValues) => {
        // eslint-disable-next-line no-console
        console.log(values);
    };

    return (
        <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
            <div className="flex h-full w-full">
                <RestaurantCreateEditForm {...{ onSubmit, initialValues, id }} />
            </div>
            <SheetClose />
        </SheetContent>
    );
};

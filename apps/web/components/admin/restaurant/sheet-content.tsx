import { RestaurantCreateEditForm, RestaurantCreateEditFormValues } from "@/components/admin/restaurant/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { toRestaurant, toUpdateRestaurant } from "@/lib/restaurant/toRestaurant";
import { Restaurant } from "@/types/restaurant";
import { ToastTitle } from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const RestaurantFormSheetContent = ({
  initialValues,
  id,
  closeSheet,
}: {
  initialValues?: RestaurantCreateEditFormValues;
  id?: Restaurant["id"];
  closeSheet: () => void;
}) => {
  const { refetchRestaurants } = useAdmin();
  const { session, isAuthenticated } = useAuth();

  const createRestaurant = async (restaurantInput: Restaurant) => {
    if (!restaurantInput || !isAuthenticated) return;

    const res = await fetchAPI("/api/restaurant", session?.token, {
      method: "POST",
      body: JSON.stringify(restaurantInput),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la création du restaurant");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>Le restaurant a été créé avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const updateRestaurant = async (restaurantInput: Restaurant) => {
    if (!restaurantInput || !restaurantInput.id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/restaurant/${restaurantInput.id}`, session?.token, {
      method: "PUT",
      body: JSON.stringify(restaurantInput),
    });
    if (!res.ok) throw new Error("Une erreur s'est produite lors de la mise à jour du restaurant");
    return toast({
      className: "p-3",
      children: (
        <div className="inline-flex w-full items-end justify-between gap-2">
          <div className="inline-flex shrink-0 gap-2">
            <MdDone className="h-6 w-6 text-green-500" />
            <div className="flex w-full grow flex-col">
              <ToastTitle>Le restaurant a été mis à jour avec succès</ToastTitle>
            </div>
          </div>
        </div>
      ),
    });
  };

  const getRestaurant = async (id: string) => {
    if (!id || !isAuthenticated) return;

    const res = await fetchAPI(`/api/restaurant/${id}`, session?.token);
    return (await res.json()) as Promise<Restaurant>;
  };

  const onSubmit = async (values: RestaurantCreateEditFormValues) => {
    try {
      if (!id) createRestaurant(toRestaurant(values));
      else {
        const restaurant = await getRestaurant(id as string);
        if (restaurant) updateRestaurant(toUpdateRestaurant(restaurant, values));
        else throw new Error("Restaurant not found");
      }
      refetchRestaurants();
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
        <RestaurantCreateEditForm {...{ onSubmit, initialValues, id, closeSheet }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

import { UserCreateEditForm, UserCreateEditFormValues } from "@/components/admin/user/form";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { toName } from "@/lib/user";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const UserFormSheetContent = ({ closeSheet }: { closeSheet: () => void }) => {
  const { session } = useAuth();
  const { refetchRestaurantUsers, refetchRestaurants, restaurant, users } = useAdmin();
  if (!session) return null;
  if (!restaurant) return null;

  const onSubmit = async (values: UserCreateEditFormValues) => {
    try {
      if (restaurant.id !== values.restaurantId) throw new Error("Le restaurant ne correspond pas");
      if (restaurant.useridsList.includes(values.id)) throw new Error("L'utilisateur est déjà dans le restaurant");

      const res = await fetchAPI(`/api/restaurant/${values.restaurantId}`, session.token, {
        method: "PUT",
        body: JSON.stringify({
          ...restaurant,
          openingHoursList: restaurant.openinghoursList, // todo: fix typo
          userIds: [...restaurant.useridsList, values.id],
        }),
      });
      if (!res.ok) throw new Error("Une erreur s'est produite lors de la mise à jour du restaurant");

      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdDone className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>{"L'utilisateur a été ajouté avec succès"}</ToastTitle>
                <small>
                  <strong>{toName(users.find((u) => u.id === values.id))}</strong> a été habilité au restaurant{" "}
                  <strong>{restaurant.name}</strong>
                </small>
              </div>
            </div>
          </div>
        ),
      });
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
    } finally {
      refetchRestaurants();
      refetchRestaurantUsers();
    }
  };

  return (
    <SheetContent side="right" className="w-full border-l-0 sm:max-w-xl">
      <div className="flex h-full w-full">
        <UserCreateEditForm {...{ onSubmit, restaurantId: restaurant.id }} />
      </div>
      <SheetClose />
    </SheetContent>
  );
};

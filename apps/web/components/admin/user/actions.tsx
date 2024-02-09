"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { toName } from "@/lib/user";
import { User } from "@/types/user";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useState } from "react";
import { MdCopyAll, MdDelete, MdDone } from "react-icons/md";

export const UserActions = (p: User) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { session } = useAuth();
  const { refetchRestaurants, refetchRestaurantUsers, restaurant, users } = useAdmin();
  if (!session) return null;
  if (!restaurant) return null;

  const handleDelete = async () => {
    try {
      if (!restaurant.useridsList.includes(p.id)) throw new Error("L'utilisateur n'est pas dans le restaurant");

      const res = await fetchAPI(`/api/restaurant/${restaurant.id}`, session.token, {
        method: "PUT",
        body: JSON.stringify({
          ...restaurant,
          openingHoursList: restaurant.openinghoursList, // todo: fix typo
          userIds: restaurant.useridsList.filter((id) => id !== p.id),
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
                  <strong>{toName(users.find((u) => u.id === p.id))}</strong> a été supprimé des habilitations du
                  restaurant <strong>{restaurant.name}</strong>
                </small>
              </div>
            </div>
          </div>
        ),
      });
      setDialogOpen(false);
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

    setDialogOpen(false);
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col gap-y-1 p-2">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p.id)}>
            <MdCopyAll className="h-4 w-4 shrink-0" />
            {"Copier l'identifiant utilisateur"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <MdDelete className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette habilitation ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

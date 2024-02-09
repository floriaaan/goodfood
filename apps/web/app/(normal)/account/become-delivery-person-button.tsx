"use client";

import { Button } from "@/components/ui/button";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import { XIcon } from "lucide-react";
import { MdDirectionsWalk, MdDone } from "react-icons/md";

export const BecomeDeliveryPersonButton = () => {
  const { session, user } = useAuth();
  if (!session) return null;
  if (!user) return "Vous devez être connecté pour devenir livreur";

  const handle = async () => {
    try {
      const res = await fetchAPI(`/api/user/${user.id}/role`, session.token, {
        method: "PUT",
        body: JSON.stringify({ role: "DELIVERY_PERSON" }),
      });
      if (!res.ok) throw new Error("Une erreur s'est produite lors du changement de rôle");
      return toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdDone className="h-6 w-6 text-green-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>{"Le rôle a été changé avec succès"}</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <XIcon className="h-6 w-6 text-red-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>
                  {"Une erreur s'est produite lors du changement de rôle. Veuillez réessayer plus tard."}
                </ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Button
        variant="outline"
        disabled={user.role.code === "DELIVERY_PERSON" || user.phone === null || user.mainaddress === null}
        className="w-fit"
        onClick={handle}
      >
        <MdDirectionsWalk className="h-5 w-5" />
        Devenir livreur
      </Button>
      <div className="flex flex-row flex-wrap gap-1">
        {user.role.code !== "DELIVERY_PERSON" && (
          <small>Vous perdrez votre rôle actuel. (rôle actuel: {user.role.label})</small>
        )}
        {user.role.code === "DELIVERY_PERSON" && <small className="text-neutral-500">Vous êtes déjà livreur</small>}
        {user.phone === null && (
          <small className="text-neutral-500">Vous devez renseigner votre numéro de téléphone</small>
        )}
        {user.mainaddress === null && <small className="text-neutral-500">Vous devez renseigner votre adresse</small>}
      </div>
    </div>
  );
};

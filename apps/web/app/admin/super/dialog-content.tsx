import { RoleCreateEditForm, RoleCreateEditFormValues } from "@/app/admin/super/form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { User } from "@/types/user";
import { XIcon } from "lucide-react";
import { MdDone } from "react-icons/md";

export const RoleDialogContent = ({ user }: { user: User }) => {
  const { session } = useAuth();
  const { refetchUsers } = useAdmin();
  if (!session) return null;

  const update = async (values: RoleCreateEditFormValues) => {
    const res = await fetchAPI(`/api/user/${user.id}/role`, session.token, {
      method: "PUT",
      body: JSON.stringify(values),
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
  };

  const onSubmit = async (values: RoleCreateEditFormValues) => {
    try {
      await update(values);
      refetchUsers();
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
    <DialogContent className="px-0 pb-0">
      <DialogHeader className="px-4">
        <DialogTitle>{"Création d'une commande fournisseur"}</DialogTitle>
      </DialogHeader>
      <div className="flex h-full w-full">
        <RoleCreateEditForm {...{ onSubmit, user }} />
      </div>
    </DialogContent>
  );
};

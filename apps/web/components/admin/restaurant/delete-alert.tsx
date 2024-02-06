"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { useAdmin } from "@/hooks/useAdmin";
import { fetchAPI } from "@/lib/fetchAPI";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import {Restaurant} from "@/types/restaurant";

export const RestaurantDeleteAlert = ({ closeSheet, id }: { closeSheet: () => void; id: Restaurant["id"] }) => {
	const [open, setOpen] = useState(false);
	const { session } = useAuth();
	const { refetchRestaurants } = useAdmin();
	if (!session) return null;

	const handleDelete = async () => {
		try {
			const res = await fetchAPI(`/api/restaurant/${id}`, session.token, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Une erreur s'est produite lors de la suppression du restaurant");
			toast({
				className: "p-3",
				children: (
					<div className="inline-flex w-full items-end justify-between gap-2">
						<div className="inline-flex shrink-0 gap-2">
							<MdDelete className="h-6 w-6 text-red-500" />
							<div className="flex w-full grow flex-col">
								<ToastTitle>Le restaurant a été supprimée avec succès</ToastTitle>
							</div>
						</div>
					</div>
				),
			});
			setOpen(false);
			closeSheet();
		} catch (error) {
			toast({
				className: "p-3",
				children: (
					<div className="inline-flex w-full items-end justify-between gap-2">
						<div className="inline-flex shrink-0 gap-2">
							<XIcon className="h-6 w-6 text-red-500" />
							<div className="flex w-full grow flex-col">
								<ToastTitle>{(error as Error).message}</ToastTitle>
							</div>
						</div>
					</div>
				),
			});
		}
	};

	return (
		<>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="outline" type="button">
						<MdDelete className="h-4 w-4" />
						Supprimer
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce restaurant ?</AlertDialogTitle>
						<AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleDelete()}>Continuer</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

"use client";

import {useEffect, useState} from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import {MdCopyAll, MdEdit} from "react-icons/md";
import {Sheet, SheetTrigger} from "@/components/ui/sheet";
import {RestaurantFormSheetContent} from "@/components/admin/restaurant/sheet-content";
import {RestaurantCreateEditFormValues} from "@/components/admin/restaurant/form";
import {Restaurant} from "@/types/restaurant";
import {useAdmin} from "@/hooks/useAdmin";

export const RestaurantActions = (r: Restaurant) => {
	const [open, setOpen] = useState(false);


	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<>
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="flex flex-col gap-y-1 p-2">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(r.id)}>
						<MdCopyAll className="h-4 w-4 shrink-0" />
						{"Copier l'identifiant restaurant"}
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<SheetTrigger className="inline-flex items-center gap-x-1">
							<MdEdit className="h-4 w-4 shrink-0" />
							Modifier/supprimer
						</SheetTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<RestaurantFormSheetContent
				initialValues={{ ...r,
					street: r.address.street,
					city: r.address.city,
					zipcode: r.address.zipcode,
					country: r.address.country,
					latitude: r.address.lat,
					longitude: r.address.lng,
					userIdsList: r.useridsList,
					openingHours: r.openinghoursList[0],
				} as unknown as RestaurantCreateEditFormValues}
				id={r.id}
				closeSheet={() => setOpen(false)}
			/>
		</Sheet>
	);
};
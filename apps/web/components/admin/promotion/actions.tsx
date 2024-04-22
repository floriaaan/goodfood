"use client";

import { PromotionCreateEditFormValues } from "@/components/admin/promotion/form";
import { PromotionFormSheetContent } from "@/components/admin/promotion/sheet-content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Promotion } from "@/types/promotion";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MdCopyAll, MdEdit } from "react-icons/md";

export const PromotionActions = (p: Promotion) => {
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p.id)}>
            <MdCopyAll className="h-4 w-4 shrink-0" />
            {"Copier le code promo"}
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
      <PromotionFormSheetContent
        initialValues={{ ...p } as unknown as PromotionCreateEditFormValues}
        id={p.id}
        closeSheet={() => setOpen(false)}
      />
    </Sheet>
  );
};

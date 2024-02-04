"use client";

import { UserFormSheetContent } from "@/components/admin/user/sheet-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { MdAdd } from "react-icons/md";

export const UserCreateSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit bg-black px-6 text-white">
          <MdAdd className="h-4 w-4 shrink-0" />
          Ajouter un manager
        </Button>
      </SheetTrigger>
      <UserFormSheetContent closeSheet={() => setSheetOpen(false)} />
    </Sheet>
  );
};

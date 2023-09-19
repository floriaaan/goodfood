import { MdMenu } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MenuDropdown = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="gf_shadow flex h-10 w-10 shrink-0 items-center justify-center border border-black">
          <MdMenu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right">
        <MenuSheetContent />
      </SheetContent>
    </Sheet>
  );
};

const MenuSheetContent = () => {
  return <></>;
};

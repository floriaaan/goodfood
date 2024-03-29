import { BasketWrapper } from "@/components/basket";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MdOutlineShoppingBasket } from "react-icons/md";

export const BasketDropdown = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="gf_shadow relative flex h-10 w-10 shrink-0 items-center justify-center border border-black lg:hidden">
          <MdOutlineShoppingBasket className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto flex min-h-[12rem] w-full max-w-xl flex-col gap-y-4 px-3 pb-8 pt-12 2xl:max-w-2xl"
      >
        <BasketWrapper />
      </SheetContent>
    </Sheet>
  );
};

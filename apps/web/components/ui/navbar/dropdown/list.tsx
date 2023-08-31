import { BasketDropdown } from "@/components/ui/navbar/dropdown/basket";
import { LocationDropdown } from "@/components/ui/navbar/dropdown/location";
import { UserDropdown } from "@/components/ui/navbar/dropdown/user";
import classNames from "classnames";

export const DropdownList = ({ className }: { className?: string }) => {
  return (
    <div className={classNames("items-center justify-end gap-x-4 lg:w-64", className)}>
      <LocationDropdown />
      <BasketDropdown />
      <UserDropdown />
    </div>
  );
};

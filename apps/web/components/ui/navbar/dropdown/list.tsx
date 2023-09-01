import { BasketDropdown } from "@/components/ui/navbar/dropdown/basket";
import { LocationDropdown } from "@/components/ui/navbar/dropdown/location";
import { UserDropdown } from "@/components/ui/navbar/dropdown/user";
import { cn } from "@/lib/utils";

export const DropdownList = ({ className }: { className?: string }) => {
  return (
    <div className={cn("items-center justify-end gap-x-4 lg:w-64", className)}>
      <LocationDropdown />
      <BasketDropdown />
      <UserDropdown />
    </div>
  );
};

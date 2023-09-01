import { Logo } from "@/components/ui/Logo";
import { DropdownList } from "@/components/ui/navbar/dropdown/list";
import { MenuDropdown } from "@/components/ui/navbar/dropdown/menu";
import { Location } from "@/components/ui/navbar/location";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="inline-flex w-full items-center justify-between border-b px-8 py-4">
      <Link id="nav-logo" data-testid="nav-logo" className="lg:w-64" href={"/"}>
        <Logo className="h-12" />
      </Link>
      <Location className="hidden lg:inline-flex" />
      <>
        <div className="md:hidden">
          <MenuDropdown />
        </div>
        <DropdownList className="hidden md:inline-flex" />
      </>
    </nav>
  );
};

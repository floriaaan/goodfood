import { Logo } from "@/components/ui/icon/logo";
import { DropdownList } from "@/components/ui/navbar/menu/list";
import { MenuDropdown } from "@/components/ui/navbar/menu";
import Link from "next/link";
import { Suspense } from "react";
import { Location, LocationFullTrigger } from "@/components/location";

export const Navbar = () => {
  return (
    <nav className="inline-flex w-full items-center justify-between bg-white px-8 py-3">
      <Link id="nav-logo" data-testid="nav-logo" className="lg:w-48" href={"/"}>
        <Logo className="h-10 w-fit" />
      </Link>
      <Location trigger={<LocationFullTrigger className="hidden lg:inline-flex" />} />
      <section className="inline-flex items-center gap-x-4">
        <Suspense>
          <DropdownList className="hidden md:inline-flex" />
          <MenuDropdown />
        </Suspense>
      </section>
    </nav>
  );
};

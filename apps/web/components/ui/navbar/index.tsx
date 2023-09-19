import { Logo } from "@/components/ui/logo";
import { DropdownList } from "@/components/ui/navbar/menu/list";
import { MenuDropdown } from "@/components/ui/navbar/menu/menu";
import { Location, Trigger } from "@/components/ui/navbar/location";
import Link from "next/link";
import { Suspense } from "react";

export const Navbar = () => {
  return (
    <nav className="inline-flex w-full items-center justify-between border-b bg-white px-8 py-4">
      <Link id="nav-logo" data-testid="nav-logo" className="lg:w-64" href={"/"}>
        <Logo className="h-12" />
      </Link>
      <Location trigger={<Trigger className="hidden lg:inline-flex" />} />
      <section className="inline-flex items-center gap-x-4">
        <Suspense>
          <DropdownList className="hidden md:inline-flex" />
          <MenuDropdown />
        </Suspense>
      </section>
    </nav>
  );
};

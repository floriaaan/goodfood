import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/icon/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

export const AuthNavbar = () => {
  const { back } = useRouter();
  return (
    <nav className="inline-flex w-full items-center justify-between border-b bg-white px-8 py-4">
      <Button
        onClick={back}
        className="gf_shadow flex h-10 w-10 shrink-0 items-center justify-center border border-black"
      >
        <MdArrowBack className="h-5 w-5 shrink-0" />
      </Button>
      <Link id="nav-logo" data-testid="nav-logo" className="lg:w-48" href={"/"}>
        <Logo className="h-10 w-fit" />
      </Link>
      <span className="w-11"></span>
    </nav>
  );
};

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Select } from "@/components/ui/select";
import { MdKeyboardBackspace } from "react-icons/md";

export const Sidebar = () =>{

    return (
        <div className="w-1/4 h-screen flex flex-col p-6 items-center">
            <div>
            <Link id="nav-logo" data-testid="nav-logo" className="h-auto mx-6" href={"/"}>
            <Logo className="h-10 w-fit" />
            </Link>
            <Link href="/" className="flex items-center justify-center  text-gray-600 text-sm font-semibold">
                <MdKeyboardBackspace/>&nbsp;Retour au catalogue
            </Link>
        </div>
      <Select/>
        <div className="flex ">
            <Link href="/">Visualisation des données</Link>
            <Link href="/"> </Link>
            <Link href="/"> </Link>
        </div>
        </div>
    )
}
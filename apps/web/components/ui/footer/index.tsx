import { Logo } from "@/components/ui/icon/logo";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="has-background-rectangle h-4"></div>
      <div className="flex flex-col gap-8 bg-black p-10 text-white">
        <div className="inline-flex items-center justify-between">
          <Logo display="logo" color="text-white" className="h-10 w-auto" />
          <div className="flex items-center gap-6 text-white">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopenner">
              <FaFacebook size={16} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopenner">
              <FaTwitter size={16} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopenner">
              <FaInstagram size={16} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopenner">
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>
        <hr className="border-white" />
        <span className="mx-auto text-lg font-semibold">©{new Date().getFullYear()} GoodFood</span>
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center md:divide-x text-sm font-semibold">
          <Link className="pl-2" href="/about">À propos</Link>
          <Link className="pl-2" href="/contact">Contact</Link>
          <Link className="pl-2" href="/terms">Conditions d'utilisation</Link>
          <Link className="pl-2" href="/privacy">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  );
};

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
        <hr className="border-gray-800" />
        <span className="font-ultrabold mx-auto text-lg">©{new Date().getFullYear()} GoodFood</span>
        <div className="flex flex-col items-center justify-center gap-2 divide-gray-800 text-sm font-semibold md:flex-row md:divide-x">
          <Link className="pl-2" href="/about">
            À propos
          </Link>
          <Link className="pl-2" href="/contact">
            Contact
          </Link>
          <Link className="pl-2" href="/terms">
            {"Conditions d'utilisation"}
          </Link>
          <Link className="pl-2" href="/privacy">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
};

import { LoginForm } from "@/app/auth/login/form";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/icon/logo";
import Link from "next/link";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Login() {
  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <Link href="/">
          <Logo />
        </Link>

        <h2 className="font-ultrabold mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">Connexion</h2>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Se connecter avec</p>

        <div className="mt-3 grid grid-cols-4 gap-3">
          <Button disabled variant="outline" className="items-center">
            <span className="sr-only">Connexion avec Apple</span>
            <FaApple className="h-5 w-5" />
          </Button>
          <Button disabled variant="outline" className="items-center">
            <span className="sr-only">Connexion avec Google</span>
            <FaGoogle className="h-5 w-5" />
          </Button>
          <Button disabled variant="outline" className="items-center">
            <span className="sr-only">Connexion avec Facebook</span>
            <FaFacebook className="h-5 w-5" />
          </Button>
          <Button disabled variant="outline" className="items-center">
            <span className="sr-only">Connexion avec X</span>
            <FaXTwitter className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">ou</span>
          </div>
        </div>

        <LoginForm />
        <div className="inline-flex w-full justify-between">
          <a href="#" className="text-sm font-medium hover:underline">
            Mot de passe oublié ?
          </a>
          <Link href="/auth/register" className="text-sm font-medium hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

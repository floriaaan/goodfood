"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { MdHome } from "react-icons/md";

export const NotFound = ({ className = "" }) => {
  return (
    <div className={cn("flex h-full flex-col items-center justify-center bg-white px-6 py-12", className)}>
      <div className="container mx-auto lg:flex lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-medium text-gf-green">
            Erreur <span className="text-gf-orange">404</span>
          </p>
          <h1 className="font-enedis text-2xl font-bold text-gray-800 md:text-3xl">
            {"Oups, cette page n'existe pas"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {"La page que vous recherchez n'existe pas. Veuillez vérifier l'URL ou revenir à l'accueil."}
          </p>
          <div className="mt-6 flex items-center gap-x-3">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-x-2 bg-black  p-3 text-sm font-bold uppercase text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdHome className="h-4 w-4 shrink-0" />
              <span>Accueil</span>
            </Link>
            {/* <a
              suppressHydrationWarning
              href={`mailto:${email}?cc=florian.leroux@enedis.fr&subject=%5BWEBAIS%5D%20-%20Bug%20rencontr%C3%A9%20&body=${encodeURIComponent(
                "\n\n\n" + JSON.stringify({ title: message, asPath }, undefined, 2),
              )}`}
              className="justify-center w-1/2 btn-blue-clear"
            >
              <MailIcon className="w-4 h-4 shrink-0" />
              <span>Contacter le {author}</span>
            </a> */}
          </div>
        </div>
        <div className="relative mt-12 flex w-full justify-center lg:mt-0 lg:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full md:max-w-lg lg:mx-auto" src="/images/404.svg" alt="404" />
        </div>
      </div>
    </div>
  );
};

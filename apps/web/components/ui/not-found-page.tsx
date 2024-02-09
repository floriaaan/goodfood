import Link from "next/link";
import { MdHome } from "react-icons/md";

export const NotFoundPage = () => {
  return (
    <div className={"flex h-full w-full flex-col items-center justify-center bg-white px-6 py-12"}>
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

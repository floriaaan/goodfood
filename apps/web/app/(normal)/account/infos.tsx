"use client";

import { useAuth } from "@/hooks";
import Image from "next/image";

export const Infos = () => {
  const { user } = useAuth();
  return (
    <>
      {/* <pre>{JSON.stringify(user, undefined, 1)}</pre> */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex gap-x-4">
          <Image
            alt="User profile pic"
            src="/images/tmp/user.png"
            width={128}
            height={128}
            className="h-32 w-32 shrink-0"
          />
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-ultrabold text-2xl font-bold">{user?.firstName ?? "Nom"}</h3>
              <p className="text-neutral-600">{user?.email ?? "Email"}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold">Adresse</h4>
              <p className="text-neutral-600">
                {user?.mainaddress.street} {user?.mainaddress.zipcode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

"use client";

import { RegisterStep1Form } from "@/app/auth/register/form-step-1";
import { RegisterStep2Form } from "@/app/auth/register/form-step-2";
import { RegisterStep3Form } from "@/app/auth/register/form-step-3";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/icon/logo";
import { ToastTitle } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { fetchAPI } from "@/lib/fetchAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdAccountCircle, MdArrowLeft, MdCheck } from "react-icons/md";

export default function Register() {
  const { login } = useAuth();
  const { push } = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [body, setBody] = useState({} as any);

  const register = async () => {
    body.phone = body.phone.replace("+33", "0").replace(/ /g, "");
    const res = await fetchAPI("/api/user/register", undefined, {
      body: JSON.stringify(body),
      method: "POST",
    });
    console.log(res);
    if (!res.ok)
      return toast({
        className: "p-3",
        children: (
          <div className="inline-flex w-full items-end justify-between gap-2">
            <div className="inline-flex shrink-0 gap-2">
              <MdAccountCircle className="h-6 w-6 text-red-500" />
              <div className="flex w-full grow flex-col">
                <ToastTitle>Erreur lors de la mise à jour de votre mot de passe</ToastTitle>
              </div>
            </div>
          </div>
        ),
      });
    login(body.email, body.password).then(async (res) => {
      const { ok, status } = res;
      if (!ok || status !== 200) {
        return toast({
          className: "p-3",
          children: (
            <div className="inline-flex w-full items-end justify-between gap-2">
              <div className="inline-flex shrink-0 gap-2">
                <MdAccountCircle className="h-6 w-6 text-red-500" />
                <div className="flex w-full grow flex-col">
                  <ToastTitle>Erreur lors de la connexion.</ToastTitle>
                  <small className="text-xs">Veuillez vérifier vos identifiants.</small>
                </div>
              </div>
            </div>
          ),
        });
      }
      return push("/");
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <Link href="/">
          <Logo />
        </Link>
        <h2 className="font-ultrabold mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Créer un compte
        </h2>
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

        {/* Replace LoginForm with RegisterForm */}
        {step === 1 && (
          <RegisterStep1Form
            initialValues={
              body.email && body.password && body.confirmPassword
                ? { email: body.email, password: body.password, confirmPassword: body.confirmPassword }
                : undefined
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onNext={(data) => {
              setBody({ ...body, ...data });
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <RegisterStep2Form
            initialValues={
              body.firstName && body.lastName
                ? { firstName: body.firstName, lastName: body.lastName, phone: body.phone }
                : undefined
            }
            onBack={() => setStep(1)}
            onNext={(data) => {
              setBody({ ...body, ...data });
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <RegisterStep3Form
            initialValues={
              body.street && body.zipCode && body.city && body.country && body.lat && body.lng
                ? {
                    street: body.street,
                    zipCode: body.zipCode,
                    city: body.city,
                    country: body.country,
                    lat: body.lat,
                    lng: body.lng,
                  }
                : undefined
            }
            onBack={() => setStep(2)}
            onNext={(data) => {
              setBody({ ...body, ...data });
              setStep(4);
            }}
          />
        )}
        {step === 4 && (
          <div>
            <h2 className="font-ultrabold mt-6 text-3xl font-extrabold text-gray-900 ">
              On récapitule {body.firstName} ?
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              <div className="">
                <p className="text-sm  text-gray-600">Email</p>
                <p className="font-bold  text-gray-800">{body.email}</p>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <div className="">
                <p className="text-sm  text-gray-600">Prénom et nom</p>
                <p className="font-bold  text-gray-800">
                  {body.firstName} {body.lastName}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <div className="">
                <p className="text-sm  text-gray-600">Téléphone</p>
                <p className="font-bold  text-gray-800">{body.phone || "Non renseigné"}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <div className="">
                <p className="text-sm  text-gray-600">Adresse</p>
                <p className="whitespace-pre-wrap  font-bold text-gray-800">{`${body.street} ${body.zipCode} ${body.city} ${body.country}`}</p>
                {body.lat && body.lng && (
                  <p className="text-xs  text-gray-400">
                    {body.lat}, {body.lng}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 inline-flex w-full gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>
                <MdArrowLeft />
                Retour
              </Button>
              <Button type="button" onClick={register}>
                Valider
                <MdCheck />
              </Button>
            </div>
          </div>
        )}

        <div className="inline-flex w-full justify-between">
          <a href="#" className="text-sm font-medium hover:underline">
            Mot de passe oublié ?
          </a>
          <Link href="/auth/login" className="text-sm font-medium hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

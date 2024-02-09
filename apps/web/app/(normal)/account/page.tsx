"use client";

import { BecomeDeliveryPersonButton } from "@/app/(normal)/account/become-delivery-person-button";
import { ChangePasswordForm } from "@/app/(normal)/account/change-password-form";
import { Infos } from "@/app/(normal)/account/infos";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks";

export default function UserAccount() {
  const { user } = useAuth();
  if (!user) return "Unauthenticated";
  return (
    <>
      <div className="flex flex-col gap-4 bg-neutral-100 p-4 pt-6 lg:p-8">
        <h2 className="font-ultrabold text-3xl uppercase">Mon compte</h2>
        <Accordion defaultValue="infos" type="single" collapsible>
          <AccordionItem value="infos">
            <AccordionTrigger>Mes informations</AccordionTrigger>
            <AccordionContent>
              <Infos />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="change-password">
            <AccordionTrigger>Changer mon mot de passe</AccordionTrigger>
            <AccordionContent>
              <ChangePasswordForm />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery-person">
            <AccordionTrigger>Se déclarer livreur</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              <p className="text-sm font-light text-neutral-700">
                Pour devenir livreur, vous devez consentir à ce que nous utilisions votre position.
                <br />
                Vous devez également avoir renseigné votre numéro de téléphone et votre adresse (
                {"si vous n'en avez pas, nous utiliserons votre adresse client"}).
                <br />
                Cela nous permettra de vous contacter et de vous envoyer des commandes.
                <br />
              </p>
              <u className="mt-2">{'Plus d\'informations sur la page "Devenir livreur".'}</u>

              <BecomeDeliveryPersonButton />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

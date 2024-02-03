import { ChangePasswordForm } from "@/app/(normal)/account/change-password-form";
import { Infos } from "@/app/(normal)/account/infos";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function UserAccount() {
  return (
    <>
      <div className="flex flex-col gap-4 bg-neutral-100 p-4 lg:p-8">
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
        </Accordion>
      </div>
    </>
  );
}

/* eslint-disable react/no-unescaped-entities */
export default function TermsPage() {
  return (
    <>
      <div className="font-ultrabold flex h-fit w-full items-center justify-center bg-gray-100 px-4 py-12 text-center text-[max(2.5rem,min(10vw,3.5rem))] uppercase text-gray-700">
        Conditions générales de vente
      </div>
      <article className="prose mx-auto max-w-5xl">
        <h2>1. Commandes</h2>

        <p>1.1. En passant une commande sur notre site, vous confirmez être légalement apte à conclure des contrats.</p>

        <p>
          1.2. Les informations fournies lors de la commande doivent être exactes et complètes. Nous ne sommes pas
          responsables des erreurs de livraison résultant d'informations incorrectes.
        </p>

        <h2>2. Prix et Paiement</h2>

        <p>2.1. Les prix des produits sont indiqués sur notre site et peuvent être sujets à des variations.</p>

        <p>
          2.2. Les paiements peuvent être effectués par [modes de paiement acceptés]. Toutes les transactions sont
          sécurisées, mais nous ne sommes pas responsables des problèmes liés aux systèmes de paiement tiers.
        </p>

        <h2>3. Livraison</h2>

        <p>
          3.1. Nous nous engageons à livrer les produits dans les délais convenus. Les retards éventuels seront
          communiqués.
        </p>

        <p>
          3.2. Les frais de livraison peuvent varier en fonction de la zone de livraison. Consultez la section "Frais de
          Livraison" pour plus d'informations.
        </p>

        <h2>4. Retours et Remboursements</h2>

        <p>
          4.1. Consultez notre politique de retour pour connaître les conditions et les procédures de retour des
          produits.
        </p>

        <h2>5. Responsabilité</h2>

        <p>
          5.1. Nous nous efforçons de garantir la qualité de nos produits, mais nous ne pouvons pas être tenus
          responsables des problèmes résultant d'une utilisation inappropriée ou de conditions indépendantes de notre
          contrôle.
        </p>

        <h2>6. Protection des Données</h2>

        <p>
          6.1. Consultez notre politique de confidentialité pour comprendre comment nous collectons, utilisons et
          protégeons vos données personnelles.
        </p>

        <h2>7. Litiges</h2>

        <p>
          7.1. En cas de litige, la juridiction compétente est [juridiction compétente] et la loi applicable est [loi
          applicable].
        </p>

        <p>
          Merci de faire confiance à Goodfood pour vos besoins alimentaires. Si vous avez des questions concernant nos
          CGV, veuillez nous contacter à [adresse e-mail] ou via notre formulaire de contact.
        </p>
      </article>
    </>
  );
}

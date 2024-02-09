/* eslint-disable react/no-unescaped-entities */
export default function AboutPage() {
  return (
    <>
      <div className="font-ultrabold flex h-fit w-full items-center justify-center bg-gray-100 px-4 py-12 text-center text-[max(2.5rem,min(10vw,3.5rem))] uppercase text-gray-700">
        À propos de nous
      </div>
      <article className="prose mx-auto max-w-5xl">
        <p>
          Bienvenue sur Goodfood, votre partenaire pour des repas délicieux et pratiques. Chez Goodfood, nous nous
          engageons à fournir des produits de qualité et un service exceptionnel à nos clients. Découvrez notre histoire
          et notre mission ci-dessous.
        </p>

        <h2>Notre Histoire</h2>

        <p>
          Fondée en [année de fondation], Goodfood a débuté avec une vision simple : rendre les repas délicieux
          accessibles à tous. Au fil des années, nous avons travaillé sans relâche pour créer une expérience culinaire
          unique, en proposant une sélection variée de plats et d'ingrédients frais livrés directement à votre porte.
        </p>

        <h2>Notre Mission</h2>

        <p>
          Notre mission chez Goodfood est de simplifier votre vie quotidienne en vous offrant une solution pratique pour
          vos repas. Nous croyons en la fraîcheur, la qualité et la diversité des ingrédients. Grâce à notre service de
          livraison, nous voulons vous aider à économiser du temps tout en vous permettant de savourer des repas
          délicieux à la maison.
        </p>

        <h2>Engagement envers la Qualité</h2>

        <p>
          Nous nous approvisionnons soigneusement en produits de qualité supérieure et nous travaillons en étroite
          collaboration avec des producteurs locaux chaque fois que possible. Chez Goodfood, la satisfaction de nos
          clients est notre priorité, et nous nous efforçons constamment d'améliorer nos services pour répondre à vos
          besoins.
        </p>

        <h2>Contactez-Nous</h2>

        <p>
          Nous sommes ravis de partager notre passion pour la cuisine avec vous. Si vous avez des questions, des
          suggestions ou simplement envie de discuter, n'hésitez pas à nous contacter à [adresse e-mail] ou via notre
          formulaire de contact. Merci de choisir Goodfood pour vos besoins alimentaires.
        </p>
      </article>
    </>
  );
}

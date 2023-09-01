export const BasketTaxes = () => {
  return (
    <div className="bg-gf-green-100/50 flex flex-col gap-y-2 text-sm p-2 pl-4 font-bold text-gf-green">
      <div className="inline-flex w-full items-center justify-between">
        Livraison
        <div className="text-gf-green-600 text-xs bg-gf-green-200/60 p-1 px-2">On vous l'offre</div>
      </div>
      <div className="inline-flex w-full items-center justify-between">
        Frais de service
        <div className="text-gf-green-600 text-xs bg-gf-green-200/60 p-1 px-2">0€50</div>
      </div>
    </div>
  );
};

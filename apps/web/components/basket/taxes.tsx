export const BasketTaxes = () => {
  return (
    <div className="flex flex-col gap-y-2 bg-gf-green-100/50 p-2 pl-4 text-sm font-bold text-gf-green">
      <div className="inline-flex w-full items-center justify-between">
        Livraison
        <div className="bg-gf-green-200/60 p-1 px-2 text-xs text-gf-green-600">{"On vous l'offre"}</div>
      </div>
      <div className="inline-flex w-full items-center justify-between">
        Frais de service
        <div className="bg-gf-green-200/60 p-1 px-2 text-xs text-gf-green-600">0€50</div>
      </div>
    </div>
  );
};

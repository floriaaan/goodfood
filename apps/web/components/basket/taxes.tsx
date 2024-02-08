import { useBasket } from "@/hooks";
import { toPrice } from "@/lib/product/toPrice";
import { MdInfo } from "react-icons/md";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const BasketTaxes = () => {
  const { taxes } = useBasket();
  return (
    <div className="flex flex-col gap-y-2 bg-gf-green-100/50 p-2 pl-4 text-sm font-bold text-gf-green">
      <div className="inline-flex w-full items-center justify-between">
        <span className="inline-flex gap-x-1">
          Livraison
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <MdInfo className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Ne vous inquiétez pas, nos livreurs sont rémunéré.e.s!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <div className="bg-gf-green-200/60 p-1 px-2 text-xs text-gf-green-600">
          {taxes.delivery > 0 ? toPrice(taxes.delivery) : "On vous l'offre"}
        </div>
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <span className="inline-flex gap-x-1">
          Frais de service
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <MdInfo className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Les frais de service correspondent à la commission que nous prenons pour financer notre service.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <div className="bg-gf-green-200/60 p-1 px-2 text-xs text-gf-green-600">
          {taxes.service > 0 ? toPrice(taxes.service) : "On vous l'offre"}
        </div>
      </div>
    </div>
  );
};

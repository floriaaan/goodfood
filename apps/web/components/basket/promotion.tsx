import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const BasketPromotion = () => {
  return (
    <div className="my-2 inline-flex items-center justify-between p-2">
      <Label htmlFor="promo" className="text-xs font-light">
        {"J'ai un code promo ou code de parrainage"}
      </Label>
      <Switch id="promo" />
    </div>
  );
};

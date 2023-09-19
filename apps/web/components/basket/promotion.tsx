"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBasket } from "@/hooks/useBasket";
import { useState } from "react";
import { MdCheck } from "react-icons/md";

export const BasketPromotion = () => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const { promotion, checkPromotionCode } = useBasket();

  return (
    <div className="my-2 flex w-full flex-col gap-y-1 p-2">
      <div className="inline-flex items-center justify-between">
        <Label htmlFor="promo" className="text-xs font-light">
          {"J'ai un code promo ou code de parrainage"}
        </Label>
        <Switch
          id="promo"
          onCheckedChange={(checked) => {
            setShowInput(checked);
            if (!checked) {
              setCode("");
              checkPromotionCode("");
            }
          }}
        />
      </div>
      {showInput && (
        <form
          className="mt-2 inline-flex w-full items-center justify-between gap-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            checkPromotionCode(code);
          }}
        >
          <Input
            className="grow"
            placeholder="Code de promotion / parrainage"
            aria-label="Code de promotion / parrainage"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button variant="solid" className="h-14 w-14 shrink-0 border-2 border-gray-300 bg-white ring-black">
            <MdCheck className="h-6 w-6" />
          </Button>
        </form>
      )}
    </div>
  );
};

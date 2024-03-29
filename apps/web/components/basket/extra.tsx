import { useBasket } from "@/hooks/useBasket";
import { cn } from "@/lib/utils";
import { MdAdd, MdDelete } from "react-icons/md";

export const BasketExtra = () => {
  const { addProduct, removeProduct, basket } = useBasket();

  const hasBread = basket.productsList.some((product) => product.id === "extra/bread" && product.quantity > 0);
  const hasUtensils = basket.productsList.some((product) => product.id === "extra/utensils" && product.quantity > 0);

  return (
    <section className={cn("mb-2 flex flex-col gap-y-1", "")}>
      <div className="inline-flex w-full items-center justify-between bg-gray-100 py-1.5 pl-3 pr-1.5">
        <span className="text-sm font-bold">Pain</span>
        <div className="inline-flex items-center gap-x-2">
          <span className="text-xs font-bold">0€15</span>
          <button
            disabled
            onClick={() => (!hasBread ? addProduct("extra/bread", 1) : removeProduct("extra/bread", 1))}
            className={cn(
              "flex h-8 w-8 items-center justify-center border disabled:opacity-50",
              hasBread ? "bg-gray-300" : "bg-white",
            )}
          >
            {!hasBread ? <MdAdd className="h-4 w-4" /> : <MdDelete className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-0.5 bg-gray-100 py-1.5 pl-3 pr-1.5">
        <div className="inline-flex w-full items-center justify-between ">
          <span className="text-sm font-bold">Couverts</span>
          <div className="inline-flex items-center gap-x-2">
            <span className="text-xs font-bold">0€15</span>
            <button
              disabled
              className={cn(
                "flex h-8 w-8 items-center justify-center border disabled:opacity-50",
                hasUtensils ? "bg-gray-300" : "bg-white",
              )}
              onClick={() => (!hasUtensils ? addProduct("extra/utensils", 1) : removeProduct("extra/utensils", 1))}
            >
              {!hasUtensils ? <MdAdd className="h-4 w-4" /> : <MdDelete className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <span className="text-[10px] text-gray-500">Bio-dégradables 🌱</span>
        <span className="text-[10px] text-gray-500">Fourchette, couteau, cuillère et serviette</span>
      </div>
    </section>
  );
};

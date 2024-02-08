import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";

interface amountProps {
  title: string;
  amount: number;
  percent: number;
  lastUpdate: Date;
  reverseColor?: boolean;
}

export const AmountStat = (amountProps: amountProps) => {
  const { title, amount, percent, lastUpdate, reverseColor } = amountProps;
  const numberWithSpaces = (x: number) => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };
  const setColor = () => {
    if (reverseColor) return Math.sign(percent) === 1 ? "text-red-600" : "text-green-600";
    return Math.sign(percent) === 1 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex flex-col gap-y-1">
      <h2 className="text-xl font-bold text-neutral-700">{title}</h2>
      <div className="flex flex-col">
        <div className="flex items-end gap-4">
          <p className="text-5xl font-bold"> {numberWithSpaces(amount)}€</p>
          <span className={cn("text-3xl font-bold", setColor())}>
            {Math.sign(percent) === 1 ? "+" : ""}
            {percent}%
          </span>
        </div>
        <span className="text-sm text-gray-500">{formatDistance(lastUpdate, new Date(), { addSuffix: true })}</span>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Select = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const hasValue = props.value && props.value.toString().length > 0;

  return (
    <label className="relative h-14 w-full">
      <span
        className={cn(
          "absolute z-10 transition-all duration-200 ease-in-out",
          hasValue
            ? "left-2 top-1.5 text-[10px] text-black"
            : "left-3 top-1/2 -translate-y-1/2 transform text-sm text-muted-foreground",
        )}
      >
        {props["aria-label"]}
      </span>
      <select
        className={cn(
          "absolute z-[9] flex h-14 w-full border-2 border-gray-300 bg-white px-3 py-2 text-sm font-bold placeholder:text-white focus:border-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className,
        )}>
          <option>TEST</option>
      </select>
    </label>
  );
});
Select.displayName = "Input";

export { Select };

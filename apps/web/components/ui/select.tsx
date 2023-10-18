import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Select = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }) => {
  return (
    <label htmlFor="select-input" className="pointer-events-auto relative z-0 h-14 w-full border-2 border-black">
      <span className={cn("absolute top-1 w-full transform select-none pl-3 text-xs text-muted-foreground")}>
        {props["aria-label"]}
      </span>
      <span
        className={cn("pointer-events-none absolute bottom-2.5 right-2.5 z-10 transform text-xs text-muted-foreground")}
      >
        <MdKeyboardArrowDown className="h-5 w-5 shrink-0 text-black" />
      </span>
      <select
        id="select-input"
        className={cn(
          "absolute bottom-2.5 z-[9] flex w-full appearance-none bg-transparent px-3 align-text-bottom text-sm font-bold placeholder:text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <option>TEST</option>
        <option>TEST2</option>
        <option>TEST3</option>
      </select>
    </label>
  );
});
Select.displayName = "Input";

export { Select };

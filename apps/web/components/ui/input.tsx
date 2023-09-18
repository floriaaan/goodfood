import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
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
      <input
        type={type}
        className={cn(
          "absolute z-[9] flex h-14 w-full border-2 border-gray-300 px-3 py-2 text-sm font-bold file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-black focus-visible:outline-none active:border-black disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={props.value}
        onChange={props.onChange}
        {...props}
      />
    </label>
  );
});
Input.displayName = "Input";

export { Input };

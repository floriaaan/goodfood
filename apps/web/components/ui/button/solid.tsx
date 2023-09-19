import { cn } from "@/lib/utils";

export const SolidButton = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <button
      className={cn(
        `inline-flex w-full items-center justify-center gap-x-2  p-3 text-sm font-bold uppercase duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

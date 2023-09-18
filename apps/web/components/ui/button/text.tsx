import { cn } from "@/lib/utils";

export const TextButton = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => {
  return (
    <button
      className={cn(
        `inline-flex w-full items-center justify-center gap-x-2 text-sm font-bold uppercase duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

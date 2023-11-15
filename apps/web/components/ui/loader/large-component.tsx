import { cn } from "@/lib/utils";

export const LargeComponentLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex aspect-square h-auto w-full items-center justify-center", className)}>
      <video autoPlay loop muted className="h-64 w-64 object-cover">
        <source src="/videos/loader.webm" type="video/webm" />
      </video>
    </div>
  );
};

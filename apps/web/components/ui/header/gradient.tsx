import { cn } from "@/lib/utils";
import Image from "next/image";

export const GradientHeader = ({
  color,
  wrapperClassName,
  className,
  children,
}: {
  color: string;
  wrapperClassName?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Image src="/images/gradient.png" alt="Gradient" width={512} height={48} className="w-full object-cover h-full" />
      <div className={cn("absolute left-0 top-0 inline-flex h-full w-full items-center gap-x-3", color, className)}>
        {children}
      </div>
    </div>
  );
};

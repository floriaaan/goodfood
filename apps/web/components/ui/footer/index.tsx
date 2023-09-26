import { Logo } from "@/components/ui/icon/logo";

export const Footer = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="has-background-rectangle h-4"></div>
      <div className=" inline-flex items-center justify-between gap-2 bg-black p-10">
        <Logo display="logo" color="text-white" className="h-10 w-auto" />
      </div>
    </div>
  );
};

import { SolidButton } from "@/components/ui/button/solid";

export const Button = ({ type, ...props }: { type: "solid"; className: string; children: React.ReactNode }) => {
  return <>{type === "solid" && <SolidButton {...props}>{props.children}</SolidButton>}</>;
};

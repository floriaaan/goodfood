import { SolidButton } from "@/components/ui/button/solid";
import { TextButton } from "@/components/ui/button/text";
import { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant: "solid" | "text";
}

export const Button = ({ variant, ...props }: ButtonProps) => {
  return (
    <>
      {variant === "solid" && <SolidButton {...props}>{props.children}</SolidButton>}
      {variant === "text" && <TextButton {...props}>{props.children}</TextButton>}
    </>
  );
};

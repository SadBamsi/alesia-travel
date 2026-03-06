import type { FC, JSX, ReactNode } from "react";
import { TypographyVariants } from "./variants";

export const Typography: FC<{
  variant: keyof typeof TypographyVariants;
  children: ReactNode;
}> = ({ variant, children }): JSX.Element => {
  const className = TypographyVariants[variant] || "";
  return <p className={className}>{children}</p>;
};

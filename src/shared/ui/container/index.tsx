import clsx from "clsx";
import type { FC, ReactNode } from "react";
import styles from "./styles.module.scss";

export interface IContainerProps {
  children: ReactNode;
  variant: "centered" | "fullWidth";
}

export const Container: FC<IContainerProps> = ({ children, variant }) => {
  const className = clsx(
    styles.container,
    variant === "centered" && styles.container__centered,
  );
  return <div className={className}>{children}</div>;
};

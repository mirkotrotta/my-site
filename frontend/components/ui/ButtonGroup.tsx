import { ReactNode } from "react";

type ButtonGroupProps = {
  children: ReactNode;
  className?: string;
  direction?: "row" | "col"; // Allows for horizontal or vertical layout
};

export default function ButtonGroup({
  children,
  className = "",
  direction = "row",
}: ButtonGroupProps) {
  return (
    <div
      className={`inline-flex flex-wrap ${
        direction === "col" ? "flex-col gap-4" : "flex-row gap-3"
      } ${className}`}
    >
      {children}
    </div>
  );
}

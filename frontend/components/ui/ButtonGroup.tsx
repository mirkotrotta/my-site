import { ReactNode } from "react";
import Button from './Button'; // Ensure the Button component is imported

export type ButtonProps = {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  arrow?: boolean;
};

type ButtonGroupProps = {
  buttons?: ButtonProps[]; // Update to accept buttons prop with variants
  className?: string;
  direction?: "row" | "col"; // Allows for horizontal or vertical layout
};

export default function ButtonGroup({
  buttons,
  className = "",
  direction = "row",
}: ButtonGroupProps) {
  return (
    <div
      className={`inline-flex flex-wrap ${
        direction === "col" ? "flex-col gap-4" : "flex-row gap-3"
      } ${className}`}
    >
      {buttons && buttons.map((button, index) => (
        <Button key={index} href={button.href} variant={button.variant} showArrow={button.arrow}> 
          {button.text}
        </Button>
      ))}
    </div>
  );
}

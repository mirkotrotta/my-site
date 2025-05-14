import { ReactNode } from "react";
import Button from './Button'; // Ensure the Button component is imported

export type ButtonProps = {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  arrow?: boolean;
};

type ButtonGroupProps = {
  buttons?: ButtonProps[]; // Original prop for backward compatibility
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  className?: string;
  direction?: "row" | "col"; // Allows for horizontal or vertical layout
};

export default function ButtonGroup({
  buttons,
  primaryButton,
  secondaryButton,
  className = "",
  direction = "row",
}: ButtonGroupProps) {
  // Combine button sources
  const renderButtons = () => {
    // If buttons array is provided, use it (legacy support)
    if (buttons && buttons.length > 0) {
      return buttons.map((button, index) => (
        <Button key={index} href={button.href} variant={button.variant} showArrow={button.arrow}> 
          {button.text}
        </Button>
      ));
    }
    
    // Otherwise, use the primary and secondary button props
    const buttonElements = [];
    
    if (primaryButton) {
      buttonElements.push(
        <Button key="primary" href={primaryButton.href} variant="primary" showArrow={false}>
          {primaryButton.text}
        </Button>
      );
    }
    
    if (secondaryButton) {
      buttonElements.push(
        <Button key="secondary" href={secondaryButton.href} variant="tertiary" showArrow={true}>
          {secondaryButton.text}
        </Button>
      );
    }
    
    return buttonElements;
  };

  return (
    <div
      className={`inline-flex flex-wrap ${
        direction === "col" ? "flex-col gap-4" : "flex-row gap-3"
      } ${className}`}
    >
      {renderButtons()}
    </div>
  );
}

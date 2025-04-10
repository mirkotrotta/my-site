import { ReactNode, ElementType } from 'react';

type GlobalContainerProps<T extends ElementType = 'div'> = {
  children: ReactNode;
  className?: string;
  as?: T;
  fluid?: boolean;
};

/**
 * GlobalContainer - A reusable container component that enforces consistent 
 * horizontal padding and margin across all pages.
 * 
 * @param children - The content to be wrapped
 * @param className - Additional CSS classes to apply
 * @param as - HTML element to render (default: 'div')
 * @param fluid - Whether to use max width constraints (false) or full width (true)
 */
export default function GlobalContainer<T extends ElementType = 'div'>({
  children,
  className = '',
  as,
  fluid = false,
}: GlobalContainerProps<T>) {
  const Component = as || 'div';
  
  return (
    <Component
      className={`
        w-full
        px-8
        py-0
        ${!fluid ? 'max-w-full' : ''}
        mx-auto
        ${className}
      `}
    >
      {children}
    </Component>
  );
} 
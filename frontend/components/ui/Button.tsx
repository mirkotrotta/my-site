'use client';

import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
  download?: boolean | string;
} & ComponentProps<'button'>;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  onClick,
  showArrow = false,
  download,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-start justify-start transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    tertiary:
      'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white',
    link: 'text-blue-600 hover:underline dark:text-blue-400',
  };

  const classes = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className,
    showArrow && 'group'
  );

  const content = (
    <>
      {children}
      {showArrow && (
        <MoveRight size={24} className="ml-2 transition-transform group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    if (download) {
      return (
        <a href={href} className={classes} download={download}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {content}
    </button>
  );
}

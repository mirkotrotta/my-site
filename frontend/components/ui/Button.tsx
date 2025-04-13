'use client';

import { ArrowRight } from '@carbon/icons-react';
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
} & ComponentProps<'button'>;

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900',
    tertiary:
      'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-900',
    link: 'text-blue-600 hover:underline dark:text-blue-400',
  };

  const classes = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {children}
      <ArrowRight size={16} className="ml-2" />
    </>
  );

  if (href) {
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

'use client';

import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { ComponentProps, ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
} & ComponentProps<'button'>;

type AnchorButtonProps = {
  href: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  onClick?: () => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick' | 'className' | 'children' | 'ref'> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showArrow?: boolean;
  children: ReactNode;
};

type NativeButtonProps = {
  href?: undefined;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'ref'> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showArrow?: boolean;
  children: ReactNode;
};

type PolymorphicButtonProps = AnchorButtonProps | NativeButtonProps;

export default function Button(props: PolymorphicButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    showArrow = false,
    ...rest
  } = props;

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

  if ('href' in props && props.href) {
    const { href, download, target, rel, onClick, ...anchorProps } = rest as AnchorButtonProps;
    
    // Check if it's an external link or has special attributes
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || download || target === '_blank';
    
    if (isExternal) {
      // For external links, downloads, or links with special attributes, use <a>
      return (
        <a
          href={href}
          className={classes}
          download={download}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
          onClick={onClick}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    // For internal navigation, use Next.js Link
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        {...anchorProps}
      >
        {content}
      </Link>
    );
  }

  // Native button
  const { onClick, ...buttonProps } = rest as NativeButtonProps;
  return (
    <button className={classes} onClick={onClick} {...buttonProps}>
      {content}
    </button>
  );
}

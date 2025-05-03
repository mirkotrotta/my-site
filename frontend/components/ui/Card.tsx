import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  linkUrl?: string;
  linkText?: string;
  className?: string;
  children?: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'minimal';
}

export default function Card({
  title,
  description,
  imageUrl,
  imageAlt = 'Card image',
  linkUrl,
  linkText,
  className = '',
  children,
  variant = 'default'
}: CardProps) {
  const { t } = useTranslation();
  
  // Base styles that apply to all variants
  const baseStyles = 'rounded-lg overflow-hidden';
  
  // Variant-specific styles
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 shadow-md',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-xl',
    minimal: 'bg-transparent'
  };
  
  // Combined styles
  const cardStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  // Determine if we need to wrap the card in a link
  const CardWrapper = ({ children }: { children: ReactNode }) => {
    if (linkUrl) {
      return (
        <Link href={linkUrl} className="block h-full transition-transform duration-200 hover:scale-[1.02]">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };
  
  // Helper for rendering the card content
  const renderCardContent = () => (
    <>
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h3>
        
        {description && (
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            {description}
          </p>
        )}
        
        {children}
        
        {linkUrl && linkText && variant === 'minimal' && (
          <Link 
            href={linkUrl}
            className="inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
          >
            {linkText}
            <svg 
              className="ml-1 h-4 w-4" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        )}
      </div>
    </>
  );
  
  return (
    <div className={cardStyles}>
      <CardWrapper>
        {renderCardContent()}
      </CardWrapper>
    </div>
  );
} 
import Link from 'next/link';
import { ReactNode } from 'react';

export type GlobalCTAProps = {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  onClick?: () => void;
  className?: string;
};

/**
 * GlobalCTA - A reusable call-to-action component with IBM-inspired minimal styling
 */
export default function GlobalCTA({
  title,
  subtitle,
  buttonText,
  buttonHref,
  onClick,
  className = '',
}: GlobalCTAProps) {
  return (
    <section className={`
      py-10 md:py-14
      bg-gray-50 dark:bg-gray-800
      ${className}
    `}>
      <div className="px-6 max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-medium mb-3 text-gray-900 dark:text-white">
          {title}
        </h2>
        
        {subtitle && (
          <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {subtitle}
          </p>
        )}
        
        <Link 
          href={buttonHref}
          onClick={onClick}
          className="
            inline-flex items-center
            bg-blue-600 
            text-white
            px-10 py-5
            text-sm font-medium
            hover:bg-blue-700
            transition-colors
          "
        >
          {buttonText}
          <svg 
            className="ml-2 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
} 
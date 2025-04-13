import Button from './Button';

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
    <section
      className={`
        py-10 md:py-14
        bg-gray-50 dark:bg-gray-800
        ${className}
      `}
    >
      <div className="px-6 max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-medium mb-3 text-gray-900 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {subtitle}
          </p>
        )}

        <Button
          href={buttonHref}
          onClick={onClick}
          variant="primary"
          size="lg"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}

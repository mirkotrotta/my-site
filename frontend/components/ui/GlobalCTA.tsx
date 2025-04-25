import ButtonGroup from './ButtonGroup';

export type GlobalCTAProps = {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  buttonTextSecondary?: string;
  buttonHrefSecondary?: string;
  onClick?: () => void;
  className?: string;
};

export default function GlobalCTA({
  title,
  subtitle,
  buttonText,
  buttonHref,
  buttonTextSecondary,
  buttonHrefSecondary,
  className = '',
}: GlobalCTAProps) {
  return (
    <section
      className={`
        py-10 md:py-16
        bg-gray-50 dark:bg-gray-800
        ${className}
      `}
    >
      <div className="px-4 md:px-24 max-w-full mx-auto">
        <h2 className="text-4xl md:text-5xl font-normal mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {subtitle}
          </p>
        )}
        <ButtonGroup
          buttons={[
            {
              text: buttonText,
              href: buttonHref,
              variant: 'primary',
              arrow: false,
            },
            {
              text: buttonTextSecondary || '',
              href: buttonHrefSecondary || '',
              variant: 'tertiary',
              arrow: true,
            },
          ]}
        />
      </div>
    </section>
  );
}

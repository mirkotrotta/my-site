import Image from "next/image";
import Link from "next/link";
import ButtonGroup from "./ButtonGroup";
import { ButtonProps } from './ButtonGroup'; 


interface FeatureNormalProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageSrc: string;
  imageAlt?: string;
}

export default function FeatureNormal({
  title,
  subtitle,
  description,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageSrc,
  imageAlt = "",
}: FeatureNormalProps) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="px-10 py-12 md:py-20">
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>
          <h2 className="text-4xl font-normal text-gray-900 dark:text-white mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {description}
          </p>
          <ButtonGroup
            buttons={[
              {
                text: primaryCtaText,
                href: primaryCtaHref,
                variant: 'primary',
                arrow: true,
              },
              secondaryCtaText && secondaryCtaHref
                ? {
                    text: secondaryCtaText,
                    href: secondaryCtaHref,
                    variant: 'tertiary',
                    arrow: true,
                  }
                : null,
            ].filter(Boolean) as ButtonProps[]}
          />
        </div>
        <div className="relative w-full h-full aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

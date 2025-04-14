import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import ClientHeroNews from "./ClientHeroNews";

type HeroWithSidebarProps = {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  imageSrc: string;
  children?: ReactNode;
};

export default function HeroWithSidebar({
  title,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  children,
}: HeroWithSidebarProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
      <div className="lg:col-span-6 flex flex-col justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <h1 className="text-3xl md:text-5xl font-normal text-gray-900 dark:text-white mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          {description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href={primaryCta.href} variant="primary" size="lg">
            {primaryCta.text}
          </Button>
          <Button href={secondaryCta.href} variant="tertiary" size="lg">
            {secondaryCta.text}
          </Button>
        </div>
        {children}
      </div>
      <div className="lg:col-span-4">
        <div className="h-full w-full bg-black/80 overflow-hidden">
          <img src={imageSrc} alt="Hero Image" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4">
        <ClientHeroNews />
      </div>
    </section>
  );
}

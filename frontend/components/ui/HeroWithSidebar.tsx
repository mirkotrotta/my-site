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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
      <div className="lg:col-span-5">
        <h1 className="text-3xl md:text-5xl font-light text-blue-500 dark:text-white mb-6">
          {title}
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8">
          {description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href={primaryCta.href} variant="primary" showArrow size="lg">
            {primaryCta.text}
          </Button>
          <Button href={secondaryCta.href} variant="tertiary" showArrow size="lg">
            {secondaryCta.text}
          </Button>
        </div>
        {children}
      </div>

      <div className="lg:col-span-5 w-full h-full">
        <img
          src={imageSrc}
          alt="Hero Image"
          className="w-full h-auto rounded object-cover"
        />
      </div>

      <div className="lg:col-span-2 p-4 border-l border-gray-200 dark:border-gray-700 text-sm">
        <h4 className="text-gray-900 dark:text-white font-medium mb-4">Latest news</h4>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <ClientHeroNews />
        </div>
      </div>
    </div>
  );
}

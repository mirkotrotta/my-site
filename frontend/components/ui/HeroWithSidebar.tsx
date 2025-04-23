import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import ButtonGroup from "@/components/ui/ButtonGroup";
import ClientHeroNews from "./ClientHeroNews";

type HeroWithSidebarProps = {
  title: string;
  eyebrowText: string;
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
  eyebrowText,
  description,
  imageSrc,
  children,
}: HeroWithSidebarProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
      <div className="lg:col-span-5">
        <h2 className="text-sm uppercase font-normal text-gray-900 dark:text-white mb-2">
          {eyebrowText}
        </h2>
        <h1 className="text-3xl md:text-5xl font-light text-blue-500 dark:text-white mb-6">
          {title}
        </h1>
        <p
          className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <ButtonGroup 
              buttons={[
                {
                  text: 'View Resume',
                  href: '/resume',
                  variant: 'primary',
                  arrow: true,
                },
                {
                  text: 'View Projects',
                  href: '/projects',
                  variant: 'tertiary',
                  arrow: true,
                },
              ]}
        />
        {children}
      </div>

      <div className="lg:col-span-5 w-full h-full">
        <img
          src={imageSrc}
          alt="Hero Image"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="lg:col-span-2 p-4 text-sm">
        <h4 className="text-gray-900 dark:text-white font-normal mb-4">Latest news</h4>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <ClientHeroNews />
        </div>
      </div>
    </div>
  );
}

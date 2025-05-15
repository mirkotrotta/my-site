import { ReactNode, useState } from "react";
import ButtonGroup from "@/components/ui/ButtonGroup";
import ClientHeroNews from "./ClientHeroNews";
import Image from "next/image";

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
  sidebarTitle?: string;
  children?: ReactNode;
};

export default function HeroWithSidebar({
  title,
  eyebrowText,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  sidebarTitle = "Latest news",
  children,
}: HeroWithSidebarProps) {
  const [imgError, setImgError] = useState(false);
  
  // Use a fallback image if primary image fails to load
  const imageSource = imgError ? "/images/mirko-trotta-profile-aboutpage.jpg" : imageSrc;
  
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
                  text: primaryCta.text,
                  href: primaryCta.href,
                  variant: 'primary',
                  arrow: false,
                },
                {
                  text: secondaryCta.text,
                  href: secondaryCta.href,
                  variant: 'tertiary',
                  arrow: true,
                },
              ]}
        />
        {children}
      </div>

      <div className="lg:col-span-5 w-full h-full relative aspect-[4/3]">
        <Image
          src={imageSource}
          alt="Hero Image"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          onError={() => setImgError(true)}
          unoptimized={false} // Let Next.js optimize the image
        />
      </div>

      <div className="lg:col-span-2 p-4 text-sm">
        <h4 className="text-gray-900 dark:text-white font-normal mb-4">{sidebarTitle}</h4>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <ClientHeroNews />
        </div>
      </div>
    </div>
  );
}

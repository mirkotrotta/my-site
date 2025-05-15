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
    <div className="grid grid-cols-1 lg:grid-cols-8 min-h-[calc(90vh)] pb-16 lg:pb-20 pt-4 lg:pt-6 gap-4 lg:gap-8">
      <div className="lg:col-span-5 lg:row-span-2 max-w-4xl mx-auto lg:mx-0">
        <div className="flex flex-col h-full justify-center">
          <div className="space-y-6 max-w-prose">
            <p className="text-purple-600 font-semibold tracking-wide uppercase">
              {eyebrowText}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 lg:leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
              {description}
            </p>
            <ButtonGroup
              primaryButton={primaryCta}
              secondaryButton={secondaryCta}
            />
          </div>
        </div>
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

      <div className="lg:col-span-5 lg:row-start-3 max-w-4xl mx-auto lg:mx-0">
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{sidebarTitle}</h2>
          {children ? children : <ClientHeroNews />}
        </div>
      </div>
    </div>
  );
}

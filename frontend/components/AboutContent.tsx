'use client';

import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import Layout from '@/components/Layout';
import SocialLinks from '@/components/SocialLinks';
import GlobalCTA from '@/components/ui/GlobalCTA';
import ClientBlogSection from '@/app/ClientBlogSection';
import SkillsServicesGrid from '@/components/ui/SkillsServicesGrid';
import { skillsData, SkillOrService } from '@/lib/data';
import ButtonGroup from '@/components/ui/ButtonGroup';
import FeatureNormal from '@/components/ui/FeatureNormal';

interface AboutContentProps {
  language: 'en' | 'de';
}

export default function AboutContent({ language }: AboutContentProps) {
  const { t } = useTranslation();
  // Select skills based on language
  const currentSkills = skillsData[language] as SkillOrService[];

  return (
    <Layout>
      <div className="py-16">
        <section className="grid grid-cols-1 md:grid-cols-12 items-start gap-8 md:gap-12 mb-20">
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="h-auto md:w-full relative">
              <Image
                src="/images/mirko-trotta-profile-homepage.jpg"
                alt={t('about.imageAlt')}
                width={400}
                height={500}
                priority
                className="block w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="text-4xl md:text-5xl font-normal mb-2 text-gray-900 dark:text-white">{t('about.name')}</h1>
            <h2 className="text-xl font-sans font-light text-gray-600 dark:text-gray-400 my-4">{t('about.jobTitle')}</h2>
            <SocialLinks className="my-10 md:justify-start" />
            <div className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed space-y-4">
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.intro') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.career1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.career2') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.career3') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.career4') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.career5') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.bio.summary') }} />
            </div>
            <div className="mt-8"></div>
            <ButtonGroup 
              buttons={[
                {
                  text: t('about.buttons.caseStudies'),
                  href: `/${language}/projects`,
                  variant: 'primary',
                  arrow: false,
                },
                {
                  text: t('about.buttons.viewResume'),
                  href: `/${language}/resume`,
                  variant: 'tertiary',
                  arrow: true,
                },
              ]}
            />
          </div>
        </section>
      
        <div className="py-16 md:py-16">
        <FeatureNormal 
          subtitle={t('about.citizenship.subtitle')}
          title={t('about.citizenship.title')}
          description={t('about.citizenship.description')}
          primaryCtaText={t('common.buttons.viewResume')}
          primaryCtaHref={`/${language}/resume`}
          imageSrc="/images/mirko-trotta-profile-aboutpage-developer-with-experience.jpg"
        />
       </div>

      {/* Skills & Services Section */}
      <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-normal text-blue-500 dark:text-white">{t('about.skills.title')}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">{t('about.skills.description')}</p>
         </div>
          <SkillsServicesGrid items={currentSkills} />
      </section>

        {/* Blog Preview Section - Client Component */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <ClientBlogSection />
        </section>
        </div>

      <div className="-mx-4 sm:-mx-0 md:-mx-8 lg:-mx-12 mb-16">
       <GlobalCTA 
          title={t('about.cta.title')}
          subtitle={t('about.cta.subtitle')}
          buttonText={t('about.cta.primary')}
          buttonHref={`/${language}/contact`}
          buttonTextSecondary={t('about.cta.secondary')}
          buttonHrefSecondary={`/${language}/resume`}
          className="bg-gray-100 dark:bg-gray-800"
       />
      </div>
    </Layout>
  );
} 
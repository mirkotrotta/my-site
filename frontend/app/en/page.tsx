'use client'; // This component now uses client-side hooks

import GlobalCTA from "@/components/ui/GlobalCTA";
import SkillsServicesGrid from "@/components/ui/SkillsServicesGrid";
import ProjectCard from "@/components/projects/ProjectCard";
import { skillsData, featuredProjects, SkillOrService, Project } from "@/lib/data";
import Layout from "@/components/Layout";
import ClientBlogSection from "@/app/ClientBlogSection";
import HeroWithSidebar from "@/components/ui/HeroWithSidebar";
import Button from "@/components/ui/Button";
import useTranslation from '@/hooks/useTranslation'; // Import the hook

// Define a type for the language keys
type LanguageKey = 'en' | 'de';

export default function Home() {
  // Use the translation hook
  const { t, language } = useTranslation();

  // Ensure language is a valid key before using it
  const currentLanguageKey = (language === 'en' || language === 'de') ? language : 'en';

  // Get language-specific data using the typed key
  const currentSkills = skillsData[currentLanguageKey] as SkillOrService[];
  const currentProjects = featuredProjects[currentLanguageKey] as Project[];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <HeroWithSidebar
          eyebrowText={t('homepage.hero.eyebrow')}
          title={t('homepage.hero.title')}
          description={t('homepage.hero.description')} // Assuming description might contain HTML
          primaryCta={{ text: t('homepage.hero.primaryCta'), href: `/${language}/projects` }}
          secondaryCta={{ text: t('homepage.hero.secondaryCta'), href: `/${language}/resume` }}
          imageSrc="/images/mirko trotta-germany-development.jpg"
          sidebarTitle={t('homepage.hero.sidebarTitle')}
        />
      </section>

      {/* About/Introduction Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="md:grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 mb-8 md:mb-0">
            <div className="relative aspect-auto max-w-sm mx-auto overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src="/images/mirko-trotta-profile-aboutpage.jpg" 
                alt={t('homepage.about.imageAlt')}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-normal mb-4 text-blue-500 dark:text-white">{t('homepage.about.title')}</h2>
            <div className="prose dark:prose-invert">
              {/* Using dangerouslySetInnerHTML because these strings contain <strong> tags */}
              <p className="mb-4 text-lg" dangerouslySetInnerHTML={{ __html: t('homepage.about.bio1') }} />
              <p className="mb-4 text-lg" dangerouslySetInnerHTML={{ __html: t('homepage.about.bio2') }} />
              <p className="mb-4 text-lg" dangerouslySetInnerHTML={{ __html: t('homepage.about.bio3') }} />
            </div>
            <div className="mt-6">
              <Button href={`/${language}/about`} variant="tertiary" showArrow size="lg" className="px-0">
                {t('common.buttons.readMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Services Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-normal text-blue-500 dark:text-white">{t('homepage.skills.title')}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">{t('homepage.skills.description')}</p>
        </div>
        {/* Skills data is populated from lib/data.tsx - edit that file to customize */}
        <SkillsServicesGrid items={currentSkills} />
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-normal text-blue-500 dark:text-white">{t('homepage.projects.title')}</h2>
          <Button href={`/${language}/projects`} variant="primary" showArrow size="lg">
            {t('common.buttons.viewAll')}
          </Button>
        </div>
        {/* Project data is populated from lib/data.tsx and GitHub API - edit lib/data.tsx to customize */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project: Project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* Blog Preview Section - Client Component */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <ClientBlogSection />
      </section>

      {/* Global CTA Section - CUSTOMIZE: Update with your own call to action */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-16">
        <GlobalCTA 
          title={t('homepage.cta.title')}
          subtitle={t('homepage.cta.subtitle')}
          buttonText={t('homepage.cta.primary')}
          buttonHref={`/${language}/contact`}
          buttonTextSecondary={t('homepage.cta.secondary')}
          buttonHrefSecondary={`/${language}/resume`}
        />
      </div>
    </Layout>
  );
} 
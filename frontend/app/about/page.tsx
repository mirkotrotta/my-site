import { Metadata } from 'next';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import Layout from '@/components/Layout';
import SocialLinks from '@/components/SocialLinks';
import GlobalCTA from '@/components/ui/GlobalCTA';
import ClientBlogSection from '@/app/ClientBlogSection';
import SkillsServicesGrid from '@/components/ui/SkillsServicesGrid';
import { skillsData } from '@/lib/data';
import ButtonGroup from '@/components/ui/ButtonGroup';
import FeatureNormal from '@/components/ui/FeatureNormal';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about our mission, vision, and the technology I use.',
  openGraph: {
    title: 'About Me',
    description: 'Learn more about my mission, vision, and the technology I use.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us',
    description: 'Learn more about my mission, vision, and the technology I use.',
  },
};

export default function AboutPage() {

  return (
    <Layout>
      <div className="py-16">
        <section className="grid grid-cols-1 md:grid-cols-12 items-start gap-8 md:gap-12 mb-20">
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="h-auto md:w-full relative">
              <Image
                src="/images/mirko-trotta-profile-homepage.jpg"
                alt="Profile Picture"
                width={400}
                height={500}
                priority
                className="block w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="text-4xl md:text-5xl font-normal mb-2 text-gray-900 dark:text-white">Mirko Trotta</h1>
            <h2 className="text-xl font-sans font-light text-gray-600 dark:text-gray-400 my-4">Full Stack Developer</h2>
            <SocialLinks className="my-10 md:justify-start" />
            <div className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Full stack developer based near Frankfurt, focused on backend logic, automation, and internal tooling. Experienced across APIs, dashboards, and agent workflows — combining frontend delivery with practical backend systems built from real project needs.              </p>
              <p>
                Previously led digital production for brands like <strong>Pampers</strong>, <strong>Braun</strong>, and <strong>Nestlé</strong> — coordinating UX, content systems, and delivery workflows. That work shaped my engineering mindset: build with purpose, structure, and clarity.
              </p>
              <p>
                I didn't start with a CS degree or a bootcamp. I started with problems to solve — automating workflows, writing small APIs, and building tools that helped teams work faster. Over time, those tools became systems — and the work became development.
              </p>
              <p>
              Currently supporting backend systems and internal tooling at <a href="https://www.santanadigital.de/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">Santana Consulting</a>, a tech partner for fitness brands like <strong>UFC Gym</strong> and <strong>Redfit</strong>.  I also maintain open-source projects like <a href="https://github.com/mirkotrotta/moon-site" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">Moon Site</a> and <a href="https://github.com/mirkotrotta/streamlit_web_scraper" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">Streamlit Scraper</a>, and actively explore AI agent frameworks, cloud automation, and tools that improve developer workflows.
              </p>
            </div>
            <div className="mt-8"></div>
            <ButtonGroup 
              buttons={[
                {
                  text: 'View projects',
                  href: '/projects',
                  variant: 'primary',
                  arrow: true,
                },
                {
                  text: 'Download resume',
                  href: '/resume',
                  variant: 'tertiary',
                  arrow: true,
                },
              ]}
            />
          </div>
        </section>
      
        <div className="py-16 md:py-16">
        <FeatureNormal 
          subtitle="🌍 Multicultural & EU-Eligible"
          title="Italian Citizen, Based in Germany"
          description="Born in Venezuela, now near Frankfurt with Italian citizenship and full EU work rights. Fluent in Spanish, English, and German, and comfortable working across cultures, teams, and systems."
          primaryCtaText="See my resume"
          primaryCtaHref="/resume"
         // secondaryCtaText="Download PDF"
         // secondaryCtaHref="/annual-report.pdf"
          imageSrc="/images/mirko-trotta-profile-aboutpage-developer-with-experience.jpg"
        />
        </div>

      {/* Skills & Services Section */}
      <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-normal text-blue-500 dark:text-white">Core Skills & Tools</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">These are the tools and frameworks I've used across real projects, internal tooling, and open-source development — with a growing focus on automation and cloud architecture.</p>
        </div>
          <SkillsServicesGrid items={skillsData} />
      </section>

              {/* Blog Preview Section - Client Component */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <ClientBlogSection />
        </section>
        </div>

      <div className="-mx-4 sm:-mx-0 md:-mx-8 lg:-mx-12 mb-16">
        <GlobalCTA
          title="Let's connect"
          subtitle="Open to connecting around thoughtful systems, internal tooling, or automation — especially where structure and clarity matter."
          buttonText="Contact Me"
          buttonHref="/contact"
          buttonTextSecondary="Download Resume"
          buttonHrefSecondary="/resume"
          className="bg-gray-100 dark:bg-gray-800"
        />
      </div>
    </Layout>
  );
} 
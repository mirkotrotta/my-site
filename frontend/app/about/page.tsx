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
                Full stack developer based near Frankfurt, focused on backend systems, automation, and modern tooling.
              </p>
              <p>
                I build software with a strong backend core — from clean APIs to lightweight tools that streamline workflows, support research, or integrate services. My work bridges product thinking with technical delivery.
              </p>
              <p>
                At <a href="https://www.santanadigital.de/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">Santana Consulting</a>, I contribute to <strong>product development</strong> for fitness brands like <strong>UFC Gym</strong> and <strong>Redfit</strong> — focusing on <strong>membership systems, frontend enhancements, and low-code platforms</strong>. My work spans from integrating third-party APIs to building UX features and automating flows.
              </p>
              <p>
                I'm hands-on with <strong>cloud platforms (Azure, Vercel, GCP)</strong>, containerization, and dev tools that improve velocity. I actively explore <strong>AI agents, multi-agent frameworks, and scripting automations</strong> to offload repetitive tasks.
              </p>
              <p>
                My toolkit includes <strong>FastAPI, TypeScript, Tailwind, Next.js, and Linux environments</strong> — always aiming to ship clear, scalable solutions.
              </p>
              <p>
                I follow agile delivery practices rooted in <strong>Scrum</strong>, with years of experience coordinating across design, dev, and delivery — always focused on what drives real progress.
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
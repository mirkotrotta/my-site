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
                I’m a full stack developer based near Frankfurt, with a background in design, content, and web development.
              </p>
              <p>
                I started my career building websites with <strong>HTML, CSS, JavaScript</strong>, and <strong>WordPress</strong>, while running a creative studio. I worked closely with small businesses, helping them build an online presence through design, branding, and hands-on development.
              </p>
              <p>
                In 2018, I moved to Germany. I began working in content and digital production roles, eventually stepping into art direction for campaigns across major consumer brands. During that time, I kept growing my tech skills — learning how to build smarter tools and systems, not just visuals.
              </p>
              <p>
                Today, I focus on delivering real product features: <strong>frontend interfaces, membership flows, backend APIs, and automation workflows</strong>. I work with technologies like <strong>Next.js, TypeScript, Tailwind CSS</strong> on the frontend and <strong>Python, FastAPI, PostgreSQL, Docker</strong> on the backend.
              </p>
              <p>
                I’m also getting deeper into <strong>cloud platforms like Azure</strong> and using <strong>GitHub Actions</strong> to support CI/CD and DevOps practices.
              </p>
              <p>
                Outside of work, I explore <strong>AI agent frameworks</strong> and build tools to reduce repetitive tasks and improve workflows — always learning, always refining my craft.
              </p>
              <p>
                I bring 15+ years of cross-disciplinary experience, a strong learning mindset, and a clear goal: to keep growing in software, cloud, and automation — and to build things that make a real difference.
              </p>
            </div>
            <div className="mt-8"></div>
            <ButtonGroup 
              buttons={[
                {
                  text: 'Case Studies',
                  href: '/projects',
                  variant: 'primary',
                  arrow: false,
                },
                {
                  text: 'View Resume',
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
          primaryCtaText="View Resume"
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
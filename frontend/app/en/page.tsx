// Server Component
import GlobalCTA from "@/components/ui/GlobalCTA";
import SkillsServicesGrid from "@/components/ui/SkillsServicesGrid";
import ProjectCard from "@/components/projects/ProjectCard";
import { skillsData, featuredProjects } from "@/lib/data";
import Layout from "@/components/Layout";
import ClientBlogSection from "@/app/ClientBlogSection";
import HeroWithSidebar from "@/components/ui/HeroWithSidebar";
import Button from "@/components/ui/Button";
import { SkillOrService } from "@/lib/data";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
          <HeroWithSidebar
            eyebrowText="React · Python · FastAPI · Docker · AI Workflows"
            title="Full Stack Developer"
            description="I build <strong>fast, maintainable</strong> <strong>web apps</strong>, <strong>APIs</strong>, and <strong>automation flows</strong> using modern tools — focused on <strong>clean code</strong>, <strong>real business logic</strong>, and <strong>production-ready delivery</strong>."
            primaryCta={{ text: "Case Studies", href: "/en/projects" }}
            secondaryCta={{ text: "Download Resume", href: "/en/resume" }}
            imageSrc="/images/mirko trotta, metacubo studio, services germany, development.JPG"
          />
      </section>

      {/* About/Introduction Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="md:grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 mb-8 md:mb-0">
            <div className="relative aspect-auto max-w-sm mx-auto overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src="/images/mirko-trotta-profile-aboutpage.jpg" 
                alt="Profile Image"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-normal mb-4 text-blue-500 dark:text-white">A Different Path Into Development</h2>
            <div className="prose dark:prose-invert">
            <p className="mb-4 text-lg">
              I didn't take the traditional path into tech — no degree, no bootcamp. Just <strong>real work</strong>, curiosity, and persistence.
            </p>
            <p className="mb-4 text-lg">
              After relocating to Germany with my family, I rebuilt my career from the ground up. Learning new tools, adapting to a new country, and transitioning into development taught me how to problem-solve across more than just code.
            </p>
            <p className="mb-4 text-lg">
              Today, that mindset shapes how I approach software: with <strong>structure</strong>, <strong>clarity</strong>, and <strong>long-term thinking</strong>.
            </p>
            </div>
            <div className="mt-6">
              <Button href="/en/about" variant="link" showArrow size="lg" className="px-0">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Services Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-normal text-blue-500 dark:text-white">Core Skills & Tools</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">These are the tools and frameworks I've used across real projects, internal tooling, and open-source development — with a growing focus on automation and cloud architecture.</p>
        </div>
        {/* Skills data is populated from lib/data.tsx - edit that file to customize */}
        <SkillsServicesGrid items={skillsData as SkillOrService[]} />
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-normal text-blue-500 dark:text-white">Featured Projects</h2>
          <Button href="/en/projects" variant="primary" showArrow size="lg">
            View All Projects
          </Button>
        </div>
        {/* Project data is populated from lib/data.tsx and GitHub API - edit lib/data.tsx to customize */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
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
          title="Let's connect"
          subtitle="Open to connecting around thoughtful systems, internal tooling, or automation — especially where structure and clarity matter."
          buttonText="Contact Me"
          buttonHref="/en/contact"
          buttonTextSecondary="View Resume"
          buttonHrefSecondary="/en/resume"
        />
      </div>
    </Layout>
  );
} 
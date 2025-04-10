// Server Component
import Link from "next/link";
import GlobalContainer from "@/components/ui/GlobalContainer";
import GlobalCTA from "@/components/ui/GlobalCTA";
import SkillsServicesGrid from "@/components/ui/SkillsServicesGrid";
import ProjectCard from "@/components/projects/ProjectCard";
import { skillsData, featuredProjects } from "@/lib/data";
import Layout from "@/components/Layout";
import ClientBlogSection from "./ClientBlogSection";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        {/* Background image is optional, fallback to gradient background */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Mirko</h1>
          <p className="text-xl md:text-2xl font-light mb-8">Software Engineer • DevOps Enthusiast • Innovative Developer</p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 px-8 py-3 font-medium hover:bg-blue-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* About/Introduction Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <GlobalContainer>
          <div className="md:grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-4 mb-8 md:mb-0">
              <div className="relative aspect-square max-w-sm mx-auto overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                {/* Profile image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl text-gray-400">👨‍💻</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">About Me</h2>
              <div className="prose dark:prose-invert">
                <p className="mb-4">
                  Hello! I'm a passionate full-stack developer with over 5 years of experience building modern web applications. 
                  I specialize in TypeScript, React, Next.js, Node.js, and Python, with a strong focus on creating clean, maintainable, and scalable code.
                </p>
                <p className="mb-4">
                  My background includes working with startups and enterprise companies, where I've led the development of various web applications, 
                  RESTful APIs, and cloud infrastructure. I'm particularly interested in performance optimization, user experience, and the integration of AI solutions.
                </p>
                <p>
                  When I'm not coding, you can find me contributing to open source projects, writing technical blog posts, or exploring the latest developments in web technology.
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  href="/about" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Learn more about me
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </GlobalContainer>
      </section>

      {/* Skills & Services Section */}
      <section className="py-16">
        <GlobalContainer>
          <div className="grid grid-cols-2 gap-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Skills & Services</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">Explore a range of skills and services that I offer, tailored to meet your project needs.</p>
          </div>
          <SkillsServicesGrid items={skillsData} />
        </GlobalContainer>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <GlobalContainer>
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Featured Projects</h2>
            <Link 
              href="/projects" 
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              View all projects
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </GlobalContainer>
      </section>

      {/* Blog Preview Section - Client Component */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <ClientBlogSection />
      </section>

      {/* Global CTA Section */}
      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-16">
        <GlobalCTA 
          title="Let's Work Together"
          subtitle="Interested in collaborating on a project or have a position that fits my skills? Get in touch and let's discuss how I can help you achieve your goals."
          buttonText="Contact Me"
          buttonHref="/contact"
        />
      </div>
    </Layout>
  );
}

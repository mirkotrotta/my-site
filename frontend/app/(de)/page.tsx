// Server Component
import GlobalCTA from "@/components/ui/GlobalCTA";
import SkillsServicesGrid from "@/components/ui/SkillsServicesGrid";
import ProjectCard from "@/components/projects/ProjectCard";
import { skillsData, featuredProjects } from "@/lib/data";
import Layout from "@/components/Layout";
import ClientBlogSection from "../ClientBlogSection";
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
            title="Full Stack Entwickler"
            description="Ich entwickle <strong>schnelle, wartbare</strong> <strong>Web-Apps</strong>, <strong>APIs</strong> und <strong>Automatisierungs-Workflows</strong> mit modernen Tools — mit Fokus auf <strong>sauberem Code</strong>, <strong>echter Geschäftslogik</strong> und <strong>produktionsreifer Bereitstellung</strong>."
            primaryCta={{ text: "Fallstudien", href: "/projects" }}
            secondaryCta={{ text: "Lebenslauf herunterladen", href: "/resume" }}
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
                alt="Profilbild"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-normal mb-4 text-blue-500 dark:text-white">Ein anderer Weg in die Entwicklung</h2>
            <div className="prose dark:prose-invert">
            <p className="mb-4 text-lg">
              Ich bin keinen traditionellen Weg in die Technikbranche gegangen — kein Studium, kein Bootcamp. Nur <strong>echte Arbeit</strong>, Neugier und Durchhaltevermögen.
            </p>
            <p className="mb-4 text-lg">
              Nach meinem Umzug nach Deutschland mit meiner Familie baute ich meine Karriere von Grund auf neu auf. Neue Tools zu erlernen, mich an ein neues Land anzupassen und in die Entwicklung zu wechseln, lehrte mich, über den Code hinaus Probleme zu lösen.
            </p>
            <p className="mb-4 text-lg">
              Heute prägt diese Denkweise meinen Umgang mit Software: mit <strong>Struktur</strong>, <strong>Klarheit</strong> und <strong>langfristigem Denken</strong>.
            </p>
            </div>
            <div className="mt-6">
              <Button href="/about" variant="link" showArrow size="lg" className="px-0">
                Mehr erfahren
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Services Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-normal text-blue-500 dark:text-white">Kernkompetenzen & Tools</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">Dies sind die Tools und Frameworks, die ich in realen Projekten, internen Tools und Open-Source-Entwicklung eingesetzt habe — mit zunehmendem Fokus auf Automatisierung und Cloud-Architektur.</p>
        </div>
        {/* Skills data is populated from lib/data.tsx - edit that file to customize */}
        <SkillsServicesGrid items={skillsData as SkillOrService[]} />
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-normal text-blue-500 dark:text-white">Ausgewählte Projekte</h2>
          <Button href="/projects" variant="primary" showArrow size="lg">
            Alle Projekte ansehen
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
          title="Lass uns verbinden"
          subtitle="Offen für Austausch zu durchdachten Systemen, internen Tools oder Automatisierung — besonders dort, wo Struktur und Klarheit wichtig sind."
          buttonText="Kontaktiere mich"
          buttonHref="/contact"
          buttonTextSecondary="Lebenslauf ansehen"
          buttonHrefSecondary="/resume"
        />
      </div>
    </Layout>
  );
} 
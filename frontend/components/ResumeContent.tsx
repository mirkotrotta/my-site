"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProfileCard from "@/components/ui/ProfileCard";
import ProjectCard, { Project } from "@/components/projects/ProjectCard";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

interface Profile {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio: string;
  github: string;
  dob: string;
  pob: string;
  marital_status: string;
  nationality: string;
}

interface ExperienceEntry {
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  description: string[];
  location: string;
}

interface AdditionalExperienceEntry {
  company: string;
  title: string;
  years: string;
  description?: string[];
}

interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
  focus?: string[];
}

interface CertificationEntry {
  name: string;
  status: string;
  notes?: string[];
}

interface Skills {
  frontend: string[][];
  backend: string[][];
  database: string[][];
  automation: string[][];
  tools_systems: string[][];
}

interface LanguageEntry {
  language: string;
  level: string;
}

interface ProjectEntry {
  name: string;
  description: string[];
  github: string;
  stack: string;
}

interface ResumeData {
  profile: Profile;
  professional_profile: string;
  professional_experience: ExperienceEntry[];
  additional_experience: AdditionalExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  skills: Skills;
  languages: LanguageEntry[];
  projects: ProjectEntry[];
}

interface ResumeContentProps {
  language: 'en' | 'de';
}

export default function ResumeContent({ language }: ResumeContentProps) {
  const { t } = useTranslation();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    // Try to fetch from the API first
    fetch("/api/resume")
      .then((res) => {
        if (!res.ok) throw new Error(t('resume.errors.fetchFailed'));
        return res.json();
      })
      .then((data: ResumeData) => {
        setResume(data);
      })
      .catch((err) => {
        console.warn("API fetch failed, using placeholder data:", err.message);
        
        // Fallback to placeholder data when API is not available
        const placeholderData: ResumeData = {
          profile: {
            name: "Mirko Trotta",
            location: "Munich, Germany",
            phone: "+49 123 456789",
            email: "contact@mirkotrotta.com",
            linkedin: "linkedin.com/in/mirkotrotta",
            portfolio: "mirkotrotta.com",
            github: "github.com/mirkotrotta",
            dob: "01.01.1990",
            pob: "Munich",
            marital_status: "Single",
            nationality: "German"
          },
          professional_profile: language === 'en' ? 
            "Full Stack Developer with expertise in modern web technologies, backend systems, and automation." :
            "Full Stack Entwickler mit Expertise in modernen Webtechnologien, Backend-Systemen und Automatisierung.",
          professional_experience: [
            {
              company: "Tech Company",
              title: language === 'en' ? "Senior Full Stack Developer" : "Senior Full Stack Entwickler",
              start_date: "2020",
              end_date: language === 'en' ? "Present" : "Heute",
              description: language === 'en' ? 
                ["Developed and maintained web applications using React and Node.js",
                 "Implemented CI/CD pipelines for automated testing and deployment",
                 "Mentored junior developers and led technical discussions"] :
                ["Entwicklung und Wartung von Webanwendungen mit React und Node.js",
                 "Implementierung von CI/CD-Pipelines für automatisierte Tests und Bereitstellung",
                 "Mentoring für Junior-Entwickler und Leitung technischer Diskussionen"],
              location: "München, Deutschland"
            }
          ],
          additional_experience: [],
          education: [
            {
              institution: language === 'en' ? "Technical University of Munich" : "Technische Universität München",
              degree: language === 'en' ? "Bachelor of Science in Computer Science" : "Bachelor of Science in Informatik",
              year: "2015",
              focus: language === 'en' ? 
                ["Software Engineering", "Web Development", "Database Systems"] :
                ["Software Engineering", "Webentwicklung", "Datenbanksysteme"]
            }
          ],
          certifications: [],
          skills: {
            frontend: [["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"]],
            backend: [["Node.js", "Express", "Python", "Django", "API Design"]],
            database: [["MongoDB", "PostgreSQL", "MySQL", "Redis"]],
            automation: [["GitHub Actions", "Jenkins", "Docker", "Kubernetes"]],
            tools_systems: [["Git", "VS Code", "Linux", "Windows", "MacOS"]]
          },
          languages: [
            { language: language === 'en' ? "German" : "Deutsch", level: language === 'en' ? "Native" : "Muttersprache" },
            { language: language === 'en' ? "English" : "Englisch", level: language === 'en' ? "Fluent" : "Fließend" }
          ],
          projects: []
        };
        setResume(placeholderData);
      })
      .finally(() => setLoading(false));
  }, [t, language]);

  useEffect(() => {
    // Try to fetch from the API first
    fetch("/api/github")
      .then((res) => {
        if (!res.ok) throw new Error(t('resume.errors.projectsFetchFailed'));
        return res.json();
      })
      .then((data: Project[]) => setGithubProjects(data))
      .catch((err) => {
        console.warn("GitHub API fetch failed:", err.message);
        
        // Fallback to placeholder projects when API is not available
        const placeholderProjects: Project[] = [
          {
            name: "Personal Website",
            description: language === 'en' ? "My personal portfolio built with Next.js and Tailwind CSS" : "Meine persönliche Website mit Next.js und Tailwind CSS",
            url: "https://github.com/mirkotrotta/personal-website",
            stars: 5,
            updated: "2023-05-15T10:00:00Z",
            language: "TypeScript",
            topics: ["next-js", "react", "typescript", "tailwind-css"]
          },
          {
            name: "API Backend",
            description: language === 'en' ? "REST API service built with Node.js and Express" : "REST-API-Dienst entwickelt mit Node.js und Express",
            url: "https://github.com/mirkotrotta/api-backend",
            stars: 3,
            updated: "2023-04-22T14:30:00Z",
            language: "JavaScript",
            topics: ["node-js", "express", "rest-api", "mongodb"]
          },
          {
            name: "Data Visualization Tool",
            description: language === 'en' ? "Interactive dashboard for data visualization" : "Interaktives Dashboard zur Datenvisualisierung",
            url: "https://github.com/mirkotrotta/data-viz",
            stars: 7,
            updated: "2023-06-10T09:15:00Z",
            language: "JavaScript",
            topics: ["d3-js", "react", "data-visualization", "dashboard"]
          }
        ];
        setGithubProjects(placeholderProjects);
      })
      .finally(() => setProjectsLoading(false));
  }, [t, language]);

  if (loading) return <p className="text-sm text-blue-500">{t('common.loading')}</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!resume) return null;

  return (
    <Layout>
      <div className="my-16 grid grid-cols-1 md:grid-cols-8 gap-16 max-w-full mx-auto">
        {/* Left: Profile Card */}
        <div className="md:col-span-2 flex md:block justify-center">
          <div className="md:sticky md:top-16 w-full flex flex-col justify-center md:justify-start">
            {/* Pass profile as prop if ProfileCard supports it, else keep as is */}
            <ProfileCard profile={resume.profile} />
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col space-y-4">
              <a 
                href="#" // Update with actual PDF download link when available
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('resume.download')}
              </a>
              
              <Link 
                href={`/${language}/contact`}
                className="inline-flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('common.buttons.contact')}
              </Link>
            </div>
          </div>
        </div>
        {/* Right: Resume Sections */}
        <div className="md:col-span-6 space-y-12">
          {/* 1. Professional Profile */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.profile')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200">{resume.professional_profile}</p>
          </section>
          {/* 2. Professional Experience */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.experience')}</h2>
            <div className="space-y-8">
              {resume.professional_experience.map((entry, idx) => (
                <div key={idx} className="border-l border-gray-400 dark:border-gray-600 pl-6 relative">
                  <div className="absolute top-1 left-0 w-3 h-3 bg-blue-500 dark:bg-gray-300 -ml-1.5" />
                  <h3 className="text-xl font-normal text-blue-600 dark:text-blue-400 leading-snug">
                    {entry.title} @ {entry.company}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {entry.start_date} - {entry.end_date ?? t('resume.present')}
                  </p>
                  {/* Description as bullet points */}
                  <ul className="list-disc pl-5 mt-2 text-lg text-gray-700 dark:text-gray-200">
                    {entry.description?.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                  <p className="text-sm text-gray-500 italic mt-1">{entry.location}</p>
                </div>
              ))}
            </div>
          </section>
          {/* 3. Additional Experience */}
          <section>
            <h2 className="text-lg font-normal mb-2">{t('resume.sections.additionalExperience')}</h2>
            <ul className="list-disc pl-6">
              {resume.additional_experience.map((entry, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{entry.title}</span>{entry.company} {entry.years}
                  {entry.description && (
                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 dark:text-gray-200">
                      {entry.description.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 4. Education */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.education')}</h2>
            <ul>
              {resume.education.map((entry, idx) => (
                <li key={idx}>
                  <span className="font-normal text-lg">{entry.institution}</span> – {entry.degree} ({entry.year})
                  {entry.focus && (
                    <ul className="list-disc pl-5 mt-2 text-lg text-gray-700 dark:text-gray-200">
                      {entry.focus.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 5. Certifications & Continuing Education */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.certifications')}</h2>
            <ul>
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-normal text-lg">{cert.name}</span> {cert.status && <>({cert.status})</>}
                  {cert.notes && (
                    <ul className="list-disc pl-5 mt-2 text-lg text-gray-700 dark:text-gray-200">
                      {cert.notes.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 6. Skills & Competencies */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.skills')}</h2>
            <div className="mb-6">
              <h3 className="text-lg font-normal mt-2 mb-1">{t('resume.skills.frontend')}</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.frontend.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.backend')}</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.backend.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.database')}</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.database.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.automation')}</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.automation.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.tools')}</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.tools_systems.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
            </div>
          </section>
          {/* 7. Languages */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.languages')}</h2>
            <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
              {resume.languages.map((lang, idx) => (
                <li key={idx}>
                  <strong>{lang.language}</strong>: {lang.level}
                </li>
              ))}
            </ul>
          </section>
          {/* 8. Projects */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.projects')}</h2>
            
            {projectsLoading && <p className="text-sm text-gray-500">{t('common.loading')}</p>}
            {projectsError && <p className="text-sm text-red-600">{projectsError}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {githubProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 
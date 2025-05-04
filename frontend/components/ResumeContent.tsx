"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProfileCard from "@/components/ui/ProfileCard";
import ProjectCard, { Project } from "@/components/projects/ProjectCard";
import useTranslation from "@/hooks/useTranslation";

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
  education: EducationEntry[];
  certifications: CertificationEntry[];
  skills: Skills;
  languages: LanguageEntry[];
  projects: ProjectEntry[];
}

interface ResumeContentProps {
  language: 'en' | 'de';
}

// Helper function to safely render HTML content
const HTMLContent = ({ content }: { content: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default function ResumeContent({ language: initialLanguage }: ResumeContentProps) {
  const { t, language } = useTranslation();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const apiUrl = `/api/resume/?lang=${language}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`API fetch failed: ${res.statusText}`);
        return res.json();
      })
      .then((data: ResumeData) => {
        setResume(data);
      })
      .catch((err) => {
        console.error("Error fetching resume data:", err);
        setError(t('resume.errors.fetchFailed'));
        setResume(null);
      })
      .finally(() => setLoading(false));
  }, [t, language]);

  useEffect(() => {
    setProjectsLoading(true);
    setProjectsError(null);
    fetch("/api/github/")
      .then((res) => {
        if (!res.ok) throw new Error(t('resume.errors.projectsFetchFailed'));
        return res.json();
      })
      .then((data: Project[]) => setGithubProjects(data))
      .catch((err) => {
        console.warn("GitHub API fetch failed:", err.message);
        setProjectsError(t('resume.errors.projectsFetchFailed'));
        setGithubProjects([]);
      })
      .finally(() => setProjectsLoading(false));
  }, [t]);

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
            {/* Removed Download and Contact buttons as per requirements */}
          </div>
        </div>
        {/* Right: Resume Sections */}
        <div className="md:col-span-6 space-y-12">
          {/* 1. Professional Profile */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.profile')}</h2>
            <div className="text-lg text-gray-700 dark:text-gray-200">
              <HTMLContent content={resume.professional_profile} />
            </div>
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
                    {entry.start_date} - {entry.end_date === 'Present' ? t('resume.present') : entry.end_date}
                  </p>
                  {/* Description as bullet points */}
                  <ul className="list-disc pl-5 mt-2 text-lg text-gray-700 dark:text-gray-200">
                    {entry.description?.map((point, i) => (
                      <li key={i}><HTMLContent content={point} /></li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 italic mt-1">{entry.location}</p>
                </div>
              ))}
            </div>
          </section>
          {/* 4. Education */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.education')}</h2>
            <ul className="space-y-4">
              {resume.education.map((entry, idx) => (
                <li key={idx} className="mb-2">
                  <h3 className="text-lg font-normal">{entry.institution}</h3>
                  <p className="text-md text-gray-700 dark:text-gray-200">
                    {entry.degree} ({entry.year})
                  </p>
                  {entry.focus && entry.focus.length > 0 && (
                    <ul className="list-disc pl-5 mt-2 text-md text-gray-700 dark:text-gray-200">
                      {entry.focus.map((point, i) => (
                        <li key={i}><HTMLContent content={point} /></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 5. Certifications & Continuing Education */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.certifications')}</h2>
            <ul className="space-y-4">
              {resume.certifications.map((cert, idx) => (
                <li key={idx} className="mb-2">
                  <h3 className="text-lg font-normal">{cert.name} {cert.status && <span className="font-normal">({cert.status})</span>}</h3>
                  {cert.notes && cert.notes.length > 0 && (
                    <div className="pl-5 mt-2 text-md text-gray-700 dark:text-gray-200">
                      {cert.notes.map((note, i) => (
                        <div key={i}><HTMLContent content={note} /></div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 6. Skills & Competencies */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.skills')}</h2>
            <div className="mb-6">
              {resume.skills.frontend.length > 0 && (
                <>
                  <h3 className="text-lg font-normal mt-2 mb-1">{t('resume.skills.frontend')}</h3>
                  <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                    {resume.skills.frontend.map((group, idx) => (
                      <li key={idx}>
                        <HTMLContent content={group.join(", ")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {resume.skills.backend.length > 0 && (
                <>
                  <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.backend')}</h3>
                  <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                    {resume.skills.backend.map((group, idx) => (
                      <li key={idx}>
                        <HTMLContent content={group.join(", ")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {resume.skills.database.length > 0 && (
                <>
                  <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.database')}</h3>
                  <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                    {resume.skills.database.map((group, idx) => (
                      <li key={idx}>
                        <HTMLContent content={group.join(", ")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {resume.skills.automation.length > 0 && (
                <>
                  <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.automation')}</h3>
                  <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                    {resume.skills.automation.map((group, idx) => (
                      <li key={idx}>
                        <HTMLContent content={group.join(", ")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {resume.skills.tools_systems.length > 0 && (
                <>
                  <h3 className="text-lg font-normal mt-4 mb-1">{t('resume.skills.tools')}</h3>
                  <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                    {resume.skills.tools_systems.map((group, idx) => (
                      <li key={idx}>
                        <HTMLContent content={group.join(", ")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
          {/* 7. Languages */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.languages')}</h2>
            <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
              {resume.languages.map((lang, idx) => (
                <li key={idx}>
                  <HTMLContent content={`<strong>${lang.language}</strong>: ${lang.level}`} />
                </li>
              ))}
            </ul>
          </section>
          {/* 8. Projects - Consolidated section */}
          <section>
            <h2 className="text-2xl font-normal mb-2">{t('resume.sections.projects')}</h2>
            
            {projectsLoading && <p className="text-sm text-gray-500">{t('common.loading')}</p>}
            {projectsError && <p className="text-sm text-red-600">{projectsError}</p>}
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              {resume.projects.map((project, idx) => {
                // Find matching GitHub project if available
                const githubMatch = githubProjects.find(
                  (gp) => gp.name.toLowerCase() === project.name.toLowerCase() 
                         || (project.github && gp.url === project.github)
                );
                
                return (
                  <div key={idx} className="border p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      <h3 className="text-xl font-normal">
                        {project.name}
                      </h3>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" 
                           className="mt-2 md:mt-0 text-blue-500 hover:text-blue-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">{project.stack}</p>
                    
                    {project.description.length > 0 && (
                      <div className="text-md text-gray-700 dark:text-gray-200 mb-4">
                        {project.description.map((desc, i) => (
                          <div key={i}><HTMLContent content={desc} /></div>
                        ))}
                      </div>
                    )}
                    
                    {/* Include GitHub stats if available */}
                    {githubMatch && (
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600 dark:text-gray-300">
                        {githubMatch.language && (
                          <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                            {githubMatch.language}
                          </span>
                        )}
                        {githubMatch.stars > 0 && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {githubMatch.stars}
                          </span>
                        )}
                        {githubMatch.updated && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(githubMatch.updated).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 
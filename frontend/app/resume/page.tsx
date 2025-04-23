"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProfileCard from "@/components/ui/ProfileCard";
import ProjectCard, { Project } from "@/components/projects/ProjectCard";
// import Skills from "@/components/ui/Skills"; // Uncomment if you have this
// import Projects from "@/components/ui/Projects"; // Uncomment if you have this

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
  frontend_development: string[][];
  backend_systems: string[][];
  databases_devops: string[][];
  automation_ai: string[][];
  developer_environments_tooling: string[][];
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

export default function ResumePage() {
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
    fetch("http://localhost:8000/api/resume/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch resume");
        return res.json();
      })
      .then((data: ResumeData) => setResume(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/github/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data: Project[]) => setGithubProjects(data))
      .catch((err) => setProjectsError(err.message))
      .finally(() => setProjectsLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-blue-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!resume) return null;

  return (
    <Layout>
      {/* <h1 className="text-3xl font-normal text-gray-900 dark:text-white pb-2 my-8">
        Curriculum Vitae
      </h1> */}

      <div className="my-16 grid grid-cols-1 md:grid-cols-8 gap-16 max-w-full mx-auto">
        {/* Left: Profile Card */}
        <div className="md:col-span-2 flex md:block justify-center">
          <div className="md:sticky md:top-16 w-full flex justify-center md:justify-start">
            {/* Pass profile as prop if ProfileCard supports it, else keep as is */}
            <ProfileCard profile={resume.profile} />
          </div>
        </div>
        {/* Right: Resume Sections */}
        <div className="md:col-span-6 space-y-12">
          {/* 1. Professional Profile */}
          <section>
            <h2 className="text-2xl font-normal mb-2">Professional Profile</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200">{resume.professional_profile}</p>
          </section>
          {/* 2. Professional Experience */}
          <section>
            <h2 className="text-2xl font-normal mb-2">Professional Experience</h2>
            <div className="space-y-8">
              {resume.professional_experience.map((entry, idx) => (
                <div key={idx} className="border-l border-gray-400 dark:border-gray-600 pl-6 relative">
                  <div className="absolute top-1 left-0 w-3 h-3 bg-blue-500 dark:bg-gray-300 -ml-1.5" />
                  <h3 className="text-xl font-normal text-blue-600 dark:text-blue-400 leading-snug">
                    {entry.title} @ {entry.company}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {entry.start_date} - {entry.end_date ?? "Present"}
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
            <h2 className="text-lg font-normal mb-2">Additional Experience</h2>
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
            <h2 className="text-2xl font-normal mb-2">Education</h2>
            <ul>
              {resume.education.map((entry, idx) => (
                <li key={idx}>
                  <span className="font-normal text-sm">{entry.institution}</span> – {entry.degree} ({entry.year})
                  {entry.focus && (
                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 dark:text-gray-200">
                      {entry.focus.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 5. Certifications & Continuing Education */}
          <section>
            <h2 className="text-2xl font-normal mb-2">Certifications & Continuing Education</h2>
            <ul>
              {resume.certifications.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-normal text-sm">{cert.name}</span> {cert.status && <>({cert.status})</>}
                  {cert.notes && (
                    <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 dark:text-gray-200">
                      {cert.notes.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {/* 6. Skills & Competencies */}
          <section>
            <h2 className="text-2xl font-normal mb-2">Skills & Competencies</h2>
            <div className="mb-6">
              <h3 className="text-lg font-normal text-blue-600 dark:text-blue-400 mt-2 mb-1">Frontend Development</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.frontend_development.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal text-blue-600 dark:text-blue-400 mt-4 mb-1">Backend Systems</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.backend_systems.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal text-blue-600 dark:text-blue-400 mt-4 mb-1">Databases & DevOps</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.databases_devops.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal text-blue-600 dark:text-blue-400 mt-4 mb-1">Automation & AI</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.automation_ai.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
              <h3 className="text-lg font-normal text-blue-600 dark:text-blue-400 mt-4 mb-1">Developer Environments & Tooling</h3>
              <ul className="list-disc pl-5 text-lg text-gray-700 dark:text-gray-200">
                {resume.skills.developer_environments_tooling.map((group, idx) => (
                  <li key={idx}>{group.join(", ")}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-normal mb-2 text-gray-700 dark:text-gray-200">Languages</h3>
              <ul className="space-y-2">
                {resume.languages.map((lang, idx) => (
                  <li key={idx} className="flex flex-col items-start">
                    <span className="font-normal text-lg text-gray-700 dark:text-gray-200">{lang.language}</span>
                    <span className="text-sm text-blue-500 dark:text-gray-400">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* 7. Projects & Open Source */}
          <section>
            <h2 className="text-2xl font-normal mb-6">Projects & Open Source</h2>
            {projectsLoading && <p className="text-sm text-blue-500">Loading projects...</p>}
            {projectsError && <p className="text-sm text-red-600">{projectsError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {githubProjects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

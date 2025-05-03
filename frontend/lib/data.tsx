import React from 'react';
import { 
  SiReact, 
  SiPython, 
  SiPostgresql, 
  SiDocker, 
  SiGithub, 
  SiOpenai, 
  SiFastapi, 
  SiVercel 
} from 'react-icons/si';
import { GiArtificialIntelligence } from 'react-icons/gi'; // fallback for AI
import { FaGitAlt } from 'react-icons/fa';
import { VscAzure } from 'react-icons/vsc'; // Azure alt
import { BsStack } from 'react-icons/bs'; // Next Stack Goals
import { TbDatabaseCog } from 'react-icons/tb'; // Advanced DB icon

// Define the Project interface locally to avoid import issues
export interface Project {
  name: string;
  description: string;
  url: string;
  stars: number;
  updated: string;
  language: string | null;
  topics?: string[];
}

export type SkillOrService = {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
};

// Define translations for client and server use
const translations = {
  en: {
    skills: {
      frontend: {
        title: 'Frontend Development',
        description: 'Building responsive web applications using React, Next.js, and modern CSS frameworks'
      },
      backend: {
        title: 'Backend Development',
        description: 'Creating robust APIs with Python, FastAPI, and Node.js'
      },
      database: {
        title: 'Database Design',
        description: 'Designing efficient database schemas and query optimization'
      },
      ai: {
        title: 'AI Integration',
        description: 'Implementing AI features using OpenAI, Hugging Face, and custom models'
      },
      containerization: {
        title: 'Containerization',
        description: 'Docker and container orchestration for reliable deployments'
      },
      cicd: {
        title: 'CI/CD',
        description: 'Automated testing and deployment pipelines with GitHub Actions'
      },
      versionControl: {
        title: 'Version Control',
        description: 'Git workflow management and collaboration strategies'
      },
      nextGoals: {
        title: 'Cloud Services',
        description: 'Azure, AWS, and other cloud infrastructure management'
      }
    },
    projects: {
      moonSite: {
        name: 'Moon Site Template',
        description: 'A Next.js and FastAPI boilerplate for creating modern web applications'
      },
      webScraper: {
        name: 'Streamlit Web Scraper',
        description: 'A user-friendly tool for scraping websites and converting content to markdown'
      },
      dropboxConverter: {
        name: 'Dropbox URL Converter',
        description: 'Utility for converting Dropbox links to direct download URLs'
      }
    }
  },
  de: {
    skills: {
      frontend: {
        title: 'Frontend-Entwicklung',
        description: 'Entwicklung responsiver Webanwendungen mit React, Next.js und modernen CSS-Frameworks'
      },
      backend: {
        title: 'Backend-Entwicklung',
        description: 'Erstellung robuster APIs mit Python, FastAPI und Node.js'
      },
      database: {
        title: 'Datenbankdesign',
        description: 'Entwurf effizienter Datenbankschemata und Optimierung von Abfragen'
      },
      ai: {
        title: 'KI-Integration',
        description: 'Implementierung von KI-Funktionen mit OpenAI, Hugging Face und benutzerdefinierten Modellen'
      },
      containerization: {
        title: 'Containerisierung',
        description: 'Docker und Container-Orchestrierung für zuverlässige Bereitstellungen'
      },
      cicd: {
        title: 'CI/CD',
        description: 'Automatisierte Test- und Deployment-Pipelines mit GitHub Actions'
      },
      versionControl: {
        title: 'Versionskontrolle',
        description: 'Git-Workflow-Management und Kollaborationsstrategien'
      },
      nextGoals: {
        title: 'Cloud-Dienste',
        description: 'Azure, AWS und andere Cloud-Infrastrukturverwaltung'
      }
    },
    projects: {
      moonSite: {
        name: 'Moon Site Vorlage',
        description: 'Eine Next.js- und FastAPI-Vorlage für die Erstellung moderner Webanwendungen'
      },
      webScraper: {
        name: 'Streamlit Web Scraper',
        description: 'Ein benutzerfreundliches Tool zum Scrapen von Websites und Konvertieren von Inhalten in Markdown'
      },
      dropboxConverter: {
        name: 'Dropbox URL Konverter',
        description: 'Dienstprogramm zum Konvertieren von Dropbox-Links in direkte Download-URLs'
      }
    }
  }
};

// Client-side translation function that accepts a language parameter
export const getSkillsData = (lang: 'en' | 'de' = 'en'): SkillOrService[] => {
  // Use the language parameter to select the appropriate translations
  const currentTranslations = translations[lang];
  
  return [
    {
      title: currentTranslations.skills.frontend.title,
      description: currentTranslations.skills.frontend.description,
      icon: <SiReact size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.backend.title,
      description: currentTranslations.skills.backend.description,
      icon: <SiPython size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.database.title,
      description: currentTranslations.skills.database.description,
      icon: <TbDatabaseCog size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.ai.title,
      description: currentTranslations.skills.ai.description,
      icon: <SiOpenai size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.containerization.title,
      description: currentTranslations.skills.containerization.description,
      icon: <SiDocker size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.cicd.title,
      description: currentTranslations.skills.cicd.description,
      icon: <SiGithub size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.versionControl.title,
      description: currentTranslations.skills.versionControl.description,
      icon: <FaGitAlt size={36} />,
      url: '/resume'
    },
    {
      title: currentTranslations.skills.nextGoals.title,
      description: currentTranslations.skills.nextGoals.description,
      icon: <VscAzure size={36} />,
      url: '/resume'
    }
  ];
};

// Client-side function to get translated featured projects with language parameter
export const getFeaturedProjects = (lang: 'en' | 'de' = 'en'): Project[] => {
  // Use the language parameter to select the appropriate translations
  const currentTranslations = translations[lang];
  
  return [
    {
      name: currentTranslations.projects.moonSite.name,
      description: currentTranslations.projects.moonSite.description,
      url: 'https://github.com/mirkotrotta/moon-site',
      stars: 87,
      updated: '2024-12-01T12:00:00Z',
      language: 'TypeScript',
      topics: ['next.js', 'fastapi', 'portfolio', 'boilerplate', 'docker']
    },
    {
      name: currentTranslations.projects.webScraper.name,
      description: currentTranslations.projects.webScraper.description,
      url: 'https://github.com/mirkotrotta/streamlit_web_scraper',
      stars: 68,
      updated: '2023-11-15T09:15:00Z',
      language: 'Python',
      topics: ['streamlit', 'scraper', 'markdown', 'selenium', 'sqlite']
    },
    {
      name: currentTranslations.projects.dropboxConverter.name,
      description: currentTranslations.projects.dropboxConverter.description,
      url: 'https://github.com/mirkotrotta/dropbox-url-converter',
      stars: 24,
      updated: '2024-07-20T10:00:00Z',
      language: 'TypeScript',
      topics: ['next.js', 'dropbox', 'markdown', 'vercel', 'utility']
    }
  ];
};

// Multilingual data exports
export const skillsData = {
  en: getSkillsData('en'),
  de: getSkillsData('de'),
};

export const featuredProjects = {
  en: getFeaturedProjects('en'),
  de: getFeaturedProjects('de'),
}; 
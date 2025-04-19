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

// CUSTOMIZE: Update these skills with your own expertise and descriptions
export const skillsData: SkillOrService[] = [
  {
    title: 'Frontend Development',
    description: 'Build accessible, component-based UIs using React, Next.js, Tailwind CSS, and TypeScript — focused on clarity, performance, and reuse.',
    icon: <SiReact size={36} />,
    url: '/resume'
  },
  {
    title: 'Backend Development',
    description: 'Create async APIs with FastAPI, Python, and Pydantic — used in web projects, data flows, and microservices.',
    icon: <SiPython size={36} />,
    url: '/resume'
  },
  {
    title: 'Database & Storage',
    description: 'Use PostgreSQL and SQLite for structured persistence — applied in dashboards, content tools, and automation pipelines.',
    icon: <TbDatabaseCog size={36} />,
    url: '/resume'
  },
  {
    title: 'AI & Automation',
    description: 'Build agent workflows using CrewAI, LangChain, OpenAI, and MCP servers — applied in research tools and workplace automations.',
    icon: <SiOpenai size={36} />,
    url: '/resume'
  },
  {
    title: 'Containerization',
    description: 'Set up consistent environments with Docker for reproducible dev and small-scale deployment.',
    icon: <SiDocker size={36} />,
    url: '/resume'
  },
  {
    title: 'CI/CD & Deployment',
    description: 'Automate builds using GitHub Actions and deploy to Vercel or Azure Static Web Apps (in progress).',
    icon: <SiGithub size={36} />,
    url: '/resume'
  },
  {
    title: 'Version Control',
    description: 'Apply structured Git workflows with semantic commits, branching, and PR reviews — used in team and solo projects.',
    icon: <FaGitAlt size={36} />,
    url: '/resume'
  },
  {
    title: 'Next Stack Goals',
    description: 'Expanding into cloud infrastructure, CI/CD pipelines, and planning next certifications beyond AZ-900.',
    icon: <VscAzure size={36} />,
    url: '/resume'
  }
];

// Projects will also be populated from the GitHub API if you set up the backend, for now are just feature examples
export const featuredProjects: Project[] = [
    {
      name: 'Moon Site — Full Stack Portfolio Boilerplate',
      description: 'A monorepo boilerplate for full stack portfolios using Next.js, Tailwind CSS, MDX, and a lightweight FastAPI backend — supports GitHub API integration, Markdown-first publishing, and Dockerized deployment.',
      url: 'https://github.com/mirkotrotta/moon-site',
      stars: 87, // update if needed
      updated: '2024-12-01T12:00:00Z', // adjust to real updated_at if available
      language: 'TypeScript',
      topics: ['next.js', 'fastapi', 'portfolio', 'boilerplate', 'docker']
    },
    {
      name: 'Streamlit Web Scraper — Markdown Research Tool',
      description: 'Python-based tool that extracts web content into clean Markdown — using Streamlit, Selenium, and BeautifulSoup. Includes SQLite logging and Slack integration (WIP). Built for structured research capture.',
      url: 'https://github.com/mirkotrotta/streamlit_web_scraper',
      stars: 68, // estimate or use real value
      updated: '2023-11-15T09:15:00Z',
      language: 'Python',
      topics: ['streamlit', 'scraper', 'markdown', 'selenium', 'sqlite']
    },
    {
      name: 'Dropbox URL Converter — Embeddable Video Links',
      description: 'A small utility to convert Dropbox URLs into embeddable formats for markdown publishing. Built with Next.js, deployed to Vercel, and designed to simplify content workflows.',
      url: 'https://github.com/mirkotrotta/dropbox-url-converter',
      stars: 24, // estimated or fetch live
      updated: '2024-07-20T10:00:00Z',
      language: 'TypeScript',
      topics: ['next.js', 'dropbox', 'markdown', 'vercel', 'utility']
    }
]; 
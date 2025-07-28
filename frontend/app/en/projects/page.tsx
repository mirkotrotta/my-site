import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata: Metadata = {
  title: 'Projects | Mirko Trotta',
  description: 'Explore a collection of my recent projects, including web applications, APIs, and automation tools. See my work with React, Next.js, FastAPI, and modern web technologies.',
  keywords: ['Projects', 'Web Development', 'React', 'Next.js', 'FastAPI', 'Python', 'Portfolio', 'Web Applications'],
  openGraph: {
    title: 'Projects | Mirko Trotta',
    description: 'Explore a collection of my recent projects, including web applications, APIs, and automation tools. See my work with React, Next.js, FastAPI, and modern web technologies.',
    type: 'website',
    locale: 'en_US',
    url: 'https://mirkotrotta.com/en/projects',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-aboutpage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Mirko Trotta',
    description: 'Explore a collection of my recent projects, including web applications, APIs, and automation tools.',
    images: ['/images/mirko-trotta-profile-aboutpage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/en/projects',
    languages: {
      'de': 'https://mirkotrotta.com/de/projects',
    },
  },
};

export default function ProjectsPage() {
  return <ProjectsContent language="en" />;
} 
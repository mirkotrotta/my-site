import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata: Metadata = {
  title: 'Projekte | Mirko Trotta',
  description: 'Entdecken Sie eine Sammlung meiner neuesten Projekte, darunter Webanwendungen, APIs und Automatisierungstools. Sehen Sie meine Arbeit mit React, Next.js, FastAPI und modernen Webtechnologien.',
  keywords: ['Projekte', 'Webentwicklung', 'React', 'Next.js', 'FastAPI', 'Python', 'Portfolio', 'Webanwendungen'],
  openGraph: {
    title: 'Projekte | Mirko Trotta',
    description: 'Entdecken Sie eine Sammlung meiner neuesten Projekte, darunter Webanwendungen, APIs und Automatisierungstools. Sehen Sie meine Arbeit mit React, Next.js, FastAPI und modernen Webtechnologien.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://mirkotrotta.com/de/projects',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-aboutpage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta Projekte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projekte | Mirko Trotta',
    description: 'Entdecken Sie eine Sammlung meiner neuesten Projekte, darunter Webanwendungen, APIs und Automatisierungstools.',
    images: ['/images/mirko-trotta-profile-aboutpage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/de/projects',
    languages: {
      'en': 'https://mirkotrotta.com/en/projects',
    },
  },
};

export default function ProjectsPage() {
  return <ProjectsContent language="de" />;
} 
import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata: Metadata = {
  title: 'Projects | Mirko Trotta',
  description: 'Explore a collection of my recent projects, including web applications, APIs, and automation tools.'
};

export default function ProjectsPage() {
  return <ProjectsContent language="en" />;
} 
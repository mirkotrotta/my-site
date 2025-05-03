import { Metadata } from 'next';
import ProjectsContent from '@/components/ProjectsContent';

export const metadata: Metadata = {
  title: 'Projekte | Mirko Trotta',
  description: 'Entdecken Sie eine Sammlung meiner neuesten Projekte, darunter Webanwendungen, APIs und Automatisierungstools.'
};

export default function ProjectsPage() {
  return <ProjectsContent language="de" />;
} 
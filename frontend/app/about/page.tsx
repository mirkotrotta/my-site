import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'About Mirko Trotta',
  description: 'Learn more about Mirko Trotta, a full stack developer with a background in design, content, and web development.',
};

export default function AboutPage() {
  // Redirect to the default language about route
  redirect('/en/about');
  
  // This won't actually render, but is needed for TypeScript
  return null;
} 
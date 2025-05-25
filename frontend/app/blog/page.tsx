import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import BlogHero from '@/components/blog/BlogHero';
import CategoryBar from '@/components/blog/CategoryBar';
import BlogCard from '@/components/blog/BlogCard';
import CallToAction from '@/components/blog/CallToAction';
import Link from 'next/link';
import GlobalCTA from '@/components/ui/GlobalCTA';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL('http://127.0.0.1:4000'),
  title: 'System Logs – Dev Blog by Mirko Trotta',
  description: 'System Logs is the personal developer blog of Mirko Trotta, a full stack engineer based in Germany. Tutorials, case studies, and insights on backend systems, automation, and developer tools.',
  openGraph: {
    title: 'System Logs – Dev Blog by Mirko Trotta',
    description: 'Explore tutorials, backend insights, and real-world developer workflows on System Logs — the blog of Mirko Trotta, full stack engineer based in Germany.',
    type: 'website',
    locale: 'en_DE',
    images: [
      {
        url: '/images/trends-blog-mirko-trotta.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Posts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System Logs – Developer Blog by Mirko Trotta',
    description: 'Explore tutorials, backend insights, and real-world developer workflows on System Logs — the blog of Mirko Trotta, full stack engineer based in Germany.',
    images: ['/images/trends-blog-mirko-trotta.jpg'],
  },
};

export default function BlogPage() {
  // Redirect to the default language blog route
  redirect('/en/blog');
  
  // This won't actually render, but is needed for TypeScript
  return null;
}

import { Metadata } from 'next';
import Image from 'next/image';
import Layout from '@/components/Layout';
import SocialLinks from '@/components/SocialLinks';
import GlobalCTA from '@/components/ui/GlobalCTA';
import ClientBlogSection from '@/app/ClientBlogSection';
import SkillsServicesGrid from '@/components/ui/SkillsServicesGrid';
import { skillsData } from '@/lib/data';
import ButtonGroup from '@/components/ui/ButtonGroup';
import FeatureNormal from '@/components/ui/FeatureNormal';
import AboutContent from '../../../components/AboutContent';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about my mission, vision, and the technologies I use.',
  openGraph: {
    title: 'About Me',
    description: 'Learn more about my mission, vision, and the technologies I use.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Me',
    description: 'Learn more about my mission, vision, and the technologies I use.',
  },
};

export default function AboutPage() {
  return <AboutContent language="en" />;
} 
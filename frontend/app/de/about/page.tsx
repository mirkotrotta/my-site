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
  title: 'Über Mich',
  description: 'Erfahren Sie mehr über meine Mission, Vision und die Technologien, die ich verwende.',
  openGraph: {
    title: 'Über Mich',
    description: 'Erfahren Sie mehr über meine Mission, Vision und die Technologien, die ich verwende.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Über Mich',
    description: 'Erfahren Sie mehr über meine Mission, Vision und die Technologien, die ich verwende.',
  },
};

export default function AboutPage() {
  return <AboutContent language="de" />;
} 
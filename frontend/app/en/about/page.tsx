import { Metadata } from 'next';
import AboutContent from '../../../components/AboutContent';
import { PersonStructuredData } from '@/components/SEOStructuredData';

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
  return (
    <>
      <PersonStructuredData
        name="Mirko Trotta"
        jobTitle="Full Stack Developer"
        description="Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany."
        url="https://mirkotrotta.com/en/about"
        image="https://mirkotrotta.com/images/mirko-trotta-profile-aboutpage.jpg"
        sameAs={[
          "https://github.com/mirkotrotta",
          "https://linkedin.com/in/mirkotrotta"
        ]}
      />
      <AboutContent language="en" />
    </>
  );
} 
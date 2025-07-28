import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
  description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
  keywords: ['Full Stack Developer', 'React', 'Python', 'FastAPI', 'Docker', 'Next.js', 'TypeScript', 'Germany'],
  openGraph: {
    title: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
    type: 'website',
    locale: 'en_US',
    url: 'https://mirkotrotta.com/en',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full Stack Developer | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full stack developer with a background in design and digital production. Building scalable web apps with React, FastAPI, Docker, and CI/CD for cloud deployment. Based in Germany.',
    images: ['/images/mirko-trotta-profile-homepage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/en',
    languages: {
      'de': 'https://mirkotrotta.com/de',
    },
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en">
      {children}
    </div>
  );
} 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Stack Entwickler | React, Python, FastAPI, Docker | Mirko Trotta',
  description: 'Full Stack Entwickler mit Hintergrund in Design und digitaler Produktion. Entwicklung skalierbarer Webanwendungen mit React, FastAPI, Docker und CI/CD für Cloud-Deployment. Ansässig in Deutschland.',
  keywords: ['Full Stack Entwickler', 'React', 'Python', 'FastAPI', 'Docker', 'Next.js', 'TypeScript', 'Deutschland'],
  openGraph: {
    title: 'Full Stack Entwickler | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full Stack Entwickler mit Hintergrund in Design und digitaler Produktion. Entwicklung skalierbarer Webanwendungen mit React, FastAPI, Docker und CI/CD für Cloud-Deployment. Ansässig in Deutschland.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://mirkotrotta.com/de',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta - Full Stack Entwickler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full Stack Entwickler | React, Python, FastAPI, Docker | Mirko Trotta',
    description: 'Full Stack Entwickler mit Hintergrund in Design und digitaler Produktion. Entwicklung skalierbarer Webanwendungen mit React, FastAPI, Docker und CI/CD für Cloud-Deployment. Ansässig in Deutschland.',
    images: ['/images/mirko-trotta-profile-homepage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/de',
    languages: {
      'en': 'https://mirkotrotta.com/en',
    },
  },
};

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="de">
      {children}
    </div>
  );
} 
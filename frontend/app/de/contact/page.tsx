import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Kontakt | Mirko Trotta',
  description: 'Nehmen Sie Kontakt mit mir auf für Projektanfragen, Kooperationsmöglichkeiten oder einfach zum Vernetzen. Ich bin offen für neue Möglichkeiten und Partnerschaften.',
  keywords: ['Kontakt', 'Projektanfragen', 'Kooperation', 'Full Stack Entwickler', 'Webentwicklung'],
  openGraph: {
    title: 'Kontakt | Mirko Trotta',
    description: 'Nehmen Sie Kontakt mit mir auf für Projektanfragen, Kooperationsmöglichkeiten oder einfach zum Vernetzen. Ich bin offen für neue Möglichkeiten und Partnerschaften.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://mirkotrotta.com/de/contact',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-aboutpage.jpg',
        width: 1200,
        height: 630,
        alt: 'Kontakt Mirko Trotta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakt | Mirko Trotta',
    description: 'Nehmen Sie Kontakt mit mir auf für Projektanfragen, Kooperationsmöglichkeiten oder einfach zum Vernetzen.',
    images: ['/images/mirko-trotta-profile-aboutpage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/de/contact',
    languages: {
      'en': 'https://mirkotrotta.com/en/contact',
    },
  },
};

export default function ContactPage() {
  return <ContactContent language="de" />;
} 
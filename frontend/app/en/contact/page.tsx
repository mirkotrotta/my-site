import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Me | Mirko Trotta',
  description: 'Get in touch with me for project inquiries, collaboration opportunities, or just to connect. I\'m open to discussing new opportunities and partnerships.',
  keywords: ['Contact', 'Get in Touch', 'Project Inquiries', 'Collaboration', 'Full Stack Developer', 'Web Development'],
  openGraph: {
    title: 'Contact Me | Mirko Trotta',
    description: 'Get in touch with me for project inquiries, collaboration opportunities, or just to connect. I\'m open to discussing new opportunities and partnerships.',
    type: 'website',
    locale: 'en_US',
    url: 'https://mirkotrotta.com/en/contact',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-aboutpage.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Mirko Trotta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Me | Mirko Trotta',
    description: 'Get in touch with me for project inquiries, collaboration opportunities, or just to connect.',
    images: ['/images/mirko-trotta-profile-aboutpage.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/en/contact',
    languages: {
      'de': 'https://mirkotrotta.com/de/contact',
    },
  },
};

export default function ContactPage() {
  return <ContactContent language="en" />;
} 
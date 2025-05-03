import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Me | Mirko Trotta',
  description: 'Get in touch with me for project inquiries, collaboration opportunities, or just to connect.',
};

export default function ContactPage() {
  return <ContactContent language="en" />;
} 
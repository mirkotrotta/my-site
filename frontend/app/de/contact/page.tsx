import { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Kontakt | Mirko Trotta',
  description: 'Nehmen Sie Kontakt mit mir auf für Projektanfragen, Kooperationsmöglichkeiten oder einfach zum Vernetzen.',
};

export default function ContactPage() {
  return <ContactContent language="de" />;
} 
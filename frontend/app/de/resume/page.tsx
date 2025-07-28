import { Metadata } from "next";
import ResumeContent from "../../../components/ResumeContent";

export const metadata: Metadata = {
  title: "Lebenslauf | Mirko Trotta",
  description: "Beruflicher Werdegang, Fähigkeiten und Qualifikationen von Mirko Trotta, einem Full Stack Entwickler mit Fokus auf moderne Webtechnologien, Backend-Systeme und Automatisierung.",
  keywords: ['Lebenslauf', 'CV', 'Berufserfahrung', 'Fähigkeiten', 'Full Stack Entwickler', 'React', 'Python', 'FastAPI'],
  openGraph: {
    title: "Lebenslauf | Mirko Trotta",
    description: "Beruflicher Werdegang, Fähigkeiten und Qualifikationen von Mirko Trotta, einem Full Stack Entwickler mit Fokus auf moderne Webtechnologien, Backend-Systeme und Automatisierung.",
    type: 'website',
    locale: 'de_DE',
    url: 'https://mirkotrotta.com/de/resume',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-resume-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta Lebenslauf',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lebenslauf | Mirko Trotta",
    description: "Beruflicher Werdegang, Fähigkeiten und Qualifikationen von Mirko Trotta, einem Full Stack Entwickler.",
    images: ['/images/mirko-trotta-profile-resume-2025.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/de/resume',
    languages: {
      'en': 'https://mirkotrotta.com/en/resume',
    },
  },
};

export default function ResumePage() {
  return <ResumeContent language="de" />;
} 
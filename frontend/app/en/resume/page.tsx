import { Metadata } from "next";
import ResumeContent from "../../../components/ResumeContent";

export const metadata: Metadata = {
  title: "Resume | Mirko Trotta",
  description: "Professional career, skills, and qualifications of Mirko Trotta, a Full Stack Developer with focus on modern web technologies, backend systems, and automation.",
  keywords: ['Resume', 'CV', 'Professional Experience', 'Skills', 'Full Stack Developer', 'React', 'Python', 'FastAPI'],
  openGraph: {
    title: "Resume | Mirko Trotta",
    description: "Professional career, skills, and qualifications of Mirko Trotta, a Full Stack Developer with focus on modern web technologies, backend systems, and automation.",
    type: 'website',
    locale: 'en_US',
    url: 'https://mirkotrotta.com/en/resume',
    siteName: 'Mirko Trotta',
    images: [
      {
        url: '/images/mirko-trotta-profile-resume-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Mirko Trotta Resume',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Resume | Mirko Trotta",
    description: "Professional career, skills, and qualifications of Mirko Trotta, a Full Stack Developer.",
    images: ['/images/mirko-trotta-profile-resume-2025.jpg'],
  },
  alternates: {
    canonical: 'https://mirkotrotta.com/en/resume',
    languages: {
      'de': 'https://mirkotrotta.com/de/resume',
    },
  },
};

export default function ResumePage() {
  return <ResumeContent language="en" />;
} 
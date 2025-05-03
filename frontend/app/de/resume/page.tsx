import { Metadata } from "next";
import ResumeContent from "@/components/ResumeContent";

export const metadata: Metadata = {
  title: "Lebenslauf | Mirko Trotta",
  description: "Professioneller Werdegang, Fähigkeiten und Qualifikationen von Mirko Trotta, einem Full Stack Entwickler mit Schwerpunkt auf modernen Webtechnologien, Backend-Systemen und Automatisierung.",
};

export default function ResumePage() {
  return <ResumeContent language="de" />;
} 
import { Metadata } from "next";
import ResumeContent from "../../../components/ResumeContent";

export const metadata: Metadata = {
  title: "Resume | Mirko Trotta",
  description: "Professional career, skills, and qualifications of Mirko Trotta, a Full Stack Developer with focus on modern web technologies, backend systems, and automation.",
};

export default function ResumePage() {
  return <ResumeContent language="en" />;
} 
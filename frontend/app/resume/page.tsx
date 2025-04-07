// Tailwind Design System inspired by IBM Carbon
"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

interface ResumeEntry {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description?: string;
  location?: string;
  role_type?: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetch("http://localhost:8000/api/resume/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch resume");
        return res.json();
      })
      .then((data: ResumeEntry[]) => setResume(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout darkMode={darkMode} toggleDarkMode={() => setDarkMode((prev) => !prev)}>
      <h1 className="text-3xl font-semibold tracking-tight border-b border-gray-300 dark:border-gray-700 pb-2 mb-6">
        My Resume
      </h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-8">
        {resume.map((entry) => (
          <div key={entry.id} className="border-l border-gray-400 dark:border-gray-600 pl-6 relative">
            <div className="absolute top-1 left-0 w-3 h-3 bg-gray-700 dark:bg-gray-300 -ml-1.5" />
            <h2 className="text-xl font-medium leading-snug">
              {entry.title} @ {entry.company}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {entry.start_date} - {entry.end_date ?? "Present"}
            </p>
            <p className="text-sm leading-relaxed mt-2">
              {entry.description}
            </p>
            <p className="text-xs text-gray-500 italic mt-1">
              {entry.role_type} | {entry.location}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

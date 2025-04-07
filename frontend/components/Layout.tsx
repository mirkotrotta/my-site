"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Sun, Moon, Menu, Close } from "@carbon/icons-react";
import SocialLinks from "@/components/SocialLinks";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  return (
    <div className="font-sans text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <span className="font-bold text-lg tracking-tight">Mirko</span>
            </Link>
            <nav className="hidden md:flex space-x-4 text-sm">
              <Link href="/resume" className="hover:underline">Resume</Link>
              <Link href="/projects" className="hover:underline">Projects</Link>
              <Link href="/blog" className="hover:underline">Blog</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="border border-gray-400 dark:border-gray-600 p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden border border-gray-400 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <Close size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2 bg-white dark:bg-gray-900">
            <Link href="/resume" className="block hover:underline">Resume</Link>
            <Link href="/projects" className="block hover:underline">Projects</Link>
            <Link href="/blog" className="block hover:underline">Blog</Link>
            <Link href="/contact" className="block hover:underline">Contact</Link>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
        {children}
      </main>

      <footer className="mt-auto border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs py-8 text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold">Mirko – Full-stack Developer</p>
          <p className="mt-1">Remote | Open Source Contributor</p>
          <SocialLinks className="mt-3 justify-center" />
          <p className="mt-4 text-gray-400">© {new Date().getFullYear()} Mirko. Built with Next.js & FastAPI.</p>
        </div>
      </footer>
    </div>
  );
}

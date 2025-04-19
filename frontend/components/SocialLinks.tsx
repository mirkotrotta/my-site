"use client";

import { SiGithub, SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import clsx from "clsx";

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={clsx("flex gap-4", className)}>
      <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <SiGithub size={36} className="hover:text-gray-900 dark:hover:text-white" />
      </a>
      <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <SiLinkedin size={36} className="hover:text-gray-900 dark:hover:text-white" />
      </a>
      <a href="mailto:you@example.com" aria-label="Email">
        <Mail size={36} className="hover:text-gray-900 dark:hover:text-white" />
      </a>
    </div>
  );
}

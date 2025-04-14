"use client";

import { SiGithub } from "react-icons/si";

export interface Project {
  name: string;
  description: string;
  url: string;
  stars: number;
  updated: string;
  language: string | null;
  topics?: string[];
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  HTML: "bg-orange-500",
  CSS: "bg-indigo-500",
  Shell: "bg-gray-500",
  Java: "bg-red-500",
};

const topicColors: Record<string, string> = {
  showcase: "bg-blue-100 text-blue-700",
  react: "bg-purple-100 text-purple-700",
  python: "bg-green-100 text-green-700",
  javascript: "bg-yellow-100 text-yellow-700",
  markdown: "bg-pink-100 text-pink-700",
  tool: "bg-gray-200 text-gray-700",
};

export default function ProjectCard({ project }: { project: Project }) {
  const langColor = project.language ? languageColors[project.language] || "bg-gray-400" : "bg-gray-400";

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-white dark:bg-gray-800"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold truncate text-blue-700 dark:text-blue-300">{project.name}</h2>
        <SiGithub size={18} className="text-gray-600 dark:text-gray-300" />
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">{project.description}</p>

      <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3 gap-y-1">
        {project.language && (
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 ${langColor}`} />
            {project.language}
          </span>
        )}

        <span>⭐ {project.stars}</span>
        <span>Updated {new Date(project.updated).toLocaleDateString()}</span>
      </div>

      {project.topics && project.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.topics.map((topic) => {
            const style = topicColors[topic.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
            return (
              <span
                key={topic}
                className={`text-xs px-2 py-1 hover:opacity-80 transition ${style}`}
              >
                #{topic}
              </span>
            );
          })}
        </div>
      )}
    </a>
  );
}
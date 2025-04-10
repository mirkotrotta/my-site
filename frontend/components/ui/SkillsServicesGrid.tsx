"use client";

import { ReactNode } from 'react';

type SkillOrService = {
  title: string;
  description: string;
  icon: ReactNode;
};

interface SkillsServicesGridProps {
  items: SkillOrService[];
  className?: string;
}

export default function SkillsServicesGrid({ items, className = '' }: SkillsServicesGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index}
          className="group border border-gray-200 dark:border-gray-700 p-6 hover:bg-gradient-to-br from-blue-50 to-blue-100 dark:hover:from-blue-900 dark:hover:to-blue-800 transition-all duration-200"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="text-blue-600 dark:text-blue-400 mr-3">
                {item.icon}
              </div>
              <h3 className="font-medium">{item.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 
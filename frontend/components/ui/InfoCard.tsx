import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
}

export default function InfoCard({ title, icon: Icon, children }: InfoCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 p-6 shadow-sm bg-white dark:bg-gray-800 flex items-start gap-4">
      <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
         <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
} 
import { ReactNode } from 'react';
import Link from 'next/link';

export type ContentItem = {
  title: string;
  href: string;
  date?: string;
  summary?: string;
};

export type SidebarSection = {
  title: string;
  items: ContentItem[];
  viewAllLink?: string;
};

type SidebarBProps = {
  sections: SidebarSection[];
  title?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * SidebarB - A sidebar component for related content with IBM-style minimal design
 * Used primarily for displaying related posts, recent content, or other supplementary information
 */
export default function SidebarB({ sections, title, className = '', children }: SidebarBProps) {
  const uniqueTitles = new Set();

  return (
    <aside className={`sm:border-l sm:pl-6 border-l-0 pl-0 border-gray-100 dark:border-gray-800 sticky top-24 self-start ${className}`}>
      {title && (
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
          <h3 className="font-normal text-gray-700 dark:text-gray-300 text-sm">{title}</h3>
        </div>
      )}
      {/* Newsletter subscription (children) at the top */}
      {children && (
        <div className="pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
      <div className="space-y-8">
        {sections.map((section, index) => {
          // Check for duplicate titles
          let displayTitle = section.title;
          let count = 1;

          while (uniqueTitles.has(displayTitle)) {
            count++;
            displayTitle = `${section.title} (${count})`; // Append count to make it unique
          }
          uniqueTitles.add(displayTitle);

          return (
            <div key={index} className="mb-6">
              <h4 className="text-lg text-gray-500 dark:text-gray-400 mb-4 font-normal">
                {displayTitle}
              </h4>
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="border-l-0">
                    <Link href={item.href} className="block group">
                      <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </h5>
                      {item.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      )}
                      {item.summary && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              {section.viewAllLink && (
                <div className="mt-3">
                  <Link 
                    href={section.viewAllLink} 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
} 
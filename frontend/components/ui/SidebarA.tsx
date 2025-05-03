import { ReactNode } from 'react';
import Link from 'next/link';
import useTranslation from '@/hooks/useTranslation';

export type NavigationItem = {
  title: string;
  href: string;
  active?: boolean;
  items?: NavigationItem[];
};

type SidebarAProps = {
  items: NavigationItem[];
  title?: string;
  className?: string;
};

/**
 * SidebarA - A content navigation sidebar component with IBM-style minimal styling
 * Used primarily for table of contents that sticks while scrolling
 */
export default function SidebarA({ items, title, className = '' }: SidebarAProps) {
  const { t } = useTranslation();
  
  // Get translation text with proper fallbacks
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return (translated && translated !== key) ? translated : fallback;
  };
  
  return (
    <aside className={`border-0 bg-transparent sticky top-24 self-start ${className}`}>
      {title && (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
          <h4 className="font-normal text-gray-500 dark:text-gray-300 text-sm">
            {title}
          </h4>
        </div>
      )}
      
      {items.length > 0 ? (
        <nav className="overflow-y-auto max-h-[calc(100vh-200px)] pr-2 -mr-2">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </nav>
      ) : (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic">
          {getText('blog.toc.noHeadings', 'No headings found')}
        </div>
      )}
    </aside>
  );
}

type NavItemProps = {
  item: NavigationItem;
  level?: number;
};

function NavItem({ item, level = 0 }: NavItemProps) {
  // Use inline style for padding, since Tailwind doesn't support dynamic classnames for pl-*
  const paddingLeft = { paddingLeft: `${level * 12}px` };
  const activeClass = item.active
    ? 'text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-500 pl-2'
    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 pl-2';

  return (
    <li>
      <Link
        href={item.href}
        className={`block py-1 text-sm ${activeClass} no-underline transition-colors`}
        style={level > 0 ? paddingLeft : undefined}
      >
        {item.title}
      </Link>
      {/* Recursive rendering of nested items */}
      {item.items && item.items.length > 0 && (
        <ul className="mt-1">
          {item.items.map((subItem, index) => (
            <NavItem key={index} item={subItem} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
} 
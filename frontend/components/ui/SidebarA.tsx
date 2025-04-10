import { ReactNode } from 'react';
import Link from 'next/link';

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
  return (
    <aside className={`border-0 bg-transparent sticky top-24 self-start ${className}`}>
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">{title}</h3>
        </div>
      )}
      <nav>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

type NavItemProps = {
  item: NavigationItem;
  level?: number;
};

function NavItem({ item, level = 0 }: NavItemProps) {
  const paddingLeft = level > 0 ? `pl-${level * 3}` : '';
  const activeClass = item.active
    ? 'text-blue-600 dark:text-blue-400 font-medium'
    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <li>
      <Link
        href={item.href}
        className={`block py-1 text-sm ${paddingLeft} ${activeClass} no-underline`}
      >
        {item.title}
      </Link>
      
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
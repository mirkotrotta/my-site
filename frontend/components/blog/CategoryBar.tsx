import Link from 'next/link';

type CategoryBarProps = {
  tags: string[];
  currentTag?: string;
};

export default function CategoryBar({ tags, currentTag }: CategoryBarProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 md:mb-14 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-0">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-6 py-3">
          Filter by Category:
        </span>
        {/* "All" link */}
        <Link 
          href="/blog"
          className={`
            py-3 px-4 text-sm font-medium border-b-2 transition-colors
            ${!currentTag 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
              : 'border-transparent text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400'
            }
          `}
        >
          All
        </Link>
        {/* Individual tag links */}
        {tags.map(tag => {
          const isActive = currentTag?.toLowerCase() === tag.toLowerCase();
          return (
            <Link 
              key={tag} 
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`
                py-3 px-4 text-sm font-medium border-b-2 transition-colors
                ${isActive 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400'
                }
              `}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </section>
  );
} 